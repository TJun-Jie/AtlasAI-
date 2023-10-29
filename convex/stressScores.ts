import { httpAction, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

interface HeartSummaryData {
  avg_hrv_sdnn: number;
  avg_hr_bpm: number;
  max_hr_bpm: number;
  min_hr_bpm: number;
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

    // const nowInSanFrancisco = DateTime.now().setZone("America/Los_Angeles");
    // const hourInSanFrancisco: number = nowInSanFrancisco.hour;

    await ctx.runMutation(internal.stressScores.addStressScores, {
      hour: 1,
      score: stress,
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
