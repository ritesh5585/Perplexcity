import { createAgent } from "./agent.js";
 
let agent;
 
export const initAI = async () => {
  agent = await createAgent();
  console.log("AI Ready 🚀");
};
 
export const askAI = async (message) => {
  if (!agent) throw new Error("Agent not initialized");
 
  const response = await agent.invoke({
    input: message,
  });
 
  return response.output;
};