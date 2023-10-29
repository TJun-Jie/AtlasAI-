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
  console.log(dataSet);

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
        <h1 className="tw-text-4xl tw-font-bold">Recommendations:</h1>
        <ul className="tw-text-xl">
          <li>Take a 5 minute breather</li>
          <li>Have a 10 minute powernap</li>
          <li>Consider taking the time to meditate</li>
        </ul>
      </div>
    </div>
  );
}
