// seed/facts.ts
import { Id } from "../_generated/dataModel";

export interface SeedFactsArgs {
  db: any;
  categoryIds: Record<string, Id<"categories">>;
}

export interface SeedFactsResult {
  inserted: Record<string, Id<"seeded_facts">>;
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
    Science: [
      {
        title: "Water boils at 100C",
        content: "At standard pressure, water boils at 100°C.",
      },
      {
        title: "Light travels at 299792 km/s",
        content:
          "The speed of light in vacuum is approximately 299,792 kilometers per second.",
      },
    ],
    History: [
      {
        title: "The first moon landing",
        content: "Neil Armstrong walked on the moon in 1969.",
      },
      {
        title: "The Declaration of Independence",
        content: "Signed in 1776, marking the birth of the USA.",
      },
    ],
    Animals: [
      {
        title: "Octopuses have three hearts",
        content: "Two pump blood to the gills, one to the rest of the body.",
      },
    ],
    Technology: [
      {
        title: "The first computer bug",
        content: "A literal moth caused the first computer bug in 1947.",
      },
    ],
  };

  // Delete all previously seeded facts
  const existingFacts = await db.query("seeded_facts").collect();
  for (const fact of existingFacts) {
    await db.delete("seeded_facts", fact._id);
  }

  // Insert fresh facts
  const inserted: Record<string, Id<"seeded_facts">> = {};
  for (const [categoryName, facts] of Object.entries(factsByCategory)) {
    const categoryId = categoryIds[categoryName];
    if (!categoryId) continue;

    for (const fact of facts) {
      const id = await db.insert("seeded_facts", {
        title: fact.title,
        content: fact.content,
        categoryId,
        image: fact.image,
      });
      inserted[fact.title] = id;
    }
  }

  return { inserted };
}
