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
  },
  handler: async ({ db }, { categoryId, title, content }) => {
    return await db.insert("ai_facts", {
      categoryId,
      title,
      content,
    });
  },
});
