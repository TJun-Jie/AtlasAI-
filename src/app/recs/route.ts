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
          "Generate a new schedule that contains a list of event objects," +
          "based on the following tasks and stress scores." +
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
    const re = /text\\":\\(.*?)\\"/g;
    const words = re.exec(res.data);
    console.log(words);
    for (const token of words ?? []) {
      ret += token.slice(9);
    }
    console.log(ret);
    ret = res.data;
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
