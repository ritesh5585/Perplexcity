import { createAgent } from "../ai/agent.js";

let agent;

export const initAI = async () => {
  agent = await createAgent();
};

export const askAI = async (message) => {
  if (!agent) throw new Error("Agent not initialized");

  const response = await agent.invoke({
    input: message,
  });

  return response.output;
};