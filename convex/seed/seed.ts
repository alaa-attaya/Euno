// seed/seedAll.ts
import { mutation } from "../_generated/server";
import { seedCategories } from "./categories";
import { seedFacts } from "./facts";

/**
 * Seeds categories and facts by deleting old seeded rows
 * and inserting fresh ones.
 * npx convex run seed/seed:seedAll
 */
export const seedAll = mutation({
  handler: async ({ db }) => {
    // Seed categories
    const categoryResult = await seedCategories({ db });

    // Seed facts
    const factsResult = await seedFacts({
      db,
      categoryIds: categoryResult.inserted,
    });

    return {
      categories: categoryResult,
      facts: factsResult,
    };
  },
});
