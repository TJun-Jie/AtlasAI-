import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

export const getPredictedMetrics = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("predictedMetrics").collect();
  },
});
