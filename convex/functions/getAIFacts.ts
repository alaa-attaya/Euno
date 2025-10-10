import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "../_generated/server";

export const getAIFacts = query({
  args: {
    paginationOpts: paginationOptsValidator,
    categoryId: v.id("categories"),
  },
  handler: async ({ db }, { paginationOpts, categoryId }) => {
    const page = await db
      .query("ai_facts")
      .withIndex("by_category", (q) => q.eq("categoryId", categoryId))
      .order("desc")
      .paginate(paginationOpts);

    return page;
  },
});
