// convex/functions/getFactByTitleOrContentAndCategory.ts
import { v } from "convex/values";
import { internalQuery } from "../_generated/server";

export const getFactByTitleOrContentAndCategory = internalQuery({
  args: {
    title: v.string(),
    content: v.string(),
    categoryId: v.id("categories"),
  },
  handler: async (ctx, { title, content, categoryId }) => {
    const facts = await ctx.db
      .query("facts")
      .withIndex("by_category", (q) => q.eq("categoryId", categoryId))
      .filter((q) =>
        q.or(q.eq(q.field("title"), title), q.eq(q.field("content"), content))
      )
      .collect();

    return facts.length > 0 ? facts[0] : null;
  },
});
