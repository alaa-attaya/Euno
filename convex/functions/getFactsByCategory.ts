import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "../_generated/server";

export const getFactsByCategory = query({
  args: {
    paginationOpts: paginationOptsValidator,
    categoryId: v.id("categories"),
  },
  handler: async ({ db }, { paginationOpts, categoryId }) => {
    // Fetch batches from both tables using the correct index
    const seededPage = await db
      .query("seeded_facts")
      .withIndex("by_category", (q) => q.eq("categoryId", categoryId))
      .order("desc") // sorts by _creationTime automatically
      .paginate(paginationOpts);

    const aiPage = await db
      .query("ai_facts")
      .withIndex("by_category", (q) => q.eq("categoryId", categoryId))
      .order("desc")
      .paginate(paginationOpts);

    // Merge both pages and sort by _creationTime descending
    const merged = [...seededPage.page, ...aiPage.page].sort(
      (a, b) => b._creationTime - a._creationTime
    );

    // Compute a single continueCursor by keeping both table cursors
    const continueCursor =
      seededPage.isDone && aiPage.isDone
        ? null
        : { seeded: seededPage.continueCursor, ai: aiPage.continueCursor };

    // isDone when both tables are exhausted
    const isDone = seededPage.isDone && aiPage.isDone;

    return {
      page: merged,
      continueCursor,
      isDone,
    };
  },
});
