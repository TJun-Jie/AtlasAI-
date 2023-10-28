import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
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
});
