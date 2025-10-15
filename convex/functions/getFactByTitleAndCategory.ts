import { v } from "convex/values";
import { internalQuery } from "../_generated/server";

export const getFactByTitleAndCategory = internalQuery({
  args: {
    title: v.string(),
    categoryId: v.id("categories"),
  },
  handler: async (ctx, { title, categoryId }) => {
    const facts = await ctx.db
      .query("facts")
      .withIndex("by_category_and_title", (q) =>
        q.eq("categoryId", categoryId).eq("title", title)
      )
      .collect();

    return facts[0] ?? null;
  },
});
