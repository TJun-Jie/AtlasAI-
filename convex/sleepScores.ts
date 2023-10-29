import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

export const addSleepScores = internalMutation({
  args: {
    hour: v.number(),
    score: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("sleepScores", args);
  },
});

export const getSleepScores = query({
  args: { hour: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db.query("sleepScores").order("desc").take(1);
  },
});

export function calculateSleepData(sleepData: any): number {
  const avgHrBpm = sleepData.heart_rate_data.summary.avg_hr_bpm;
  const avgBreathsPerMin =
    sleepData.respiration_data.breaths_data.avg_breaths_per_min;
  const avgOxygenSat =
    sleepData.respiration_data.oxygen_saturation_data.avg_saturation_percentage;

  const totalSleepSec =
    sleepData.sleep_durations_data.asleep.duration_REM_sleep_state_seconds +
    sleepData.sleep_durations_data.asleep.duration_deep_sleep_state_seconds +
    sleepData.sleep_durations_data.asleep.duration_light_sleep_state_seconds;

  const totalAwakeSec =
    sleepData.sleep_durations_data.awake.duration_awake_state_seconds;

  // Normalize the metrics to a scale of 0 to 1
  const normalizedHr = (100 - avgHrBpm) / 100;
  const normalizedBreath = (20 - avgBreathsPerMin) / 20;
  const normalizedOxygen = avgOxygenSat / 100;
  const normalizedSleep = totalSleepSec / (totalSleepSec + totalAwakeSec);

  // Calculate sleep score based on the normalized metrics
  let sleepScore =
    0.25 * normalizedHr +
    0.25 * normalizedBreath +
    0.25 * normalizedOxygen +
    0.25 * normalizedSleep;

  // Convert to a scale of 0 to 100
  sleepScore = Math.round(sleepScore * 100);

  // Clip values to be within 0-100
  sleepScore = Math.max(0, Math.min(100, sleepScore));

  return sleepScore;
}
