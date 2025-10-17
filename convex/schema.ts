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
    storageId: v.optional(v.id("_storage")),
    // Store reference to embedding instead of embedding itself
    embeddingId: v.optional(v.id("embeddings_1536")),
    embeddingModel: v.optional(v.string()), // Track which model was used
  })
    .index("by_category", ["categoryId"])
    .index("by_category_and_ai", ["categoryId", "is_ai_generated"])
    .index("by_embedding", ["embeddingId"]) // Add this to look up facts by embedding
    .searchIndex("search_content", {
      searchField: "content",
      filterFields: ["categoryId"],
    }),

  // Separate table for embeddings
  embeddings_1536: defineTable({
    embedding: v.array(v.float64()),
    model: v.string(),
    factId: v.id("facts"),
    categoryId: v.id("categories"), // For filtering during vector search
  })
    .index("by_fact", ["factId"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["categoryId"],
    }),
});
