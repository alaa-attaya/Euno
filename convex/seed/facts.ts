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
      storageId?: Id<"_storage">;
    }>
  > = {
    // Example:
    // General: [
    //   {
    //     title: "The Sun is Hot",
    //     content: "The sun's surface temperature is around 5,500C.",
    //   },
    // ],
  };

  const inserted: Record<string, Id<"facts">> = {};

  for (const [categoryName, facts] of Object.entries(factsByCategory)) {
    const categoryId = categoryIds[categoryName];
    if (!categoryId) continue;

    for (const fact of facts) {
      // 1️⃣ Check if the fact already exists in this category by title
      const existingFact = await db
        .query("facts")
        .filter(
          (f: any) =>
            f.categoryId === categoryId &&
            f.title.toLowerCase().trim() === fact.title.toLowerCase().trim()
        )
        .first();

      if (existingFact) {
        inserted[fact.title] = existingFact._id;
        continue;
      }

      // 2️⃣ Prepare fields safely
      const sanitizedImage = fact.image?.trim() || undefined;
      const sanitizedStorageId = fact.storageId ?? undefined;

      // 3️⃣ Insert new fact
      const id = await db.insert("facts", {
        title: fact.title.trim(),
        content: fact.content.trim(),
        categoryId,
        is_ai_generated: false,
        image: sanitizedImage,
        storageId: sanitizedStorageId,
      });

      inserted[fact.title] = id;
    }
  }

  return { inserted };
}
