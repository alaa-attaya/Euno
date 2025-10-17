// convex/cron.ts
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Run every hour
crons.interval(
  "generate_ai_facts_hourly",
  { hours: 12 },
  internal.functions.generateAIFactsAction.generateAIFactsAction
);

export default crons;
