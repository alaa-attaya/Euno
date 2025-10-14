import { v } from "convex/values";
import { api, internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { action } from "../_generated/server";

// --------------------------
// Types
// --------------------------
type AIFact = { title: string; content: string };

type GenerateAIFactsArgs = { categoryId: Id<"categories"> };

type GenerateAIFactsResult = {
  category: string;
  requested: number;
  inserted: number;
  factIds: Id<"facts">[];
};

// --------------------------
// Action
// --------------------------
export const generateAIFacts = action({
  args: { categoryId: v.id("categories") },

  handler: async (
    ctx,
    { categoryId }: GenerateAIFactsArgs
  ): Promise<GenerateAIFactsResult> => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");

    // 1️⃣ Fetch category info
    const category = await ctx.runQuery(
      api.functions.getCategoryById.getCategoryById,
      { id: categoryId }
    );
    if (!category) throw new Error("Category not found");

    // 2️⃣ Rate-limit: 1 generation per 60s
    const lastFactPage = await ctx.runQuery(
      api.functions.getAIFacts.getAIFacts,
      {
        categoryId,
        paginationOpts: { numItems: 1, cursor: null },
      }
    );
    const lastFact = lastFactPage.page[0];
    if (lastFact && Date.now() - lastFact._creationTime < 60_000) {
      throw new Error(
        "Please wait at least 60 seconds before regenerating facts."
      );
    }

    // 3️⃣ Build prompt for AI
    const prompt = `
Generate 20-30 short, unique, educational facts about "${category.name}".
Return ONLY a valid JSON array of objects with:
  "title": a catchy 3-8 word phrase (no punctuation, only normal letters and numbers)
  "content": one clear fact sentence (max 50 words, use only standard English letters, numbers, spaces, and basic punctuation like . ,)
No special characters, emojis, or symbols. Only plain ASCII characters.
No explanations or extra text.
`;

    // 4️⃣ Call Gemini API
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 3000 },
        }),
      }
    );

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    // 5️⃣ Parse JSON
    let facts: AIFact[] = [];
    try {
      facts = JSON.parse(text);
      if (!Array.isArray(facts)) throw new Error("Gemini response not array");
    } catch (err) {
      console.error("Gemini invalid JSON:", text);
      throw new Error("Gemini output invalid JSON");
    }

    // 6️⃣ Filter duplicates (against only AI-generated facts)
    const existingFactsPage = await ctx.runQuery(
      api.functions.getAIFacts.getAIFacts,
      {
        categoryId,
        paginationOpts: { numItems: 1000, cursor: null },
      }
    );
    const existingFacts: { title: string; content: string }[] =
      existingFactsPage.page;

    const uniqueFacts = facts.filter(
      (f) =>
        !existingFacts.some(
          (ef) =>
            ef.title.toLowerCase() === f.title.toLowerCase() ||
            ef.content.toLowerCase() === f.content.toLowerCase()
        )
    );

    // 7️⃣ Insert facts using internal mutation
    const factIds: Id<"facts">[] = [];
    for (const fact of uniqueFacts) {
      const id = await ctx.runMutation(
        internal.functions.insertAIFact.insertAIFact,
        {
          categoryId,
          title: fact.title.trim(),
          content: fact.content.trim(),
        }
      );
      factIds.push(id);
    }

    // 8️⃣ Return results
    return {
      category: category.name,
      requested: facts.length,
      inserted: factIds.length,
      factIds,
    };
  },
});
