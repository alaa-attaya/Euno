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

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size)
    result.push(arr.slice(i, i + size));
  return result;
}

// Browser-compatible base64 → Uint8Array
function base64ToUint8Array(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// Robust JSON parser for Gemini output
function parseJsonSafe(raw: string): AIFact[] {
  // Remove code fences
  let cleaned = raw
    .replace(/```(json)?/gi, "")
    .replace(/```/g, "")
    .trim();
  // Attempt normal parse
  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  // Fallback: match first JSON array block
  const match = cleaned.match(/\[.*\]/s);
  if (match) {
    try {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }
  console.warn("[AI FACTS] Failed to parse JSON:", cleaned.slice(0, 300));
  return [];
}

// Enforce AIFact schema
function sanitizeFacts(facts: any[]): AIFact[] {
  return facts.map((f) => ({
    category: typeof f.category === "string" ? f.category : "General",
    title: typeof f.title === "string" ? f.title : "Untitled Fact",
    content: typeof f.content === "string" ? f.content : "",
    imageNeeded: typeof f.imageNeeded === "boolean" ? f.imageNeeded : false,
  }));
}

export const generateAIFactsAction = internalAction({
  args: {},
  handler: async (ctx, args): Promise<GenerateAIFactsResult> => {
    console.log(`[AI FACTS] 🚀 Action started at ${new Date().toISOString()}`);

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    // 1️⃣ Fetch categories
    const categories = await ctx.runQuery(
      internal.functions.getCategoriesInternal.getCategoriesInternal,
      {}
    );
    if (!categories.length) throw new Error("No categories found");

    console.log(
      `[AI FACTS] Categories: ${categories.map((c) => c.name).join(", ")}`
    );

    // 2️⃣ Prepare strict JSON prompt
    const prompt = `
Generate 30 unique educational facts in total, from these categories: ${categories
      .map((c) => c.name)
      .join(", ")}.

Output format: a valid JSON array only. Each element is an object with keys:
- "category" (string)
- "title" (string)
- "content" (string)
- "imageNeeded" (boolean)

Do NOT include any explanations, text, or comments. Only output valid JSON.
Example:
[
  {
    "category": "Science",
    "title": "Water Boils at 100C",
    "content": "Water boils at 100 degrees Celsius under normal pressure.",
    "imageNeeded": false
  }
]
`;

    console.log("[AI FACTS] Sending prompt to Gemini...");
    const textResp = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { temperature: 0.8, maxOutputTokens: 5000 },
    });

    const rawText = textResp.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";
    console.log(
      "[AI FACTS] Raw text output (truncated):",
      rawText.slice(0, 300)
    );

    let facts = parseJsonSafe(rawText);
    facts = sanitizeFacts(facts);
    console.log(`[AI FACTS] Parsed ${facts.length} facts`);

    const imageFacts: AIFact[] = [];
    const nonImageFacts: AIFact[] = [];

    for (const fact of facts) {
      const category = categories.find((c) => c.name === fact.category);
      if (!category) continue;

      const existing = await ctx.runQuery(
        internal.functions.getFactByTitleAndCategory.getFactByTitleAndCategory,
        { title: fact.title, categoryId: category._id }
      );
      if (existing) continue;

      (fact.imageNeeded ? imageFacts : nonImageFacts).push(fact);
    }

    console.log(`[AI FACTS] ${nonImageFacts.length} non-image facts`);
    console.log(`[AI FACTS] ${imageFacts.length} image facts`);

    const factIds: string[] = [];

    // Insert non-image facts
    for (const fact of nonImageFacts) {
      const category = categories.find((c) => c.name === fact.category);
      if (!category) continue;

      const id = await ctx.runMutation(
        internal.functions.insertAIFact.insertAIFact,
        {
          categoryId: category._id,
          title: fact.title,
          content: fact.content,
          image: "",
          is_ai_generated: true,
        }
      );
      console.log(`[AI FACTS] ✅ Inserted text-only fact: ${fact.title}`);
      factIds.push(id);
    }

    // Generate and store images
    const IMAGE_RATE_LIMIT = 8;
    const IMAGE_DELAY = 6000;
    const imageChunks = chunkArray(imageFacts, IMAGE_RATE_LIMIT);

    for (let i = 0; i < imageChunks.length; i++) {
      const chunk = imageChunks[i];
      console.log(`[AI FACTS] ⚡ Chunk ${i + 1}/${imageChunks.length}`);

      for (const f of chunk) {
        console.log(`[AI FACTS] Generating image for "${f.title}"...`);
        try {
          const imageResp = await ai.models.generateContent({
            model: "gemini-2.0-flash-preview-image-generation",
            contents: `Generate a high-quality educational illustration for this fact: ${f.title}: ${f.content}`,
            config: {
              responseModalities: ["IMAGE", "TEXT"],
              imageConfig: {
                aspectRatio: "2:3",
              },
            },
          });

          const inlineDataPart =
            imageResp.candidates?.[0]?.content?.parts?.find(
              (p) => p.inlineData?.data
            );
          const b64 = inlineDataPart?.inlineData?.data ?? "";
          if (!b64) {
            console.warn(`[AI FACTS] ⚠️ No image returned for "${f.title}"`);
            continue;
          }

          const blob = new Blob([base64ToUint8Array(b64)], {
            type: "image/png",
          });
          const storageId = await ctx.storage.store(blob);
          const imageUrl = await ctx.storage.getUrl(storageId);

          console.log(`[AI FACTS] 📦 Stored in Convex (id=${storageId})`);
          console.log(`[AI FACTS] 🌐 Image URL: ${imageUrl}`);

          const category = categories.find((c) => c.name === f.category);
          if (!category) continue;

          const id = await ctx.runMutation(
            internal.functions.insertAIFact.insertAIFact,
            {
              categoryId: category._id,
              title: f.title,
              content: f.content,
              image: imageUrl ?? "",
              is_ai_generated: true,
            }
          );
          console.log(`[AI FACTS] ✅ Inserted fact with image: ${f.title}`);
          factIds.push(id);
        } catch (err) {
          console.error(`[AI FACTS] ❌ Error processing "${f.title}"`, err);
        }
        await new Promise((r) => setTimeout(r, IMAGE_DELAY));
      }

      if (i + 1 < imageChunks.length) {
        console.log(`[AI FACTS] Waiting 60s before next chunk...`);
        await new Promise((r) => setTimeout(r, 60_000));
      }
    }

    console.log(`[AI FACTS] 🎯 Done inserting ${factIds.length} facts total`);
    return {
      requested: facts.length,
      inserted: factIds.length,
      factIds,
      categoriesProcessed: categories.map((c) => c.name),
    };
  },
});
