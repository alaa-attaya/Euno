import { internalMutation } from "../_generated/server";

export const seedCategories = internalMutation({
  handler: async (ctx) => {
    const categories = [
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
        name: "Tech",
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
      {
        name: "Music",
        description: "Melodies and musical facts",
        iconSet: "MaterialIcons",
        iconName: "music-note",
        iconColor: "#8B5CF6",
      },
    ];

    const inserted: Record<string, string> = {};

    for (const cat of categories) {
      const existing = await ctx.db
        .query("categories")
        .filter((q) => q.eq(q.field("name"), cat.name))
        .first();

      if (!existing) {
        const id = await ctx.db.insert("categories", cat);
        inserted[cat.name] = id;
      }
    }

    return inserted;
  },
});
