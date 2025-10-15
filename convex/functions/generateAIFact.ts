// functions/internal/generateAIFactsAction.ts
import { GoogleGenAI } from "@google/genai";
import { internal } from "../_generated/api";
import { internalAction } from "../_generated/server";

export type AIFact = {
  category: string;
  title: string;
  content: string;
  imageNeeded: boolean;
};

export type GenerateAIFactsResult = {
  requested: number;
  inserted: number;
  factIds: string[];
  categoriesProcessed: string[];
};

// --------------------------
// Internal action to generate AI facts
// --------------------------
export const generateAIFactsAction = internalAction({
  args: {},
  handler: async (ctx, args): Promise<GenerateAIFactsResult> => {
    console.log(`[AI FACTS] Action started at ${new Date().toISOString()}`);

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    // --- Fetch categories using internal query ---
    const categories = await ctx.runQuery(
      internal.functions.getCategoriesInternal.getCategoriesInternal,
      {}
    );
    if (!categories.length) throw new Error("No categories found");

    console.log(
      `[AI FACTS] Categories: ${categories.map((c) => c.name).join(", ")}`
    );

    // --- Generate text facts ---
    const prompt = `
Generate 3 unique educational facts for these categories: ${categories
      .map((c) => c.name)
      .join(", ")}.

Each fact must be an object with exactly these fields:
- category (string)
- title (string)
- content (string)
- imageNeeded (boolean)

Return ONLY a **pure JSON array**, nothing else. Do NOT include markdown, code fences, comments, or any extra text. Example:

[
  {
    "category": "Science",
    "title": "The Sun is a star",
    "content": "The Sun is a medium-sized star in our galaxy.",
    "imageNeeded": true
  }
]
`;

    console.log("[AI FACTS] Sending prompt to text generation model...");
    const textResp = await ai.models.generateContent({
      model: "imagen-3.0-generate",
      contents: prompt,
      config: { temperature: 0.8, maxOutputTokens: 5000 },
    });

    const rawText = textResp.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";

    // --- Helper to clean any stray characters just in case ---
    function extractJSON(text: string) {
      const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/^\s+|\s+$/g, ""); // trim
      return JSON.parse(cleaned);
    }

    const facts: AIFact[] = extractJSON(rawText);
    console.log(`[AI FACTS] Generated ${facts.length} facts`);

    // --- Generate images in batches ---
    const imageFacts = facts.filter((f) => f.imageNeeded);
    console.log(`[AI FACTS] ${imageFacts.length} facts require images`);

    const imageMap: Record<string, string> = {};
    const BATCH_SIZE = 5;

    for (let i = 0; i < imageFacts.length; i += BATCH_SIZE) {
      const batch = imageFacts.slice(i, i + BATCH_SIZE);
      console.log(
        `[AI FACTS] Generating images for batch ${i / BATCH_SIZE + 1}`
      );

      const prompts = batch.map((f) => `${f.title}: ${f.content}`).join("\n\n");

      const imageResp = await ai.models.generateImages({
        model: "gemini-2.0-flash-preview-image-generation",
        prompt: prompts,
        config: { numberOfImages: batch.length },
      });

      batch.forEach((f, j) => {
        const b64 = imageResp?.generatedImages?.[j]?.image?.imageBytes ?? "";
        imageMap[`${f.category}|${f.title}`] = b64;
      });

      if (i + BATCH_SIZE < imageFacts.length) {
        await new Promise((r) => setTimeout(r, 6000)); // respect rate limit
      }
    }

    // --- Insert facts using internal mutation ---
    const factIds: string[] = [];
    for (const fact of facts) {
      const category = categories.find((c) => c.name === fact.category);
      if (!category) continue;

      const image = imageMap[`${fact.category}|${fact.title}`] ?? undefined;

      const id = await ctx.runMutation(
        internal.functions.insertAIFact.insertAIFact,
        {
          categoryId: category._id,
          title: fact.title,
          content: fact.content,
          image,
          is_ai_generated: true,
        }
      );

      factIds.push(id);
    }

    console.log(`[AI FACTS] Action finished at ${new Date().toISOString()}`);
    return {
      requested: facts.length,
      inserted: factIds.length,
      factIds,
      categoriesProcessed: categories.map((c) => c.name),
    };
  },
});
