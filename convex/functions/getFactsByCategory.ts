import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "../_generated/server";

export const getFactsByCategory = query({
  args: {
    paginationOpts: paginationOptsValidator,
    categoryId: v.id("categories"),
  },
  handler: async ({ db }, { paginationOpts, categoryId }) => {
    // Fetch batches from both tables
    const seededPage = await db
      .query("seeded_facts")
      .withIndex("by_category_and_time", (q) => q.eq("categoryId", categoryId))
      .order("desc")
      .paginate(paginationOpts);

    const aiPage = await db
      .query("ai_facts")
      .withIndex("by_category_and_time", (q) => q.eq("categoryId", categoryId))
      .order("desc")
      .paginate(paginationOpts);

    // Merge and sort by _creationTime descending
    const merged = [...seededPage.page, ...aiPage.page].sort(
      (a, b) => b._creationTime - a._creationTime
    );

    // Compute a single continueCursor by picking the latest cursor from each table
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
