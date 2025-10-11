import { v } from "convex/values";
import { query } from "../_generated/server";

/**
 * Fetch a single category by ID
 */
export const getCategoryById = query({
  args: { id: v.id("categories") },
  handler: async ({ db }, { id }) => {
    const category = await db.get(id);
    if (!category) throw new Error("Category not found");
    return category;
  },
});
