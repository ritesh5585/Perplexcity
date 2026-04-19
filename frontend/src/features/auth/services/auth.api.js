import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
})

export const register = ({ email, username, password }) =>
    api.post("/api/auth/register", { email, username, password }).then(r => r.data)

export const login = ({ email, password }) =>
    api.post("/api/auth/login", { email, password }).then(r => r.data)

export const getMe = () =>
    api.get("/api/auth/get-me").then(r => r.data)

export const sendVerificationEmail = (email) =>
    api.post("/api/auth/send-verification", { email }).then(r => r.data)

// ✅ Naya — DB se check karo email verified hai ya nahi
export const checkEmailVerified = (email) =>
    api.get(`/api/auth/check-verified?email=${email}`).then(r => r.data)