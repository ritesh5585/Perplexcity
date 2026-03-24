import express from "express";
import { authUser } from "../middleware/auth.middleware.js";
import {
    chatHandler,
    getChatList,
    deleteChat
}
    from "../controllers/chat.controller.js";

const router = express.Router();

router.get(`/:chatId/messages`,authUser, getChatList)
router.post("/messages",authUser, chatHandler);
router.delete("/:chatId/messages",authUser, deleteChat)

export default router;
