// convex/functions/getAllFacts.ts
import { paginationOptsValidator } from "convex/server";
import { query } from "../_generated/server";

export const getAllFacts = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async ({ db, storage }, { paginationOpts }) => {
    // 1️⃣ Fetch facts from the database
    const pageResult = await db
      .query("facts")
      .order("desc") // sorts by _creationTime automatically
      .paginate(paginationOpts);

    // 2️⃣ Generate imageUrl for each fact
    const pageWithUrls = await Promise.all(
      pageResult.page.map(async (fact) => ({
        ...fact,
        imageUrl: fact.storageId
          ? await storage.getUrl(fact.storageId) // ✅ use Id<_storage>
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
