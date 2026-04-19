import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        sending: false,       // verify button loading
        verified: false,      // ✅ sirf DB se confirm hone pe true
        isDark: localStorage.getItem("theme") !== "light",
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.loading = false;
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
        // ✅ Sirf DB confirm karne ke baad true hoga
        setVerified: (state, action) => {
            state.verified = action.payload;
        },
        setIsDark: (state, action) => {
            state.isDark = action.payload;
            localStorage.setItem("theme", action.payload ? "dark" : "light");
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.verified = false;
        },
    },
});

export const {
    setUser, setLoading, setError,
    setIsSending, setVerified, setIsDark, logout
} = authSlice.actions;

export default authSlice.reducer;