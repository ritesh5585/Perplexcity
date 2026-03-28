// src/hooks/useDashboard.js
import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat"
import getTheme from "../components/Theme";

export const useDashboard = () => {
    const chat = useChat();

    const [chatInput, setChatInput] = useState("");
    const [openMenuId, setOpenMenuId] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isDark, setIsDark] = useState(true);

    const chats = useSelector((s) => s.chat.chats);
    const currentChatId = useSelector((s) => s.chat.currentChatId);
    const { user } = useSelector((s) => s.auth);

    const messagesEndRef = useRef(null);
    const menuRef = useRef(null);

    // Init
    useEffect(() => {
        chat.initializeSocketConnection();
        chat.handleGetChats();
        setIsDark(localStorage.getItem("pplx-theme") !== "light");
    }, []);

    // Auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chats, currentChatId]);

    // Close menu outside click
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target))
                setOpenMenuId(null);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const msg = chatInput.trim();
        if (!msg) return;
        chat.handleSendMessage({ message: msg, chatId: currentChatId });
        setChatInput("");
    };

    const handleToggleMenu = useCallback((e, id) => {
        e?.stopPropagation();
        setOpenMenuId((prev) => (prev === id ? null : id));
    }, []);

    const handleDelete = useCallback(async (id) => {
        await chat.handleDeleteSingleChat?.(id);
        setOpenMenuId(null);
    }, [chat]);

    const toggleTheme = () => {
        const next = !isDark;
        setIsDark(next);
        localStorage.setItem("pplx-theme", next ? "dark" : "light");
    };

    const userDetail = () => {

    }

    return {
        // State
        chatInput, setChatInput,
        openMenuId, mobileOpen, setMobileOpen,
        isDark,
        chats, currentChatId, user,
        theme: getTheme(isDark),
        currentMessages: chats[currentChatId]?.messages ?? [],
        messagesEndRef, menuRef,
        handleSubmit,
        handleToggleMenu,
        handleDelete,
        toggleTheme,
        userDetail,
        handleOpenChat: (id) => chat.handleOpenChat(id, chats),
        handleNewChat: () => window.location.reload(),
    };
};

