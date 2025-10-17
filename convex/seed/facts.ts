import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { internalMutation } from "../_generated/server";

export const insertOrUpdateFact = internalMutation({
  args: {
    title: v.string(),
    content: v.string(),
    categoryId: v.id("categories"),
    image: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
    embedding: v.array(v.float64()),
  },
  handler: async (
    ctx,
    { title, content, categoryId, image, storageId, embedding }
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
        await ctx.db.patch(existingFact._id, { content });
      }
      factId = existingFact._id;
    } else {
      factId = await ctx.db.insert("facts", {
        title,
        content,
        categoryId,
        is_ai_generated: false,
        image: image ?? undefined,
        storageId: storageId ?? undefined,
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

    return { factId, inserted }; // ✅ now we return whether it was newly inserted
  },
});
