// seed/categories.ts
import { Id } from "../_generated/dataModel";

export interface SeedCategoryArgs {
  db: any;
}

export interface SeedCategoryResult {
  inserted: Record<string, Id<"categories">>;
}

export async function seedCategories({
  db,
}: SeedCategoryArgs): Promise<SeedCategoryResult> {
  const categories = [
    {
      name: "Science",
      description: "Fun science facts",
      image: "/assets/categories/science.png",
    },
    {
      name: "History",
      description: "Events from the past",
      image: "/assets/categories/history.png",
    },
    {
      name: "Animals",
      description: "Animal kingdom facts",
      image: "/assets/categories/animals.png",
    },
    {
      name: "Technology",
      description: "Innovation facts",
      image: "/assets/categories/technology.png",
    },
  ];

  // Delete all previously seeded categories
  const existingCategories = await db.query("categories").collect();
  for (const cat of existingCategories) {
    await db.delete("categories", cat._id);
  }

  // Insert fresh categories
  const inserted: Record<string, Id<"categories">> = {};
  for (const cat of categories) {
    const id = await db.insert("categories", cat);
    inserted[cat.name] = id;
  }

  return { inserted };
}
