// convex/functions/getFactByTitleOrContentAndCategory.ts
import { v } from "convex/values";
import { internalQuery } from "../_generated/server";

// Simple similarity function (0–1) using Levenshtein distance
function similarity(s1: string, s2: string): number {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  const longerLength = longer.length;
  if (longerLength === 0) return 1.0;
  return (longerLength - editDistance(longer, shorter)) / longerLength;
}

function editDistance(s1: string, s2: string): number {
  const costs = Array(s2.length + 1).fill(0);
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) costs[j] = j;
      else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1[i - 1] !== s2[j - 1]) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

export const getFactByTitleOrContentAndCategory = internalQuery({
  args: {
    title: v.string(),
    content: v.string(),
    categoryId: v.id("categories"),
  },
  handler: async (ctx, { title, content, categoryId }) => {
    // Combine title + content as keywords for full-text search
    const keywords = `${title} ${content}`.trim();

    // Fetch candidates from full-text search
    const candidates = await ctx.db
      .query("facts")
      .withSearchIndex("search_content", (q) =>
        q.search("content", keywords).eq("categoryId", categoryId)
      )
      .take(50); // fetch more for safety

    if (!candidates.length) return null;

    // Rank candidates by weighted similarity
    let bestMatch: (typeof candidates)[0] | null = null;
    let bestScore = 0;

    for (const fact of candidates) {
      const contentSim = similarity(content, fact.content);
      const titleSim = similarity(title, fact.title);

      // weighted score: title more important
      const score = titleSim * 0.6 + contentSim * 0.4;

      if (score > bestScore) {
        bestScore = score;
        bestMatch = fact;
      }
    }

    // Return only if similarity is high enough
    return bestScore >= 0.8 ? bestMatch : null;
  },
});
