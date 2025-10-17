import { GoogleGenAI } from "@google/genai";
import { v } from "convex/values";
import { internalAction } from "../_generated/server";

export const embedGeminiText = internalAction({
  args: { text: v.string() },
  handler: async (_, { text }) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const result = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: text,
      config: { taskType: "SEMANTIC_SIMILARITY", outputDimensionality: 1536 },
    });

    const values = result.embeddings?.[0]?.values;
    if (!values || !Array.isArray(values))
      throw new Error("No embedding returned from Gemini");

    return values;
  },
});
