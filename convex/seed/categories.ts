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
  // Categories with Expo icon set, name, and color
  const categories = [
    {
      name: "General",
      description: "Miscellaneous fun facts",
      iconSet: "MaterialIcons",
      iconName: "category",
      iconColor: "#F6757A",
    },
    {
      name: "Science",
      description: "Fun science facts",
      iconSet: "Entypo",
      iconName: "science",
      iconColor: "#F9BD72",
    },
    {
      name: "History",
      description: "Events from the past",
      iconSet: "MaterialIcons",
      iconName: "history-edu",
      iconColor: "#2563EB",
    },
    {
      name: "Animals",
      description: "Animal kingdom facts",
      iconSet: "FontAwesome5",
      iconName: "paw",
      iconColor: "#10B981",
    },
    {
      name: "Technology",
      description: "Innovation facts",
      iconSet: "MaterialIcons",
      iconName: "memory",
      iconColor: "#F9BD72",
    },
    {
      name: "Space",
      description: "Out-of-this-world facts",
      iconSet: "Entypo",
      iconName: "rocket",
      iconColor: "#2563EB",
    },
    {
      name: "Geography",
      description: "Facts about Earth",
      iconSet: "Entypo",
      iconName: "globe",
      iconColor: "#10B981",
    },
    {
      name: "Sports",
      description: "Records and achievements",
      iconSet: "MaterialIcons",
      iconName: "sports-soccer",
      iconColor: "#F6757A",
    },
    {
      name: "Art",
      description: "Creative masterpieces",
      iconSet: "Entypo",
      iconName: "palette",
      iconColor: "#F9BD72",
    },
    {
      name: "Food",
      description: "Delicious discoveries",
      iconSet: "MaterialIcons",
      iconName: "restaurant",
      iconColor: "#2563EB",
    },
  ];

  // Delete any existing categories
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
