import { paginationOptsValidator } from "convex/server";
import { query } from "../_generated/server";

export const getAllFacts = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async ({ db }, { paginationOpts }) => {
    const factsPage = await db
      .query("facts")
      .order("desc") // sorts by _creationTime automatically
      .paginate(paginationOpts);

    return {
      page: factsPage.page,
      continueCursor: factsPage.continueCursor,
      isDone: factsPage.isDone,
    };
  },
});
