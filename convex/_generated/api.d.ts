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
import type * as functions_embedGemini from "../functions/embedGemini.js";
import type * as functions_generateAIFactsAction from "../functions/generateAIFactsAction.js";
import type * as functions_getAllFacts from "../functions/getAllFacts.js";
import type * as functions_getCategories from "../functions/getCategories.js";
import type * as functions_getCategoriesInternal from "../functions/getCategoriesInternal.js";
import type * as functions_getCategoryById from "../functions/getCategoryById.js";
import type * as functions_getFactByTitleOrContentAndCategory from "../functions/getFactByTitleOrContentAndCategory.js";
import type * as functions_getFactsByCategory from "../functions/getFactsByCategory.js";
import type * as functions_insertAIFact from "../functions/insertAIFact.js";
import type * as seed_categories from "../seed/categories.js";
import type * as seed_facts from "../seed/facts.js";
import type * as seed_fillMissingEmbeddings from "../seed/fillMissingEmbeddings.js";
import type * as seed_getMissingEmbeddingsFacts from "../seed/getMissingEmbeddingsFacts.js";
import type * as seed_seedFacts from "../seed/seedFacts.js";

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
  "functions/embedGemini": typeof functions_embedGemini;
  "functions/generateAIFactsAction": typeof functions_generateAIFactsAction;
  "functions/getAllFacts": typeof functions_getAllFacts;
  "functions/getCategories": typeof functions_getCategories;
  "functions/getCategoriesInternal": typeof functions_getCategoriesInternal;
  "functions/getCategoryById": typeof functions_getCategoryById;
  "functions/getFactByTitleOrContentAndCategory": typeof functions_getFactByTitleOrContentAndCategory;
  "functions/getFactsByCategory": typeof functions_getFactsByCategory;
  "functions/insertAIFact": typeof functions_insertAIFact;
  "seed/categories": typeof seed_categories;
  "seed/facts": typeof seed_facts;
  "seed/fillMissingEmbeddings": typeof seed_fillMissingEmbeddings;
  "seed/getMissingEmbeddingsFacts": typeof seed_getMissingEmbeddingsFacts;
  "seed/seedFacts": typeof seed_seedFacts;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
