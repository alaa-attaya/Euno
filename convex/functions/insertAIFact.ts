import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

/**
 * Insert a single AI fact (internal use only)
 */
export const insertAIFact = internalMutation({
  args: {
    categoryId: v.id("categories"),
    title: v.string(),
    content: v.string(),
    image: v.optional(v.string()), // URL for convenience
    storageId: v.optional(v.id("_storage")), // Convex storage ID
    is_ai_generated: v.boolean(),
  },
  handler: async (
    { db },
    { categoryId, title, content, image, storageId, is_ai_generated }
  ) => {
    return await db.insert("facts", {
      categoryId,
      title,
      content,
      image, // store URL
      storageId, // store storage ID
      is_ai_generated,
    });
  },
});
