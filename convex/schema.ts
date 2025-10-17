// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Categories table
  categories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    iconSet: v.string(), // e.g., "MaterialIcons", "Entypo"
    iconName: v.string(), // e.g., "apps", "rocket"
    iconColor: v.string(),
  }).index("by_name", ["name"]),

  // Facts table
  facts: defineTable({
    title: v.string(),
    content: v.string(),
    categoryId: v.id("categories"),
    is_ai_generated: v.boolean(),
    image: v.optional(v.string()),
  })
    .index("by_category", ["categoryId"])
    .index("by_category_and_ai", ["categoryId", "is_ai_generated"])
    .searchIndex("search_content", {
      searchField: "content",
      filterFields: ["categoryId"],
    }),
});
