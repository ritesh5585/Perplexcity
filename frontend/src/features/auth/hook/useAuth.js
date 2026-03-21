import { useDispatch } from "react-redux"
import { register, login, getMe } from "../services/auth.api"
import { setUser, setError, setLoading } from "../auth.slice"

export function useAuth() {

    const dispatch = useDispatch()

    async function handleRegister(username, email, password) {
        try {

            dispatch(setLoading(true))
            const data = await register({ username, email, password })

        } catch (error) {

            dispatch(setError(error.response?.data?.message || "Registration failed"))

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

    return {
        handleRegister,
        handleLogin,
        handleGetMe
    }
}
