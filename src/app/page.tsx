"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

import { Box, Modal, TextField, Typography, Button } from "@mui/material";
import { Delete, DoneAll, AddReaction } from "@mui/icons-material";
import { useState } from "react";
import dayjs from "dayjs";
import { Doc } from "../../convex/_generated/dataModel";
import TaskItem from "./components/TaskItem";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
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
  const sendTasks = useMutation(api.schedule_tasks.send);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [value, setValue] = useState<string | number>('');
  const [touched, setTouched] = useState(false);


  const handleChange = (event: SelectChangeEvent<string | number>) => {
  
  const prior = ['Low', 'Medium', 'High']
  setValue(event.target.value);
  for (let i = 0; i < 10; i++){
    if (prior[i] == value){
      setValue(i+1)
    }
  }
  
  };

  const hasError = touched && value === '';

  const [isModalOpen, setIsModalOpen] = useState(false);

  const stressData = useQuery(api.stressScores.getStressScores, {
    hour: getCurrentHourInSanFrancisco(),
  });
  const score = stressData ? stressData[0].score : 0;
  const lastUpdated = stressData ? stressData[0]._creationTime : 0;
  const dateTimeUTC = dayjs(lastUpdated);

  if (!tasks) {
    return <div>Loading...</div>;
  }

  function cleanString(str: string) {
    const stopwords = ["schedule", "around", "hour", "need", "hours", "Monday", "Mon", "help", "Tuesday", "Tue", "got", "Wednesday", "Wed", "Thursday", "Thu","Friday", "Fri","Saturday", "Sat", "Sunday", "Sun", "pm", "takes", "mon", "am" ,"i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now", "want"];
    const regex = new RegExp(`\\b(${stopwords.join("|")})\\b`, "gi");
    const cleaned = str.replace(regex, '').replace(/\d+/g, '').replace(/\s+/g, ' ').trim();

    return cleaned;
  }

  const handleButtonClick = async () => {
    // Do something when the button is clicked
    if (input.trim() === '') {
      setError(true);
      return
    } else {
      setError(false);
      // Your logic here
    }
    
    let dayoweek = '';
    const regex1 = /\b(?:mon(?:day)?|tue(?:sday)?|wed(?:nesday)?|thu(?:rsday)?|fri(?:day)?|sat(?:urday)?|sun(?:day)?)\b/gi;
    let match1;
    if ((match1 = regex1.exec(input)) !== null) {
        const day = match1[0].toLowerCase();
        console.log(day)
        if (day.startsWith('mon')) {
          dayoweek = '2023-10-30T';
        } else if (day.startsWith('tue')) {
          dayoweek = '2023-10-31T';
        } else if (day.startsWith('wed')) {
          dayoweek = '2023-11-01T';
        } else if (day.startsWith('thu')) {
          dayoweek = '2023-11-02T';
        } else if (day.startsWith('fri')) {
          dayoweek = '2023-11-03T';
        } else if (day.startsWith('sat')) {
          dayoweek = '2023-11-04T';
        } else if (day.startsWith('sun')) {
          dayoweek = '2023-10-29T';
        }
    }

    const time = extractTime(input);
    let timing: string = dayoweek + time + ':00.000Z';
    const date = new Date(timing);
    const newDate = new Date(date.getTime() + (7 * 60 * 60 * 1000));
    const newTimestamp = newDate.toISOString();

    const regex = /(\d+)\s*hours?/;
    const match = input.match(regex);

    const final = cleanString(input);


    
     
    if (match != null && typeof value != 'string'){
      const time_taken = parseInt(match[1], 10);
      await sendTasks({startTime: newTimestamp, deadline: '', isFixed: true, title: final, duration: time_taken, priority: value});;
    }

    setValue('');
    setInput('');
  };


  function extractTime(prompt: string): string | null {
    const regex = /(\d+)(?::(\d+)|\s*([APMapm]{2}))/; // This regex will match a time like 2, 2pm, 2:00, or 2:00pm
    const match = prompt.match(regex);

    if (match) {
        console.log(match)
        const hour = parseInt(match[1], 10);  // The hour part is in the first capturing group
        const minute = match[2] ? parseInt(match[2], 10) : 0;  // The minute part is optional and is in the second capturing group
        const period = match[3] ? match[3].toUpperCase() : null;  // The period (AM/PM) is optional and is in the third capturing group

        // Now convert the extracted hour, minute, and period to a time
        let militaryHour = hour;
        if (period) {
            militaryHour = period === 'PM' && hour < 12 ? hour + 12 : hour;
            militaryHour = period === 'AM' && hour === 12 ? 0 : militaryHour;
        }

        // Format the military hour and minute as HH:mm
        const formattedTime = `${militaryHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        return formattedTime;
    }

    return null;  // Return null if no time was found
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
          onClose={() => {
            setIsModalOpen(false);
          }}
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
                style={{ height: "600px", width: "200px" }}
              >
                <div className="tw-grid tw-grid-cols-25 tw-w-fit tw-ml-auto tw-mr-auto">
                  {/* Hour Labels */}
                  <div className="tw-sticky tw-top-0 tw-z-[100]  ">
                    <div className="tw-flex tw-flex-row tw-w-max tw-justify-between tw-align-center ">
                      <div className="tw-h-12 tw-flex tw-items-center tw-justify-start tw-w-[70px] tw-text-white"></div>
                      <div className="tw-flex tw-row tw-item-center tw-w-full tw-justify-start ">
                        <div className="tw-w-[100px] tw-flex tw-justify-center tw-text-center">
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
                        <div className="tw-w-[100px] tw-flex tw-justify-center tw-text-center ">
                          <div className="tw-w-full tw-h-3 tw-border-l-2 tw-border-r-2"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="tw-flex tw-flex-col tw-justify-between tw-w-max">
                    {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                      <div
                        key={hour}
                        className="tw-flex tw-row tw-items-center"
                      >
                        <div className="tw-h-12 tw-flex tw-items-center tw-justify-start tw-w-[70px] tw-text-white">
                          {hour}:00
                        </div>
                        <div className="tw-flex tw-row tw-item-center tw-w-full tw-justify-start">
                          {["Mon"].map((day) => {
                            const currentTask = getTaskForTimeSlot(day, hour);
                            const shouldDisplayTitle =
                              currentTask &&
                              istaskStart(currentTask, day, hour);

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
                style={{ height: "600px", width: "100%" }}
              >
                <div className="tw-flex tw-w-full">
                  <div className="tw-grid tw-grid-cols-25 tw-w-fit tw-ml-auto tw-mr-auto">
                    {/* Hour Labels */}
                    <div className="tw-sticky tw-top-0 tw-z-[100]  ">
                      <div className="tw-flex tw-flex-row tw-w-max tw-justify-between tw-align-center ">
                        <div className="tw-h-12 tw-flex tw-items-center tw-justify-start tw-w-[70px] tw-text-white"></div>
                        <div className="tw-flex tw-row tw-item-center tw-w-full tw-justify-start ">
                          <div className="tw-w-[100px] tw-flex tw-justify-center tw-text-center">
                            <div className="tw-w-full tw-h-12  tw-text-white ">
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
                          <div className="tw-w-[100px] tw-flex tw-justify-center tw-text-center ">
                            <div className="tw-w-full tw-h-3 tw-border-l-2 tw-border-r-2"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="tw-flex tw-flex-col tw-justify-between tw-w-max">
                      {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                        <div
                          key={hour}
                          className="tw-flex tw-row tw-items-center"
                        >
                          <div className="tw-h-12 tw-flex tw-items-center tw-justify-start tw-w-[70px] tw-text-white">
                            {hour}:00
                          </div>
                          <div className="tw-flex tw-row tw-item-center tw-w-full tw-justify-start">
                            {["Mon"].map((day) => {
                              const currentTask = getTaskForTimeSlot(day, hour);
                              const shouldDisplayTitle =
                                currentTask &&
                                istaskStart(currentTask, day, hour);

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

                  {/* Reasons Column */}
                  <div className="tw-grid tw-grid-cols-25 tw-w-fit tw-ml-auto tw-mr-auto">
                    {/* Hour Labels */}
                    <div className="tw-sticky tw-top-0 tw-z-[100]  ">
                      <div className="tw-flex tw-flex-row tw-w-max tw-justify-between tw-align-center ">
                        <div className="tw-flex tw-row tw-item-center tw-w-full tw-justify-start ">
                          <div className="tw-w-[100px] tw-flex tw-justify-center tw-text-center">
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
                          <div className="tw-w-[100px] tw-flex tw-justify-center tw-text-center ">
                            <div className="tw-w-full tw-h-3  tw-border-l-2 tw-border-r-2"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="tw-flex tw-flex-col tw-justify-between tw-w-max">
                      {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                        <div
                          key={hour}
                          className="tw-flex tw-row tw-items-center"
                        >
                          <div className="tw-flex tw-row tw-item-center tw-w-full tw-justify-start">
                            {["Mon"].map((day) => {
                              const currentTask = getTaskForTimeSlot(day, hour);
                              const shouldDisplayTitle =
                                currentTask &&
                                istaskStart(currentTask, day, hour);

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
                </div>
              </OverlayScrollbarsComponent>
            </div>

            {/* Action Buttons */}
            <div className="tw-flex tw-w-full tw-justify-around tw-mt-10">
              <Button
                variant="contained"
                size="large"
                color="success"
                startIcon={<DoneAll />}
                onClick={() => setIsModalOpen(false)}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                size="large"
                color="error"
                startIcon={<Delete />}
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
            <Typography variant="h6">Give Me a Task</Typography>

            <div className="tw-flex tw-items-center tw-w-[1000px]">
            <Box mr={2}>
              <TextField
                multiline
                variant="outlined"
                placeholder={"What are you doing today?"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                fullWidth
                error={error}
                helperText={error && "The text field is empty"}
                sx={{ color: "#fff" }}
              />
              </Box>
              <Button variant="contained" color="primary" onClick={handleButtonClick} sx={{ color: "#fff" }}>
                Send
              </Button>
            </div>


          <div className="tw-flex tw-justify-center tw-items-center tw-h-[50]vh">
            <FormControl variant="outlined" className="tw-w-full pt-[50px]" error={hasError}>
              <InputLabel id="demo-simple-select-outlined-label">Rank this task by priority</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={value}
                onChange={handleChange}
                label="Rank this task by priority"
              >
                <MenuItem value={1}>Low</MenuItem>
                <MenuItem value={2}>Medium</MenuItem>
                <MenuItem value={3}>High</MenuItem>
              </Select>
              {hasError && (
        <FormHelperText>
          You must select a priority
        </FormHelperText>
      )}
            </FormControl>
        </div>



            <Button
              variant="contained"
              size="large"
              startIcon={<AddReaction />}
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
