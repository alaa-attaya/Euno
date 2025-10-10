import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "../_generated/server";

export const getFactsByCategory = query({
  args: {
    paginationOpts: paginationOptsValidator,
    categoryId: v.id("categories"),
  },
  handler: async ({ db }, { paginationOpts, categoryId }) => {
    // Fetch a batch from both tables
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

    // Merge and sort by creation time
    const merged = [...seededPage.page, ...aiPage.page].sort(
      (a, b) => b._creationTime - a._creationTime
    );

    // Decide which table to fetch next from based on cursors
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
