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
    image: v.optional(v.string()),
  },
  handler: async ({ db }, { categoryId, title, content, image }) => {
    return await db.insert("facts", {
      categoryId,
      title,
      content,
      is_ai_generated: true,
      image,
    });
  },
});
