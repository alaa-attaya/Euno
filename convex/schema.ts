// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Categories table
  categories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
  }).index("by_name", ["name"]),

  // Static / seeded facts
  seeded_facts: defineTable({
    title: v.string(),
    content: v.string(),
    categoryId: v.id("categories"),
    image: v.optional(v.string()),
  }).index("by_category_title", ["categoryId", "title"]),

  // AI-generated facts
  ai_facts: defineTable({
    title: v.string(),
    content: v.string(),
    categoryId: v.id("categories"),
    image: v.optional(v.string()),
    generated_at: v.optional(v.number()),
  }).index("by_category_title", ["categoryId", "title"]),
});
