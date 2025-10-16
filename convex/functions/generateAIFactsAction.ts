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

function base64ToUint8Array(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function parseJsonSafe(raw: string): AIFact[] {
  let cleaned = raw
    .replace(/```(json)?/gi, "")
    .replace(/```/g, "")
    .trim();
  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  const match = cleaned.match(/\[.*\]/s);
  if (match) {
    try {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }
  console.warn("[AI FACTS] ❌ Failed to parse JSON:", cleaned.slice(0, 300));
  return [];
}

function sanitizeFacts(facts: any[]): AIFact[] {
  return facts.map((f) => ({
    category: typeof f.category === "string" ? f.category.trim() : "General",
    title: typeof f.title === "string" ? f.title.trim() : "Untitled Fact",
    content: typeof f.content === "string" ? f.content.trim() : "",
    imageNeeded: typeof f.imageNeeded === "boolean" ? f.imageNeeded : false,
  }));
}

export const generateAIFactsAction = internalAction({
  args: {},
  handler: async (ctx, args): Promise<GenerateAIFactsResult> => {
    console.log(`[AI FACTS] 🚀 Started at ${new Date().toISOString()}`);

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

    // 2️⃣ Build prompt
    const prompt = `
      You are a JSON generator. Output only valid JSON — no explanations, no markdown, no comments, and no text before or after.

      TASK:
      Generate up to 40 short, unique, educational facts across the following categories:
      ${categories.map((c) => c.name).join(", ")}.

      Each fact must be an object with exactly these keys:
      - "category": string (must be one of the listed categories)
      - "title": string (short, catchy, ≤60 characters, avoid quotes or apostrophes)
      - "content": string (1-3 sentences, informative and factual, up to 350 characters)
      - "imageNeeded": boolean (true if a simple illustration would help visualize the fact)

      STRICT RULES:
      - Output ONLY a valid JSON array.
      - No markdown, code fences, or text outside the JSON.
      - Do not use single quotes inside strings.
      - If you cannot fit all 40 items, return fewer — but keep valid JSON.
      - Every array must start with "[" and end with "]".
      - Validate your JSON structure before sending.

      EXAMPLE OUTPUT FORMAT:
      [
        {
          "category": "Science",
          "title": "Water Boils at 100°C",
          "content": "Under normal atmospheric pressure, water transitions from liquid to gas at 100 degrees Celsius, demonstrating a key concept in thermodynamics.",
          "imageNeeded": false
        }
      ]
      `;

    console.log("[AI FACTS] Sending prompt to Gemini...");
    const textResp = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { temperature: 0.8, maxOutputTokens: 20000 },
    });

    const rawText = textResp.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";
    console.log("[AI FACTS] Raw output:", rawText.slice(0, 300));

    let facts = sanitizeFacts(parseJsonSafe(rawText));
    console.log(`[AI FACTS] Parsed ${facts.length} facts`);

    const imageFacts: AIFact[] = [];
    const nonImageFacts: AIFact[] = [];

    for (const fact of facts) {
      const normalizedTitle = fact.title.toLowerCase();
      const normalizedContent = fact.content.toLowerCase();
      const category = categories.find(
        (c) => c.name.toLowerCase() === fact.category.toLowerCase()
      );
      if (!category) continue;

      const existing = await ctx.runQuery(
        internal.functions.getFactByTitleOrContentAndCategory
          .getFactByTitleOrContentAndCategory,
        {
          title: normalizedTitle,
          content: normalizedContent,
          categoryId: category._id,
        }
      );

      if (existing) {
        console.log(`[AI FACTS] ⚠️ Skipped duplicate: ${fact.title}`);
        continue;
      }

      (fact.imageNeeded ? imageFacts : nonImageFacts).push(fact);
    }

    console.log(`[AI FACTS] Non-image: ${nonImageFacts.length}`);
    console.log(`[AI FACTS] Image-needed: ${imageFacts.length}`);

    const factIds: string[] = [];

    // 3️⃣ Insert text-only facts
    for (const fact of nonImageFacts) {
      const category = categories.find(
        (c) => c.name.toLowerCase() === fact.category.toLowerCase()
      );
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
      console.log(`[AI FACTS] ✅ Inserted: ${fact.title}`);
      factIds.push(id);
    }

    // 4️⃣ Generate and insert image facts
    const IMAGE_RATE_LIMIT = 8;
    const IMAGE_DELAY = 6000;
    const imageChunks = chunkArray(imageFacts, IMAGE_RATE_LIMIT);

    for (let i = 0; i < imageChunks.length; i++) {
      const chunk = imageChunks[i];
      console.log(`[AI FACTS] ⚡ Image chunk ${i + 1}/${imageChunks.length}`);

      for (const f of chunk) {
        console.log(`[AI FACTS] 🖼️ Generating for: "${f.title}"`);
        try {
          const imageResp = await ai.models.generateContent({
            model: "gemini-2.0-flash-preview-image-generation",
            contents: `
                      Generate a small, clear, educational illustration for this fact.
                      - Avoid any text, labels, or captions.
                      - Keep the illustration simple and visually balanced.
                      - Target square format, around 300x300 to 300x400px.
                      - Avoid busy backgrounds; no text or logos.
                      - Generate at medium quality.
                      - Keep the image under ~400KB.
                      Fact:
                      Title: ${f.title}
                      Content: ${f.content}
                      `,
            config: {
              responseModalities: ["IMAGE", "TEXT"],
            },
          });

          const inlineDataPart =
            imageResp.candidates?.[0]?.content?.parts?.find(
              (p) => p.inlineData?.data
            );
          const b64 = inlineDataPart?.inlineData?.data ?? "";
          if (!b64) {
            console.warn(`[AI FACTS] ⚠️ No image for "${f.title}"`);
            continue;
          }

          const blob = new Blob([base64ToUint8Array(b64)], {
            type: "image/png",
          });
          const storageId = await ctx.storage.store(blob);
          const imageUrl = await ctx.storage.getUrl(storageId);

          const category = categories.find(
            (c) => c.name.toLowerCase() === f.category.toLowerCase()
          );
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
          console.log(`[AI FACTS] ✅ Inserted with image: ${f.title}`);
          factIds.push(id);
        } catch (err) {
          console.error(`[AI FACTS] ❌ Error with "${f.title}"`, err);
        }
        await new Promise((r) => setTimeout(r, IMAGE_DELAY));
      }

      if (i + 1 < imageChunks.length) {
        console.log(`[AI FACTS] ⏳ Waiting 60s before next chunk...`);
        await new Promise((r) => setTimeout(r, 60_000));
      }
    }

    console.log(`[AI FACTS] 🎯 Done inserting ${factIds.length} total`);
    return {
      requested: facts.length,
      inserted: factIds.length,
      factIds,
      categoriesProcessed: categories.map((c) => c.name),
    };
  },
});
