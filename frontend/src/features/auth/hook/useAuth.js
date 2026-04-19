import { useDispatch } from "react-redux"
import { register, login, getMe, sendVerificationEmail, checkEmailVerified } from "../services/auth.api"
import { setUser, setError, setLoading, setIsSending, setVerified } from "../auth.slice"

export function useAuth() {
    const dispatch = useDispatch()

    // ─── Register ──────────────────────────────────
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

    // ─── Login ─────────────────────────────────────
    async function handleLogin(email, password) {
        try {
            dispatch(setLoading(true))
            console.log("calling")
            const data = await login({ email, password })
            dispatch(setUser(data.user))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Login failed"))
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }

    // ─── Get Me ────────────────────────────────────
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

    // ─── Verify Email — Email bhejo + Polling shuru ─
    async function handleVerifyEmail(email) {
        if (!email) return

        try {
            dispatch(setIsSending(true))
            dispatch(setVerified(false))
            await sendVerificationEmail(email)

            // Clear any existing interval
            if (window._verifyInterval) {
                clearInterval(window._verifyInterval)
            }

            // ✅ Polling shuru
            const interval = setInterval(async () => {
                try {
                    const data = await checkEmailVerified(email)
                    if (data.verified) {
                        dispatch(setVerified(true))
                        clearInterval(interval)
                    }
                } catch {
                    // ignore
                }
            }, 3000)

            setTimeout(() => clearInterval(interval), 10 * 60 * 1000)

            // ✅ intervalId store karo — wapas aane pe bhi check ho
            window._verifyInterval = interval

        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Verification failed"))
        } finally {
            dispatch(setIsSending(false))
        }
    }

    // ─── Manual Verification Check (Fallback) ───────
    async function handleCheckVerification(email) {
        if (!email) return false
        try {
            const data = await checkEmailVerified(email)
            if (data.verified) {
                dispatch(setVerified(true))
                if (window._verifyInterval) clearInterval(window._verifyInterval)
                return true
            }
            return false
        } catch {
            return false
        }
    }

    return { handleRegister, handleLogin, handleGetMe, handleVerifyEmail, handleCheckVerification }
}