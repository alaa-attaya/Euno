/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as functions_generateAIFact from "../functions/generateAIFact.js";
import type * as functions_getAIFacts from "../functions/getAIFacts.js";
import type * as functions_getAllFacts from "../functions/getAllFacts.js";
import type * as functions_getCategories from "../functions/getCategories.js";
import type * as functions_getFactsByCategory from "../functions/getFactsByCategory.js";
import type * as seed_categories from "../seed/categories.js";
import type * as seed_facts from "../seed/facts.js";
import type * as seed_seed from "../seed/seed.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "functions/generateAIFact": typeof functions_generateAIFact;
  "functions/getAIFacts": typeof functions_getAIFacts;
  "functions/getAllFacts": typeof functions_getAllFacts;
  "functions/getCategories": typeof functions_getCategories;
  "functions/getFactsByCategory": typeof functions_getFactsByCategory;
  "seed/categories": typeof seed_categories;
  "seed/facts": typeof seed_facts;
  "seed/seed": typeof seed_seed;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
