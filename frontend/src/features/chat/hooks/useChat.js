import { initializeSocketConnection } from "../services/chat.socket";
import { sendMessages, getMessages, getChats, deleteChats } from "../services/chat.api"
import {
    setChats,
    setCurrentChatId,
    setError,
    setLoading,
    createNewChat,
    addMessages,
    addNewMessage
}
    from "../chat.slice";

import { useDispatch } from "react-redux"

export const useChat = () => {

    const dispatch = useDispatch()

    async function handleSendMessage({ message, chatId }) {
        try {
            dispatch(setLoading(true))

            const data = await sendMessages({ message, chatId })

            const responseChatId = data.chatId
            const { aiMessage } = data

            if (!chatId)
                dispatch(createNewChat({
                    chatId: responseChatId,
                    title: data.title,
                }))

            dispatch(addNewMessage({
                chatId: chatId || responseChatId,
                content: message,
                role: "user",
            }))
            dispatch(addNewMessage({
                chatId: chatId || responseChatId,
                content: aiMessage.content,
                role: aiMessage.role,
                isNew: true
            }))
            dispatch(setCurrentChatId(responseChatId))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to send message"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetChats() {
        
        try {
            dispatch(setLoading(true))

            const data = await getChats()
            const { chats } = data

            dispatch(setChats(chats.reduce((acc, chat) => {
                acc[chat._id] = {
                    id: chat._id,
                    title: chat.title,
                    messages: [],
                    lastUpdated: chat.updatedAt,
                }
                return acc
            }, {})))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to get chats"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleOpenChat(chatId, chats) {
        
        try {
            if (chats[chatId]?.messages.length === 0) {
                const data = await getMessages(chatId)
                const { messages } = data

                const formattedMessages = messages.map(msg => ({
                    content: msg.content,
                    role: msg.role,
                }))

                dispatch(addMessages({
                    chatId,
                    messages: formattedMessages,
                }))
            }
            dispatch(setCurrentChatId(chatId))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to open chat"))
        }
    }

    async function handleDeleteSingleChat(chatId) {
        try {
            await deleteChats(chatId);
            const { removeChat } = require("../chat.slice");
            dispatch(removeChat(chatId));
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to delete chat"));
        }
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat,
        handleDeleteSingleChat,
    }
}