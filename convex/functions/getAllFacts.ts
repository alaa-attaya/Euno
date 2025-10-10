import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "../_generated/server";

export const getFactsByCategory = query({
  args: {
    paginationOpts: paginationOptsValidator,
    categoryId: v.id("categories"),
  },
  handler: async ({ db }, { paginationOpts, categoryId }) => {
    // Fetch a batch from seeded facts
    const seededPage = await db
      .query("seeded_facts")
      .withIndex("by_category", (q) => q.eq("categoryId", categoryId))
      .order("desc") // sorts by _creationTime automatically
      .paginate(paginationOpts);

    // Fetch a batch from AI-generated facts
    const aiPage = await db
      .query("ai_facts")
      .withIndex("by_category", (q) => q.eq("categoryId", categoryId))
      .order("desc")
      .paginate(paginationOpts);

    // Merge both pages and sort by _creationTime descending
    const merged = [...seededPage.page, ...aiPage.page].sort(
      (a, b) => b._creationTime - a._creationTime
    );

    // Keep track of individual cursors
    const continueCursor = {
      seeded: seededPage.continueCursor,
      ai: aiPage.continueCursor,
    };

    const isDone = seededPage.isDone && aiPage.isDone;

    return {
      page: merged,
      continueCursor,
      isDone,
    };
  },
});
