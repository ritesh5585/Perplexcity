import { askAI } from "../ai/ai.service.js";

export const chatHandler = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user?._id || "default";

        if (!message || message.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        const reply = await askAI(message, userId);

        res.json({
            success: true,
            answer: reply,
        });
    } catch (error) {
        console.error(" Chat error from controller:", error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
