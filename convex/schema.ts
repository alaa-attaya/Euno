// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  categories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    iconSet: v.string(),
    iconName: v.string(),
    iconColor: v.string(),
  }).index("by_name", ["name"]),

  facts: defineTable({
    title: v.string(),
    content: v.string(),
    categoryId: v.id("categories"),
    is_ai_generated: v.boolean(),
    image: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")), // ✅ Changed to v.id("_storage")
  })
    .index("by_category", ["categoryId"])
    .index("by_category_and_ai", ["categoryId", "is_ai_generated"])
    .searchIndex("search_content", {
      searchField: "content",
      filterFields: ["categoryId"],
    }),
});
