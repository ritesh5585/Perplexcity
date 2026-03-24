import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
})

export const sendMessages = async ({ message, chatId }) => {

    const response = await api.post("/api/chats/messages", { message, chatId })
    return response.data
}

export const getMessages = async (chatId) => {

    const response = await api.get(`/api/chats/${chatId}/messages`)
    return response.data
}

export const deleteChats = async (chatId) => {
    const response = await getAdapter.delete(`/api/chats/${chatId}/messages`)
    return response.data
} 