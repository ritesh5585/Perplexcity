import { askAI } from "../ai/ai.service.js";

export const chatHandler = async (req, res) => {
    try {
        const { message } = req.body;
        console.log(message)

        const reply = await askAI(message);

        res.json({
            success: true,
            answer: reply,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};