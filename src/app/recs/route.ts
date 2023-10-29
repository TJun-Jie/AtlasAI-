import axios from "axios";

export async function GET(request: Request) {
  let ret = "";
  try {
    const req = await request.text();
    const res = await axios.post(
      "https://api.together.xyz/inference",
      {
        model:
          // "aarona@bu.edu/CodeLlama-13b-Instruct-atlasAI-finetune-2023-10-29-04-24-24",
          "togethercomputer/CodeLlama-34b-Instruct",
        max_tokens: 2043,
        prompt:
          "[INST] " +
          "Based on the following tasks and stress scores, generate a new schedule that contains a list of event objects" +
          "Provide the data in the form of a list of JSON objects, here is an example:" +
          `output: [
            {
                startTime: "2023-11-13T20:00:00",
                deadline: "2023-11-18T12:00:00",
                isFixed: false,
                title: "Math Problem Set 1",
                duration: 240,  
                priority: 1,
                reason: "You appear to always be stressed around this time :(. Consider doing homework later on when you are less stressed!"
            }, 
            {
                startTime: "2023-11-13T15:00:00",
                deadline: NULL,
                isFixed: true,
                title: "Basketball Training",
                duration: 120, 
                priority: 2,  
                reason: "You appear more stressed in the morning. How about exercising later in the afternoon instead?"
            },
            {
                startTime: "2023-11-13T14:00:00",
                deadline: NULL,
                isFixed: true,
                title: "Coding class",
                duration: 60, 
                priority: 1,
                reason: NULL
            },
            {
                startTime: "2023-11-13T18:00:00",
                deadline: NULL,
                isFixed: false,
                title: "Team Standup",
                duration: 120,
                priority: "You appear to always be stressed around this time :(. Consider doing this task later on when you are less stressed!"
            }].` +
          "If the current schedule makes sense, you do not need to change it." +
          "If there is a difference between the new schedule and the old schedule, " +
          "add a new reason field to each rescheduled task and describe the reason for the change.\n" +
          req +
          " [/INST]",
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1,
        stream_tokens: true,
        stop: ["</s>", "[INST]"],
        negative_prompt: "",
        sessionKey: "a73e3e0bd6ffd65d9e488c3160c8984009265d87",
        type: "chat",
      },
      {
        headers: {
          Authorization: "Bearer " + process.env.TOGETHER_API_KEY,
        },
      }
    );
    const re = /"text":"(.*?)"/g;
    let match;
    while ((match = re.exec(res.data)) !== null) {
      ret += match[1];
    }
  } catch (e: unknown) {
    console.log(e);
    if (e instanceof Error) {
      return new Response(e.message, {
        status: 500,
      });
    }
  }

  return Response.json(ret);
}
