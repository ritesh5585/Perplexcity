import { useDispatch } from "react-redux"
import { register, login, getMe, sendVerificationEmail } from "../services/auth.api"
import { setUser, setError, setLoading, setIsSending, setVerified } from "../auth.slice"

export function useAuth() {

    const dispatch = useDispatch()

    async function handleRegister(username, email, password) {
        try {

            dispatch(setLoading(true))
            const data = await register({ username, email, password })

            dispatch(setUser(data.user))

        } catch (error) {

            dispatch(setError(error.response?.data?.message || "Registration failed"))
            throw error

        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin(email, password) {
        try {

            dispatch(setLoading(true))

            const data = await login({ email, password })
            dispatch(setUser(data.user))

        } catch (error) {
            dispatch(setError(error.response?.data?.message || "login failed"))
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetMe() {
        try {

            dispatch(setLoading(true))

            const data = await getMe()
            dispatch(setUser(data.user))

        } catch (error) {
            dispatch(setError(error.response?.data?.message || "GetMe failed"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleVerifyEmail(email) {
        try {
            dispatch(setIsSending(true))
            await sendVerificationEmail(email)
            dispatch(setVerified(true))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Verification failed"))
            dispatch(setVerified(false))
        } finally {
            dispatch(setIsSending(false))
        }
    }

    return {
        handleRegister,
        handleLogin,
        handleGetMe,
        handleVerifyEmail
    }
}