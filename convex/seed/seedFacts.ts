// functions/seedFacts.ts
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { internalAction } from "../_generated/server";

export const seedFacts = internalAction({
  handler: async (ctx) => {
    type FactEntry = {
      title: string;
      content: string;
      image?: string;
      storageId?: Id<"_storage">;
    };

    // Facts grouped by category
    const factsByCategory: Record<string, FactEntry[]> = {
      //   General: [
      //     {
      //       title: "Bananas are radioactive",
      //       content:
      //         "Bananas contain potassium-40, a naturally radioactive isotope.",
      //     },
      //   ],
      //   Science: [
      //     {
      //       title: "Water Expands When Frozen",
      //       content: "Ice is less dense than water, so it floats.",
      //     },
      //   ],
    };

    // Fetch categories via internal query
    const categories = await ctx.runQuery(
      internal.functions.getCategoriesInternal.getCategoriesInternal,
      {}
    );

    // Map category name → ID
    const categoryMap: Record<string, Id<"categories">> = {};
    for (const cat of categories) {
      categoryMap[cat.name] = cat._id;
    }

    const results: Record<
      Id<"facts">,
      { categoryId: Id<"categories">; title: string; inserted: boolean }
    > = {};

    // Loop over categories in factsByCategory order
    for (const [categoryName, facts] of Object.entries(factsByCategory)) {
      const categoryId = categoryMap[categoryName];
      if (!categoryId) continue; // skip if category doesn't exist

      // seedFacts.ts
      for (const fact of facts) {
        const embedding = await ctx.runAction(
          internal.functions.embedGemini.embedGeminiText,
          { text: `${fact.title}. ${fact.content}` }
        );

        const similar = await ctx.vectorSearch(
          "embeddings_1536",
          "by_embedding",
          {
            vector: embedding,
            limit: 1,
            filter: (q) => q.eq("categoryId", categoryId),
          }
        );

        const threshold = 0.9;
        if (similar.length > 0 && similar[0]._score >= threshold) {
          console.log(`[SEED] Skipping fact "${fact.title}" - too similar`);
          continue;
        }

        // Only insert if not too similar
        const { factId, inserted } = await ctx.runMutation(
          internal.seed.facts.insertOrUpdateFact,
          {
            title: fact.title,
            content: fact.content,
            categoryId,
            image: fact.image,
            storageId: fact.storageId,
            embedding,
          }
        );

        results[factId] = { categoryId, title: fact.title, inserted };
      }
    }

    return results;
  },
});
