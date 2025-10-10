import { query } from "../_generated/server";

export const getCategories = query(async ({ db }) => {
  const categories = await db
    .query("categories")
    .withIndex("by_name")
    .collect();

  return categories;
});
