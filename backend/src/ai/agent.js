import {
    HumanMessage,
    SystemMessage,
    ToolMessage,
    AIMessage,
} from "@langchain/core/messages";
import { llm } from "./llm.js";
import { tools } from "./tools.js";

// ✅ Har user ki alag history
const conversationHistories = new Map();

export const createAgent = async () => {
    const llmWithTools = llm.bindTools(tools);

    return {
        invoke: async ({ input, userId = "default" }) => {

            // User ki history lo — nahi hai toh khali array
            if (!conversationHistories.has(userId)) {
                conversationHistories.set(userId, []);
            }
            const userHistory = conversationHistories.get(userId);

            // Step 1: Messages banao — history ke saath
            const messages = [
                new SystemMessage(
                    "You are a helpful AI assistant. Use tools when needed."
                ),
                ...userHistory,          // ✅ Pehli baatein yaad
                new HumanMessage(input), // ✅ Naya message
            ];

            const response = await llmWithTools.invoke(messages);
            console.log("🔧 Tool calls:", response.tool_calls);

            let finalOutput = "";

            // Step 2: Agar tool call hai to execute karo
            if (response.tool_calls?.length > 0) {
                const toolCall = response.tool_calls[0];
                const tool = tools.find((t) => t.name === toolCall.name);

                if (tool) {
                    const toolResult = await tool.invoke(toolCall.args);
                    console.log("🔍 Tool result:", toolResult);

                    // AIMessage explicitly banao
                    const aiMessage = new AIMessage({
                        content: "",
                        tool_calls: response.tool_calls,
                    });

                    const toolMessage = new ToolMessage({
                        content: String(toolResult),
                        tool_call_id: toolCall.id,
                    });

                    // Plain llm — no tools bound, direct answer milega
                    const finalResponse = await llm.invoke([
                        ...messages,
                        aiMessage,
                        toolMessage,
                    ]);

                    console.log("✅ Final response:", finalResponse.content);
                    finalOutput = finalResponse.content;
                }
            } else {
                // Koi tool call nahi — direct response
                finalOutput = response.content;
            }

            // Step 3: ✅ History update karo
            userHistory.push(new HumanMessage(input));
            userHistory.push(new AIMessage(finalOutput));

            // Step 4: History limit — sirf last 20 messages
            if (userHistory.length > 20) {
                userHistory.splice(0, 2);
            }

            console.log(`📝 History for ${userId}:`, userHistory.length, "messages");

            return { output: finalOutput };
        },
    };
};