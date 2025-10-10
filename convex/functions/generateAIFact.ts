import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const generateAIFact = mutation({
  args: {
    categoryId: v.id("categories"),
    title: v.string(),
    content: v.string(),
    image: v.optional(v.string()),
  },
  handler: async ({ db }, { categoryId, title, content, image }) => {
    const newFact = {
      categoryId,
      title,
      content,
      image,
      generated_at: Date.now(),
    };

    const factId = await db.insert("ai_facts", newFact);
    return { ...newFact, _id: factId };
  },
});
