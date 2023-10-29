import { httpRouter } from "convex/server";
import { getTerraAPI } from "./stressScores";

const http = httpRouter();

http.route({
  path: "/getjj",
  method: "POST",
  handler: getTerraAPI,
});

// Convex expects the router to be the default export of `convex/http.js`.
export default http;
