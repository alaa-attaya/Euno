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
    Science: [
      {
        title: "Water Boils at 100C",
        content: "At standard pressure, water boils at 100C.",
      },
      {
        title: "Speed of Light",
        content: "Light travels at 299,792 km/s in vacuum.",
      },
      {
        title: "Atoms Are Mostly Empty Space",
        content: "The nucleus is tiny compared to the atom.",
      },
    ],
    History: [
      {
        title: "First Moon Landing",
        content: "Neil Armstrong walked on the moon in 1969.",
      },
      {
        title: "Declaration of Independence",
        content: "Signed in 1776, marking the birth of the USA.",
      },
    ],
    General: [
      {
        title: "Bananas Are Berries",
        content: "Botanically, bananas are classified as berries.",
      },
      {
        title: "Honey Never Spoils",
        content: "Archaeologists found edible honey in ancient tombs.",
      },
    ],
    Animals: [
      {
        title: "Octopuses Have Three Hearts",
        content: "Two pump to the gills, one to the body.",
      },
      {
        title: "Cows Have Four Stomachs",
        content: "They digest tough plants efficiently.",
      },
    ],
    Tech: [
      {
        title: "First Computer Bug",
        content: "A literal moth caused the first computer bug in 1947.",
      },
      {
        title: "World Wide Web",
        content: "Invented by Tim Berners-Lee in 1989.",
      },
    ],
    Space: [
      {
        title: "Earth Orbits the Sun",
        content: "Takes 365.25 days for a full orbit.",
      },
      {
        title: "Moon Has Moonquakes",
        content: "Seismic activity occurs occasionally.",
      },
    ],
    Geography: [
      {
        title: "Mount Everest",
        content: "Highest mountain above sea level at 8,848 m.",
      },
      { title: "Sahara Desert", content: "Largest hot desert in the world." },
    ],
    Sports: [
      { title: "Olympics", content: "First modern Olympics held in 1896." },
      {
        title: "Fastest 100m",
        content: "Usain Bolt holds the record at 9.58s.",
      },
    ],
    Art: [
      { title: "Mona Lisa", content: "Painted by Leonardo da Vinci." },
      { title: "Starry Night", content: "Painted by Vincent van Gogh." },
    ],
    Food: [
      {
        title: "Chocolate Origins",
        content: "Cacao beans used by Mayans and Aztecs.",
      },
      { title: "Pizza", content: "Originated in Naples, Italy." },
    ],
  };

  // Delete all previously seeded facts
  const existingFacts = await db.query("facts").collect();
  for (const fact of existingFacts) {
    await db.delete("facts", fact._id);
  }

  // Insert fresh facts
  const inserted: Record<string, Id<"facts">> = {};
  for (const [categoryName, facts] of Object.entries(factsByCategory)) {
    const categoryId = categoryIds[categoryName];
    if (!categoryId) continue;

    for (const fact of facts) {
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
