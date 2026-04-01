import { createSlice } from "@reduxjs/toolkit";

// App load pe localStorage se token check karo
const token = localStorage.getItem("token");

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: token || null,        // ✅ Persisted token
        isAuthenticated: !!token,    // ✅ Token hai toh true
        loading: !!token,            // ✅ Token hai toh getMe call hogi, tab tak loading
        error: null,
        sending: false,
        verified: localStorage.getItem("verified") === "true" || false, // ✅ Persisted verified
        isDark: localStorage.getItem("theme") !== "light", // ✅ Theme persist
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.loading = false;
        },

        setToken: (state, action) => {
            state.token = action.payload;
            if (action.payload) {
                localStorage.setItem("token", action.payload); // ✅ Persist
            } else {
                localStorage.removeItem("token");
            }
        },

        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        setIsSending: (state, action) => {
            state.sending = action.payload;
        },

        setVerified: (state, action) => {
            state.verified = action.payload;
            localStorage.setItem("verified", action.payload); // ✅ Persist verified
        },

        setIsDark: (state, action) => {
            state.isDark = action.payload;
            // ✅ Theme persist
            localStorage.setItem("theme", action.payload ? "dark" : "light");
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
            localStorage.removeItem("token");
            localStorage.removeItem("verified"); // ✅ Remove verified on logout
        },
    },
});

export const {
    setUser, setToken, setLoading, setError,
    setIsSending, setVerified, setIsDark, logout
} = authSlice.actions;

export default authSlice.reducer;