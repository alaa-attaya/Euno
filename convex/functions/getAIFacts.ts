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
      .query("facts")
      .withIndex("by_category_and_ai", (q) =>
        q.eq("categoryId", categoryId).eq("is_ai_generated", true)
      )
      .order("desc") // sorts by _creationTime automatically
      .paginate(paginationOpts);

    return page;
  },
});
