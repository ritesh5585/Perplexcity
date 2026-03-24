import { AIMessage, ChatMessage } from "@langchain/core/messages";
import { askAI } from "../ai/ai.service.js";
import chatModel from "../models/chat.model.js"
import { generateChatTitle } from "../ai/agent.js";
import messageModel from "../models/msg.model.js";

export const chatHandler = async (req, res) => {

    try {
        const { message, chat: chatId } = req.body;
        const userId = req.user.id || "default";

        let title = null;
        let chat = null;

        let currentChatId = chatId || chat?._id;

        if (!chatId) {

            title = (await generateChatTitle(message))
                .split(" ")
                .slice(0, 5)
                .join(" ");
            chat = await chatModel.create({ user: userId, title })
            currentChatId = chat._id;

        }


        await messageModel.create({
            chat: currentChatId,
            content: message,
            role: "user",
        });

        const history = await messageModel.find({ chat: currentChatId });
        const answer = await askAI(message, userId, history);

        const aiMessage = await messageModel.create({
            chat: currentChatId,
            content: answer,
            role: "ai",
        });


        res.status(201).json({
            success: true,
            chatId: currentChatId,
            title,
            aiMessage,

        });
    } catch (error) {

        console.error(" Chat error from chat controller:", error.message);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export const getChatList = async (req, res) => {
    try {

        const { chatId } = req.params;

        const chat = await chatModel.findOne({
            _id: chatId,
            user: req.user?.id
        });

        if (!chat) return res.status(404).json({ message: "Chat not found" });

        const messages = await messageModel.find({
        chat: chatId
    })

        res.status(200).json({ messages });

    } catch (error) {
        console.error("Error from getChatList controller:", error)
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function deleteChat(req, res) {
    try {
        const { chatId } = req.params;

        const chat = await chatModel.findOneAndDelete({
            _id: chatId,
            user: req.user.id,
        });

        if (!chat) return res.status(404).json({ message: "Chat not found" });
        await messageModel.deleteMany({ chat: chatId });
        res.status(200).json({ message: "Chat deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}