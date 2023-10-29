"use client";

// React ChartJS 2 Charting Library.
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useQuery } from "convex/react";
import { Bar } from "react-chartjs-2";
import { getCurrentHourInSanFrancisco } from "../../../convex/stressScores";
import { api } from "../../../convex/_generated/api";
import utc from "dayjs/plugin/utc"; // UTC plugin
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";
import RecommendedCard from "../components/RecommendedCard";
import SpotifyDrawer from "../components/SpotifyDrawer";
import { Typography } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

dayjs.extend(utc);
dayjs.extend(timezone);
export default function Stats() {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },

      title: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  const stressData = useQuery(api.stressScores.getStressScores, {
    hour: getCurrentHourInSanFrancisco(),
  });
  const stressScore = stressData ? stressData[0]?.score : 0;
  const stressLastUpdated = stressData ? stressData[0]?._creationTime : 0;

  const sleepData = useQuery(api.sleepScores.getSleepScores, {
    hour: getCurrentHourInSanFrancisco(),
  });
  const sleepScore = sleepData ? sleepData[0]?.score : 0;
  const sleepLastUpdated = sleepData ? sleepData[0]?._creationTime : 0;

  const pastMetrics = useQuery(api.predictedMetrics.getPredictedMetrics);

  const pastSleepScores = pastMetrics
    ? pastMetrics[0]?.predictedSleepScores
    : [];
  const pastStressScores = pastMetrics
    ? pastMetrics[0]?.predictedStressScores
    : [];

  const dateTimeUTCStress = dayjs(stressLastUpdated);

  const dateTimeSFStress = dateTimeUTCStress.tz("America/Los_Angeles");

  const formattedStressDateTime = dateTimeSFStress.format("YYYY-MM-DD h:mm A");

  const dateTimeUTCSleep = dayjs(sleepLastUpdated);

  const dateTimeSFSleep = dateTimeUTCSleep.tz("America/Los_Angeles");

  const formattedSleep = dateTimeSFSleep.format("YYYY-MM-DD h:mm A");

  //   Convert to San Francisco time
  //   const dateTimeSF = dateTimeUTC.tz("America/Los_Angeles");

  const labels = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
  ];

  const dataSet = pastStressScores.map((value) => value.score);

  const data = {
    labels,
    datasets: [
      {
        data: dataSet,
        backgroundColor: dataSet.map((value) =>
          value > 50 ? "rgba(255, 99, 132, 0.5)" : "rgba(53, 162, 235, 0.5)"
        ),
      },
    ],
  };

  // Recommended Tasks.
  interface Recommendation {
    title: string;
    recommendation: string;
  }

  interface StressRecommendation {
    title: string;
    recommendation: string;
  }

  const stressRecommendations: StressRecommendation[] = [
    {
      title: "High Stress During Work Hours",
      recommendation:
        "We've noticed a pattern of elevated stress levels during your typical working hours. Consider taking short breaks to step away from your workstation, practice deep-breathing exercises, or take a walk to reset your mind.",
    },

    {
      title: "Post-Exercise Stress Increase",
      recommendation:
        "An increase in stress levels is observed post-workout. While exercise generally lowers stress, intense workouts can temporarily have the opposite effect. Consider a mix of cardio and relaxation-based exercises like yoga.",
    },
    {
      title: "Morning Stress",
      recommendation:
        "High stress levels are observed in the mornings. A structured morning routine including light exercise, a balanced breakfast, and planning for the day can set a positive tone.",
    },
  ];

  const sleepRecommendations: Recommendation[] = [
    {
      title: "Weekday vs Weekend Variance",
      recommendation:
        "Our analysis shows that your sleep quality varies between weekdays and weekends, which can be disruptive to your natural circadian rhythm. To maintain a balanced work-life cycle, aim to standardize your sleep hours across the week. Consider stress-relief activities during weekdays and avoid oversleeping on weekends.",
    },
    {
      title: "Inconsistent Sleep Scores",
      recommendation:
        "We've noticed fluctuations in your sleep scores throughout the month. This inconsistency can lead to long-term sleep debt. Establish a stable bedtime and wake-up routine, including on weekends, to improve overall sleep quality.",
    },

    {
      title: "Mid-Sleep Wakefulness",
      recommendation:
        "Your sleep score shows a dip in quality midway through your sleep cycle. This could be indicative of disrupted REM sleep. Avoid alcohol or heavy meals before bed, and consider using blackout curtains to create a sleep-conducive environment.",
    },
  ];

  return (
    <div>
      <div className=" tw-mx-auto tw-h-[50vh] tw-w-[80%]">
        <h1 className="tw-text-4xl tw-font-bold tw-text-center">
          Daily Stress Score
        </h1>
        <Bar options={options} data={data} />
      </div>

      <div className="tw-grid tw-grid-cols-2 tw-justify-items-center tw-items-center tw-mt-10">
        <div>
          <h3 className="tw-text-2xl tw-font-semibold">Latest Sleep Score:</h3>
          <h4 className="tw-text-xl tw-text-center">{sleepScore} </h4>
          <h5 className="tw-text-sm tw-text-center">{formattedSleep}</h5>
        </div>
        <div>
          <h3 className="tw-text-2xl tw-font-semibold">Latest Stress Score:</h3>
          <h4 className="tw-text-xl tw-text-center">{stressScore} </h4>
          <h5 className="tw-text-sm tw-text-center">
            {formattedStressDateTime}
          </h5>
        </div>
      </div>

      <div className="tw-mt-10">
        <div className="tw-w-full tw-flex tw-justify-center">
          <div>
            <Typography variant="h5" className="tw-text-center">
              Sleep Insights
            </Typography>

            <div className="tw-flex tw-flex-col tw-justify-items-center tw-items-center tw-mt-10">
              {sleepRecommendations.map((recommended, index) => {
                return (
                  <RecommendedCard
                    key={index}
                    title={recommended.title}
                    description={recommended.recommendation}
                  />
                );
              })}
            </div>
          </div>

          <div>
            <Typography variant="h5" className="tw-text-center">
              Stress Insights
            </Typography>
            <div className="tw-flex tw-flex-col tw-justify-items-center tw-items-center tw-mt-10">
              {stressRecommendations.map((recommended, index) => {
                return (
                  <RecommendedCard
                    key={index}
                    title={recommended.title}
                    description={recommended.recommendation}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <SpotifyDrawer stress={stressScore} />
    </div>
  );
}
