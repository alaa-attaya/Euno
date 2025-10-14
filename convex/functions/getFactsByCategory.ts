import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "../_generated/server";

export const getFactsByCategory = query({
  args: {
    paginationOpts: paginationOptsValidator,
    categoryId: v.id("categories"),
  },
  handler: async ({ db }, { paginationOpts, categoryId }) => {
    // Fetch from the single facts table
    const pageResult = await db
      .query("facts")
      .withIndex("by_category", (q) => q.eq("categoryId", categoryId))
      .order("desc") // sorts by _creationTime automatically
      .paginate(paginationOpts);

    return {
      page: pageResult.page,
      continueCursor: pageResult.continueCursor,
      isDone: pageResult.isDone,
    };
  },
});
