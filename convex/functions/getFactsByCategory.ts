// convex/functions/getFactsByCategory.ts
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "../_generated/server";

export const getFactsByCategory = query({
  args: {
    paginationOpts: paginationOptsValidator,
    categoryId: v.id("categories"),
  },
  handler: async ({ db, storage }, { paginationOpts, categoryId }) => {
    // 1️⃣ Fetch facts from the database
    const pageResult = await db
      .query("facts")
      .withIndex("by_category", (q) => q.eq("categoryId", categoryId))
      .order("desc")
      .paginate(paginationOpts);

    // 2️⃣ Generate imageUrl for each fact
    const pageWithUrls = await Promise.all(
      pageResult.page.map(async (fact) => ({
        ...fact,
        imageUrl: fact.storageId
          ? await storage.getUrl(fact.storageId) // use Id<_storage>
          : fact.image?.trim() || null, // fallback to image URL
      }))
    );

    // 3️⃣ Return paginated result with URLs
    return {
      page: pageWithUrls,
      continueCursor: pageResult.continueCursor,
      isDone: pageResult.isDone,
    };
  },
});
