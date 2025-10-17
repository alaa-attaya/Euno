import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { internalMutation } from "../_generated/server";

export const insertOrUpdateAIFact = internalMutation({
  args: {
    title: v.string(),
    content: v.string(),
    categoryId: v.id("categories"),
    image: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
    embedding: v.array(v.float64()),
    is_ai_generated: v.boolean(),
  },
  handler: async (
    ctx,
    { title, content, categoryId, image, storageId, embedding, is_ai_generated }
  ) => {
    const existingFact = await ctx.db
      .query("facts")
      .withIndex("by_category", (q) => q.eq("categoryId", categoryId))
      .filter((q) => q.eq(q.field("title"), title))
      .first();

    let factId: Id<"facts">;
    let inserted = false;

    if (existingFact) {
      if (existingFact.content !== content) {
        await ctx.db.patch(existingFact._id, { content, is_ai_generated });
      }
      factId = existingFact._id;
    } else {
      factId = await ctx.db.insert("facts", {
        title,
        content,
        categoryId,
        image: image ?? undefined,
        storageId: storageId ?? undefined,
        is_ai_generated,
      });
      inserted = true;
    }

    // Upsert embedding
    const existingEmbedding = await ctx.db
      .query("embeddings_1536")
      .withIndex("by_fact", (q) => q.eq("factId", factId))
      .first();

    if (existingEmbedding) {
      await ctx.db.patch(existingEmbedding._id, { embedding });
    } else {
      const embeddingId = await ctx.db.insert("embeddings_1536", {
        embedding,
        model: "gemini-embedding-001",
        factId,
        categoryId,
      });

      await ctx.db.patch(factId, {
        embeddingId,
        embeddingModel: "gemini-embedding-001",
      });
    }

    return { factId, inserted };
  },
});
