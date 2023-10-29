import { httpAction, internalMutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { calculateSleepData } from "./sleepScores";

export function getCurrentHourInSanFrancisco(): number {
  // Get current UTC time in milliseconds
  const nowUTC = new Date().getTime();

  // Calculate the offset for San Francisco (PDT/PST is UTC-7/UTC-8)
  // Note: This won't adjust for Daylight Saving Time
  const offsetInMilliseconds = 7 * 60 * 60 * 1000;

  // Convert to San Francisco time
  const nowInSanFrancisco = new Date(nowUTC - offsetInMilliseconds);

  return nowInSanFrancisco.getUTCHours();
}

function calculateStress(heartData: any) {
  const avgHrvSdnn = heartData.heart_rate_data.summary.avg_hrv_sdnn;
  const avgHrBpm = heartData.heart_rate_data.summary.avg_hr_bpm;
  const maxHrBpm = heartData.heart_rate_data.summary.max_hr_bpm;
  const minHrBpm = heartData.heart_rate_data.summary.min_hr_bpm;

  const hrvMax = 100;
  const hrvMin = 20;

  const highHrMax = maxHrBpm * 1.15;
  const lowHrMin = minHrBpm * 0.85;

  // Normalize HRV value to a scale from 0 to 1
  const normalizedHrv = (avgHrvSdnn - hrvMin) / (hrvMax - hrvMin);

  // Normalize average HR value to a scale from 0 to 1
  const normalizedAvgHr = (avgHrBpm - lowHrMin) / (highHrMax - lowHrMin);

  let stressLevel = 50 * (1 - normalizedHrv) + 50 * normalizedAvgHr;

  // Clip values to be within 1-100
  stressLevel = Math.max(1, Math.min(100, stressLevel));

  return Math.round(stressLevel);
}

export const getTerraAPI = httpAction(async (ctx, request) => {
  // Parse the body as JSON
  const data = await request.json();

  if (!data) {
    throw new Error("Request body is empty");
  }

  // Access the 'type' field from the parsed JSON data
  const type = data.type;
  if (type === "body") {
    const heartData = data.data[0].heart_data;
    const stress = calculateStress(heartData);

    const currentHour = getCurrentHourInSanFrancisco();

    await ctx.runMutation(internal.stressScores.addStressScores, {
      hour: currentHour,
      score: stress,
    });
  } else if (type === "sleep") {
    const sleepData = data.data[0];
    const sleep = calculateSleepData(sleepData);

    const currentHour = getCurrentHourInSanFrancisco();

    await ctx.runMutation(internal.sleepScores.addSleepScores, {
      hour: currentHour,
      score: sleep,
    });
  } else {
    console.log("Type is not available in the request body.");
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

export const addStressScores = internalMutation({
  args: {
    hour: v.number(),
    score: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("stressScores", args);
  },
});

export const getStressScores = query({
  args: { hour: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db.query("stressScores").order("desc").take(1);
  },
});
