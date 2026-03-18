import { askAI } from "../ai/ai.service.js";
 
export const chatHandler = async (req, res) => {
    try {
        const { message } = req.body;
 
        if (!message || message.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }
 
        console.log("User message:", message);
 
        const reply = await askAI(message);
 
        res.json({
            success: true,
            answer: reply,
        });
    } catch (error) {
        console.error("❌ Chat error:", error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
 