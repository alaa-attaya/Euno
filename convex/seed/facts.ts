// seed/facts.ts
import { Id } from "../_generated/dataModel";

export interface SeedFactsArgs {
  db: any;
  categoryIds: Record<string, Id<"categories">>;
}

export interface SeedFactsResult {
  inserted: Record<string, Id<"facts">>;
}

export async function seedFacts({
  db,
  categoryIds,
}: SeedFactsArgs): Promise<SeedFactsResult> {
  const factsByCategory: Record<
    string,
    Array<{
      title: string;
      content: string;
      image?: string;
    }>
  > = {
    General: [
      {
        title: "The Sun is Hot",
        content: "The sun's surface temperature is around 5,500°C.",
      },
      {
        title: "Water Freezes at 0°C",
        content: "Pure water freezes at 0°C under normal atmospheric pressure.",
      },
    ],
    Science: [
      {
        title: "Light Travels Fast",
        content: "Light travels at 299,792,458 meters per second in a vacuum.",
      },
    ],
    // Add more seeded facts per category as needed
  };

  const inserted: Record<string, Id<"facts">> = {};

  for (const [categoryName, facts] of Object.entries(factsByCategory)) {
    const categoryId = categoryIds[categoryName];
    if (!categoryId) continue;

    for (const fact of facts) {
      // Check if the fact already exists in this category by title
      const existingFact = await db
        .query("facts")
        .filter(
          (f: any) =>
            f.categoryId === categoryId &&
            f.title.toLowerCase() === fact.title.toLowerCase()
        )
        .first();

      if (existingFact) {
        // Use existing fact ID
        inserted[fact.title] = existingFact._id;
        continue;
      }

      // Insert new fact
      const id = await db.insert("facts", {
        title: fact.title,
        content: fact.content,
        categoryId,
        is_ai_generated: false,
        image: fact.image,
      });

      inserted[fact.title] = id;
    }
  }

  return { inserted };
}
