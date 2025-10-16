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
import type * as crons from "../crons.js";
import type * as functions_generateAIFactsAction from "../functions/generateAIFactsAction.js";
import type * as functions_getAIFacts from "../functions/getAIFacts.js";
import type * as functions_getAllFacts from "../functions/getAllFacts.js";
import type * as functions_getCategories from "../functions/getCategories.js";
import type * as functions_getCategoriesInternal from "../functions/getCategoriesInternal.js";
import type * as functions_getCategoryById from "../functions/getCategoryById.js";
import type * as functions_getFactByTitleAndCategory from "../functions/getFactByTitleAndCategory.js";
import type * as functions_getFactsByCategory from "../functions/getFactsByCategory.js";
import type * as functions_insertAIFact from "../functions/insertAIFact.js";
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
  crons: typeof crons;
  "functions/generateAIFactsAction": typeof functions_generateAIFactsAction;
  "functions/getAIFacts": typeof functions_getAIFacts;
  "functions/getAllFacts": typeof functions_getAllFacts;
  "functions/getCategories": typeof functions_getCategories;
  "functions/getCategoriesInternal": typeof functions_getCategoriesInternal;
  "functions/getCategoryById": typeof functions_getCategoryById;
  "functions/getFactByTitleAndCategory": typeof functions_getFactByTitleAndCategory;
  "functions/getFactsByCategory": typeof functions_getFactsByCategory;
  "functions/insertAIFact": typeof functions_insertAIFact;
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
