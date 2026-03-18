import {
    HumanMessage,
    SystemMessage,
    ToolMessage,
    AIMessage,
} from "@langchain/core/messages";
import { llm } from "./llm.js";
import { tools } from "./tools.js";

export const createAgent = async () => {
    const llmWithTools = llm.bindTools(tools);

    return {
        invoke: async ({ input }) => {
            // Step 1: Initial call with tools bound
            const messages = [
                new SystemMessage(
                    "You are a helpful AI assistant. Use tools when needed."
                ),
                new HumanMessage(input),
            ];

            const response = await llmWithTools.invoke(messages);
            console.log("🔧 Tool calls:", response.tool_calls);

            // Step 2: Agar tool call hai to execute karo
            if (response.tool_calls?.length > 0) {
                const toolCall = response.tool_calls[0];
                const tool = tools.find((t) => t.name === toolCall.name);

                if (tool) {
                    const toolResult = await tool.invoke(toolCall.args);
                    console.log("🔍 Tool result:", toolResult);

                    // Step 3: AIMessage explicitly banao
                    const aiMessage = new AIMessage({
                        content: "",
                        tool_calls: response.tool_calls,
                    });

                    const toolMessage = new ToolMessage({
                        content: String(toolResult),
                        tool_call_id: toolCall.id,
                    });

                    const finalMessages = [
                        ...messages,
                        aiMessage,   // ✅ Proper AIMessage
                        toolMessage, // ✅ Tool result
                    ];

                    // Step 4: Plain llm — no tools bound, direct answer milega
                    const finalResponse = await llm.invoke(finalMessages);
                    console.log("✅ Final response:", finalResponse.content);

                    return { output: finalResponse.content };
                }
            }

            // Agar koi tool call nahi — direct response
            return { output: response.content };
        },
    };
};