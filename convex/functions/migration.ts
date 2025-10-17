import { internalMutation } from "../_generated/server";

export const migrateImageUrlsToStorageIds = internalMutation({
  handler: async (ctx) => {
    console.log("🚀 Starting migration...");

    // Get all facts with image URLs but no storageId
    const facts = await ctx.db
      .query("facts")
      .filter((q) =>
        q.and(
          q.neq(q.field("image"), undefined),
          q.neq(q.field("image"), ""),
          q.eq(q.field("storageId"), undefined)
        )
      )
      .collect();

    console.log(`Found ${facts.length} facts to migrate`);

    // Get all storage files
    const allFiles = await ctx.db.system.query("_storage").collect();
    console.log(`Found ${allFiles.length} files in storage`);

    let migrated = 0;
    let notFound = 0;

    for (const fact of facts) {
      if (!fact.image) continue;

      // Find matching storage ID
      let foundStorageId = null;
      for (const file of allFiles) {
        const fileUrl = await ctx.storage.getUrl(file._id);
        if (fileUrl === fact.image) {
          foundStorageId = file._id;
          break;
        }
      }

      if (foundStorageId) {
        await ctx.db.patch(fact._id, {
          storageId: foundStorageId,
        });
        console.log(`✅ Migrated: ${fact.title}`);
        migrated++;
      } else {
        console.warn(`⚠️ No storage ID found for: ${fact.title}`);
        notFound++;
      }
    }

    return {
      total: facts.length,
      migrated,
      notFound,
    };
  },
});
