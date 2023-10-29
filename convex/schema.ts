import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  recommendedTasks: defineTable({
    // Datetime Strings
    startTime: v.string(),
    deadline: v.string(),
    isFixed: v.boolean(),
    title: v.string(),
    duration: v.number(),

    priority: v.number(),
    reason: v.string(),
  }),

  tasks: defineTable({
    // Datetime Strings
    startTime: v.string(),
    deadline: v.string(),
    isFixed: v.boolean(),
    title: v.string(),
    duration: v.number(),

    // 1 (low) to 3 (high)
    priority: v.number(),
  }),

  stressScores: defineTable({
    hour: v.number(),
    score: v.number(),
  }),
  sleepScores: defineTable({
    hour: v.number(),
    score: v.number(),
  }),

  predictedMetrics: defineTable({
    predictedStressScores: v.array(
      v.object({
        hour: v.number(),
        score: v.number(),
      })
    ),
    predictedSleepScores: v.array(
      v.object({
        hour: v.number(),
        score: v.number(),
      })
    ),
  }),
});
