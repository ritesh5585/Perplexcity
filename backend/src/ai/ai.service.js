import { createAgent } from "./agent.js";

let agent;

export const initAI = async () => {
    agent = await createAgent();
};

export const askAI = async (message, userId, history) => {
    if (!agent) throw new Error("Agent not initialized");

    const response = await agent.invoke({
        input: message,
        userId,
        history
    });

    return response.output;
};