"use client";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Box, Modal, TextField, Typography, Button } from "@mui/material";
import { Delete, DoneAll, AddReaction } from '@mui/icons-material';
import { useState } from "react";
import dayjs from "dayjs";
import { Doc } from "../../convex/_generated/dataModel";
import TaskItem from "./components/TaskItem";
import utc from "dayjs/plugin/utc"; // UTC plugin
import timezone from "dayjs/plugin/timezone";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { getCurrentHourInSanFrancisco } from "../../convex/stressScores";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

dayjs.extend(utc);
dayjs.extend(timezone);
export default function Home() {
  const tasks = useQuery(api.tasks.get);
  const [input, setInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stressData = useQuery(api.stressScores.getStressScores, {
    hour: getCurrentHourInSanFrancisco(),
  });
  const score = stressData ? stressData[0].score : 0;
  const lastUpdated = stressData ? stressData[0]._creationTime : 0;
  const dateTimeUTC = dayjs(lastUpdated);

  // Convert to San Francisco time
  const dateTimeSF = dateTimeUTC.tz("America/Los_Angeles");

  // Format the date and time
  // const formattedDateTime = dateTimeSF.format("YYYY-MM-DD HH:mm");
  //   <div className="tw-flex tw-flex-col tw-align-center tw-m-5 gap-5">
  //   <div className="tw-flex tw-flex-col tw-justify-start tw-items-center tw-mb-8 tw-mt-5 ">
  //     <div>Current Stress Score</div>
  //     <div>{score} </div>
  //   </div>
  //   <div className="">
  //     <div>Last Updated</div>
  //     <div>{formattedDateTime}</div>
  //   </div>
  // </div>

  if (!tasks) {
    return <div>Loading...</div>;
  }

  const istaskStart = (task: Doc<"tasks">, day: string, hour: number) => {
    const taskStartDay = dayjs(task.startTime).format("ddd");
    const taskStartHour = dayjs(task.startTime).hour();
    return taskStartDay === day && taskStartHour === hour;
  };

  const getTaskForTimeSlot = (day: string, hour: number) => {
    const matchedTask = tasks.find((task) => {
      const taskStartDay = dayjs(task.startTime).format("ddd");
      const taskStartHour = dayjs(task.startTime).hour();
      const taskEndHour = Number(taskStartHour) + Number(task.duration); // Explicit conversion

      return (
        taskStartDay === day &&
        Number(taskStartHour) <= hour && // Explicit conversion
        Number(taskEndHour) > hour // Explicit conversion
      );
    });

    return matchedTask;
  };
  return (
    <ThemeProvider theme={darkTheme}>
      <div className="tw-flex tw-flex-row tw-justify-center tw-gap-5">
      <Modal
          open={isModalOpen}
          onClose={() => {}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "50px",
              width: 700,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <div className="tw-flex tw-items-center tw-justify-center tw-text-white">
              <h4 className="tw-text-3xl">Recommendations:</h4>
            </div>
            <div className="tw-flex">
              {/* Old Time Column */}
              <OverlayScrollbarsComponent
                style={{ height: "400px", width: "200px" }}
              >
                <div className="tw-grid tw-grid-cols-25 tw-w-fit tw-ml-auto tw-mr-auto">
                {/* Hour Labels */}
                <div className="tw-sticky tw-top-0 tw-z-[100] tw-bg-gray-900  ">
                  <div className="tw-flex tw-flex-row tw-w-max tw-justify-between tw-align-center ">
                    <div className="tw-h-12 tw-flex tw-items-center tw-justify-start tw-w-[70px] tw-text-white"></div>
                    <div className="tw-flex tw-row tw-item-center tw-w-full tw-justify-start ">
                      <div
                        className="tw-w-[100px] tw-flex tw-justify-center tw-text-center"
                      >
                        <div className="tw-w-full tw-h-12 tw-text-white ">
                          Old
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                    className="tw-flex tw-flex-row tw-w-max tw-justify-between tw-align-center "
                  >
                    <div className="tw-h-3 tw-flex tw-items-center tw-justify-start tw-w-[70px]"></div>
                    <div className="tw-flex tw-row tw-item-center tw-w-full tw-justify-start ">
                      <div
                        className="tw-w-[100px] tw-flex tw-justify-center tw-text-center "
                      >
                        <div className="tw-w-full tw-h-3 tw-border-l-2 tw-border-r-2"></div>
                      </div>
                      </div>
                  </div>
                </div>

              <div className="tw-flex tw-flex-col tw-justify-between tw-w-max">
                {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                  <div key={hour} className="tw-flex tw-row tw-items-center">
                    <div className="tw-h-12 tw-flex tw-items-center tw-justify-start tw-w-[70px] tw-text-white">
                      {hour}:00
                    </div>
                    <div className="tw-flex tw-row tw-item-center tw-w-full tw-justify-start">
                      {["Mon"].map((day) => {
                        const currentTask = getTaskForTimeSlot(day, hour);
                        const shouldDisplayTitle =
                          currentTask && istaskStart(currentTask, day, hour);

                        if (currentTask) {
                          return (
                            <div
                              className="tw-w-[100px] tw-flex tw-justify-center tw-text-center"
                              key={day}
                            >
                              {/* Content for each hour can be added here */}
                              <div className="tw-w-full tw-h-12  tw-border-l-2 tw-border-r-2 tw-border-gray-200 tw-bg-[#3f50b5] tw-text-white">
                                {shouldDisplayTitle && (
                                  <TaskItem task={currentTask} />
                                )}
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div
                            className="tw-w-[100px] tw-flex tw-justify-center tw-text-center"
                            key={day}
                          >
                            {/* Content for each hour can be added here */}
                            <div className="tw-w-full tw-h-12 tw-border-b-2 tw-border-l-2 tw-border-r-2 tw-text-white  "></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
              </OverlayScrollbarsComponent>

              {/* New Time Column */}
              <OverlayScrollbarsComponent
                style={{ height: "400px", width: "200px" }}
              >
                <div className="tw-grid tw-grid-cols-25 tw-w-fit tw-ml-auto tw-mr-auto">
                {/* Hour Labels */}
                <div className="tw-sticky tw-top-0 tw-z-[100] tw-bg-gray-900  ">
                  <div className="tw-flex tw-flex-row tw-w-max tw-justify-between tw-align-center ">
                    <div className="tw-h-12 tw-flex tw-items-center tw-justify-start tw-w-[70px] tw-text-white"></div>
                    <div className="tw-flex tw-row tw-item-center tw-w-full tw-justify-start ">
                      <div
                        className="tw-w-[100px] tw-flex tw-justify-center tw-text-center"
                      >
                        <div className="tw-w-full tw-h-12 tw-text-white ">
                          New
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                    className="tw-flex tw-flex-row tw-w-max tw-justify-between tw-align-center "
                  >
                    <div className="tw-h-3 tw-flex tw-items-center tw-justify-start tw-w-[70px]"></div>
                    <div className="tw-flex tw-row tw-item-center tw-w-full tw-justify-start ">
                      <div
                        className="tw-w-[100px] tw-flex tw-justify-center tw-text-center "
                      >
                        <div className="tw-w-full tw-h-3 tw-border-l-2 tw-border-r-2"></div>
                      </div>
                      </div>
                  </div>
                </div>

              <div className="tw-flex tw-flex-col tw-justify-between tw-w-max">
                {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                  <div key={hour} className="tw-flex tw-row tw-items-center">
                    <div className="tw-h-12 tw-flex tw-items-center tw-justify-start tw-w-[70px] tw-text-white">
                      {hour}:00
                    </div>
                    <div className="tw-flex tw-row tw-item-center tw-w-full tw-justify-start">
                      {["Mon"].map((day) => {
                        const currentTask = getTaskForTimeSlot(day, hour);
                        const shouldDisplayTitle =
                          currentTask && istaskStart(currentTask, day, hour);

                        if (currentTask) {
                          return (
                            <div
                              className="tw-w-[100px] tw-flex tw-justify-center tw-text-center"
                              key={day}
                            >
                              {/* Content for each hour can be added here */}
                              <div className="tw-w-full tw-h-12  tw-border-l-2 tw-border-r-2 tw-border-gray-200 tw-bg-[#3f50b5] tw-text-white">
                                {shouldDisplayTitle && (
                                  <TaskItem task={currentTask} />
                                )}
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div
                            className="tw-w-[100px] tw-flex tw-justify-center tw-text-center"
                            key={day}
                          >
                            {/* Content for each hour can be added here */}
                            <div className="tw-w-full tw-h-12 tw-border-b-2 tw-border-l-2 tw-border-r-2 tw-text-white  "></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
              </OverlayScrollbarsComponent>

            {/* Reasons Column */}
            <OverlayScrollbarsComponent
                style={{ height: "400px", width: "200px" }}
              >
                <div className="tw-grid tw-grid-cols-25 tw-w-fit tw-ml-auto tw-mr-auto">
                {/* Hour Labels */}
                <div className="tw-sticky tw-top-0 tw-z-[100] tw-bg-gray-900  ">
                  <div className="tw-flex tw-flex-row tw-w-max tw-justify-between tw-align-center ">
                    <div className="tw-flex tw-row tw-item-center tw-w-full tw-justify-start ">
                      <div
                        className="tw-w-[100px] tw-flex tw-justify-center tw-text-center"
                      >
                        <div className="tw-w-full tw-h-12 tw-text-white ">
                          Reasons
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                    className="tw-flex tw-flex-row tw-w-max tw-justify-between tw-align-center "
                  >
                    <div className="tw-flex tw-row tw-item-center tw-w-full tw-justify-start ">
                      <div
                        className="tw-w-[100px] tw-flex tw-justify-center tw-text-center "
                      >
                        <div className="tw-w-full tw-h-3 tw-border-l-2 tw-border-r-2"></div>
                      </div>
                      </div>
                  </div>
                </div>

              <div className="tw-flex tw-flex-col tw-justify-between tw-w-max">
                {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                  <div key={hour} className="tw-flex tw-row tw-items-center">
                    <div className="tw-flex tw-row tw-item-center tw-w-full tw-justify-start">
                      {["Mon"].map((day) => {
                        const currentTask = getTaskForTimeSlot(day, hour);
                        const shouldDisplayTitle =
                          currentTask && istaskStart(currentTask, day, hour);

                        if (currentTask) {
                          return (
                            <div
                              className="tw-w-[100px] tw-flex tw-justify-center tw-text-center"
                              key={day}
                            >
                              {/* Content for each hour can be added here */}
                              <div className="tw-w-full tw-h-12  tw-border-l-2 tw-border-r-2 tw-border-gray-200 tw-bg-[#3f50b5] tw-text-white">
                                {shouldDisplayTitle && (
                                  <TaskItem task={currentTask} />
                                )}
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div
                            className="tw-w-[100px] tw-flex tw-justify-center tw-text-center"
                            key={day}
                          >
                            {/* Content for each hour can be added here */}
                            <div className="tw-w-full tw-h-12 tw-border-b-2 tw-border-l-2 tw-border-r-2 tw-text-white  "></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
              </OverlayScrollbarsComponent>
            </div>

            {/* Action Buttons */}
            <div className="tw-flex tw-w-full tw-justify-around tw-mt-10">
              <Button 
                variant="contained" size="large" color="success" startIcon={<DoneAll />}
                onClick={() => setIsModalOpen(false)}
              >
                Accept
              </Button>
              <Button 
                variant="contained" size="large" color="error" startIcon={<Delete />}
                onClick={() => setIsModalOpen(false)}
              >
                Reject
              </Button>
            </div>
          </Box>
        </Modal>

        <div className="tw-mt-10 tw-w-[250px]  ">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              width: "100%",
            }}
          >
            <Typography variant="h6">Tell Us A New Task:</Typography>

            <div className="tw-flex tw-items-center">
              <TextField
                multiline
                variant="outlined"
                placeholder={"What are you doing today?"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                fullWidth
                sx={{ color: "#fff" }}
              />
            </div>

            <Button 
              variant="contained" size="large" startIcon={<AddReaction />}
              onClick={() => setIsModalOpen(true)}
            >
              Offer Suggestion
            </Button>
          </Box>
        </div>
        
        <div className="">
          <div>
            <h1 className="tw-w-fit tw-text-xl tw-font-bold tw-text-start  tw-mb-4 tw-ml-auto tw-mr-auto tw-mt-3">
              Your Personalized AI Planner
            </h1>
          </div>
          <div className="tw-flex tw-flex-col  tw-px-6 tw-rounded-lg tw-shadow-md tw-overflow-x-auto tw-text-black tw-h-screen">
            <div className="tw-grid tw-grid-cols-25 tw-w-fit tw-ml-auto tw-mr-auto">
              {/* Hour Labels */}
              <div className="tw-sticky tw-top-0 tw-z-[100] tw-bg-gray-900  ">
                <div className="tw-flex tw-flex-row tw-w-max tw-justify-between tw-align-center ">
                  <div className="tw-h-12 tw-flex tw-items-center tw-justify-start tw-w-[50px] tw-text-white"></div>
                  <div className="tw-flex tw-row tw-item-center tw-w-full tw-justify-start ">
                    {daysOfWeek.map((day) => (
                      <div
                        key={day}
                        className="tw-w-[100px] tw-flex tw-justify-center tw-text-center"
                      >
                        <div className="tw-w-full tw-h-12 tw-text-white ">
                          {day}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  style={{
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                  className="tw-flex tw-flex-row tw-w-max tw-justify-between tw-align-center "
                >
                  <div className="tw-h-3 tw-flex tw-items-center tw-justify-start tw-w-[50px]"></div>
                  <div className="tw-flex tw-row tw-item-center tw-w-full tw-justify-start ">
                    {daysOfWeek.map((day) => {
                      if (day === "Sun") {
                        return (
                          <div
                            key={day}
                            className="tw-w-[100px] tw-flex tw-justify-center tw-text-center "
                          >
                            <div className="tw-w-full tw-h-3  tw-border-l-2"></div>
                          </div>
                        );
                      }
                      return (
                        <div
                          key={day}
                          className="tw-w-[100px] tw-flex tw-justify-center tw-text-center "
                        >
                          <div className="tw-w-full tw-h-3  tw-border-l-2"></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="tw-flex tw-flex-col tw-justify-between tw-w-max">
                {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                  <div key={hour} className="tw-flex tw-row tw-items-center">
                    <div className="tw-h-12 tw-flex tw-items-center tw-justify-start tw-w-[50px] tw-text-white">
                      {hour}:00
                    </div>
                    <div className="tw-flex tw-row tw-item-center tw-w-full tw-justify-start">
                      {daysOfWeek.map((day) => {
                        const currentTask = getTaskForTimeSlot(day, hour);
                        const shouldDisplayTitle =
                          currentTask && istaskStart(currentTask, day, hour);

                        if (currentTask) {
                          return (
                            <div
                              className="tw-w-[100px] tw-flex tw-justify-center tw-text-center"
                              key={day}
                            >
                              {/* Content for each hour can be added here */}
                              <div className="tw-w-full tw-h-12  tw-border-l-2 tw-border-gray-200 tw-bg-[#3f50b5] tw-text-white">
                                {shouldDisplayTitle && (
                                  <TaskItem task={currentTask} />
                                )}
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div
                            className="tw-w-[100px] tw-flex tw-justify-center tw-text-center"
                            key={day}
                          >
                            {/* Content for each hour can be added here */}
                            <div className="tw-w-full tw-h-12 tw-border-b-2 tw-border-l-2 tw-text-white  "></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
