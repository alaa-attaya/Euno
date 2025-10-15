import { internalQuery } from "../_generated/server";

export const getCategoriesInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});
