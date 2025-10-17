// seed/getMissingEmbeddingsFacts.ts
import { internalQuery } from "../_generated/server";

export const getMissingEmbeddingsFacts = internalQuery({
  args: {},
  handler: async (ctx) => {
    // Fetch all facts
    const allFacts = await ctx.db.query("facts").collect();

    // Filter those that don't have embeddingId set
    const missingEmbeddingFacts = allFacts.filter((fact) => !fact.embeddingId);

    return missingEmbeddingFacts;
  },
});
