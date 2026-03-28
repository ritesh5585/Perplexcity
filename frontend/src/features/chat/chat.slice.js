import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: {},
        currentChatId: null,
        isLoading: false,
        error: null
    },
    reducers: {
        createNewChat: (state, action) => {
            const { chatId, title } = action.payload
            state.chats[chatId] = {
                id: chatId,
                title,
                messages: [], // ✅ fixed
                lastUpdated: new Date().toString()
            }
        },

        addNewMessage: (state, action) => {
            const { chatId, content, role, isNew } = action.payload
            if (!state.chats[chatId]) return;
            state.chats[chatId].messages.push({ content, role, isNew })
        },

        addMessages: (state, action) => {
            const { chatId, messages } = action.payload
            if (!state.chats[chatId]) return;
            state.chats[chatId].messages.push(...messages)
        },

        setChats: (state, action) => {
            state.chats = action.payload
        },

        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },

        removeChat: (state, action) => {
            const chatId = action.payload;
            delete state.chats[chatId];
            if (state.currentChatId === chatId) {
                state.currentChatId = null;
            }
        },

        setLoading: (state, action) => {
            state.isLoading = action.payload
        },

        setError: (state, action) => {
            state.error = action.payload
        },
    }
})
export const { setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage, addMessages, removeChat } = chatSlice.actions

export default chatSlice.reducer