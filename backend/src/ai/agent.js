import {
    HumanMessage,
    SystemMessage,
    ToolMessage,
    AIMessage,
} from "@langchain/core/messages";
import { llm } from "./llm.js";
import { tools } from "./tools.js";

const conversationHistories = new Map();

const SYSTEM_PROMPT = new SystemMessage(
    "You are a helpful AI assistant. Use tools when needed."
);

export const createAgent = () => {
    const llmWithTools = llm.bindTools(tools);

    return {
        invoke: async ({ input, userId = "default", history = [] }) => {
            // history from DB already contains the current user message (saved in controller before askAI)
            const formattedHistory = history.map(msg => 
                msg.role === 'user' ? new HumanMessage(msg.content) : new AIMessage(msg.content)
            );

            const messages = [
                SYSTEM_PROMPT,
                ...formattedHistory,
            ];

            const res = await llmWithTools.invoke(messages);

            let output = res.content;

            if (res.tool_calls?.length) {
                const { name, args, id } = res.tool_calls[0];
                const tool = tools.find(t => t.name === name);

                if (tool) {
                    const result = await tool.invoke(args);

                    const finalRes = await llm.invoke([
                        ...messages,
                        new AIMessage({ tool_calls: res.tool_calls }),
                        new ToolMessage({
                            content: String(result),
                            tool_call_id: id,
                        }),
                    ]);

                    output = finalRes.content;
                }
            }

            return { output };
        },
    };
};

export const generateChatTitle = async (userMessage, aiResponse) => {
    const titleResponse = await llm.invoke([

        new SystemMessage(

            `Generate a very short title (max 5 words) for this conversation.
       Return ONLY the title — no quotes, no explanation, nothing else.`
        ),
        new HumanMessage(

            `User asked: "${userMessage}"`
        ),
    ])

    return titleResponse.content.trim()
}