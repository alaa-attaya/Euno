// seed/fillMissingEmbeddings.ts
import { internal } from "../_generated/api";
import { internalAction } from "../_generated/server";

export const fillMissingEmbeddings = internalAction({
  handler: async (ctx) => {
    // Fetch all facts that are missing embeddings using internal query
    const facts = await ctx.runQuery(
      internal.seed.getMissingEmbeddingsFacts.getMissingEmbeddingsFacts,
      {}
    );

    console.log(`Found ${facts.length} facts missing embeddings.`);

    const results: Array<{ factId: string; success: boolean; error?: string }> =
      [];

    for (let i = 0; i < facts.length; i++) {
      const fact = facts[i];
      try {
        console.log(
          `[${i + 1}/${facts.length}] Processing fact: ${fact.title}`
        );

        // Generate embedding using title + content
        const embedding = await ctx.runAction(
          internal.functions.embedGemini.embedGeminiText,
          { text: `${fact.title}. ${fact.content}` }
        );

        // Update embedding using insertOrUpdateFact
        await ctx.runMutation(internal.seed.facts.insertOrUpdateFact, {
          title: fact.title,
          content: fact.content,
          categoryId: fact.categoryId,
          image: fact.image ?? undefined,
          storageId: fact.storageId ?? undefined,
          embedding,
        });

        results.push({ factId: fact._id, success: true });
      } catch (err: any) {
        console.error(`Error processing fact ${fact.title}:`, err.message);
        results.push({ factId: fact._id, success: false, error: err.message });
      }
    }

    console.log("Done processing all facts.");
    return results;
  },
});
