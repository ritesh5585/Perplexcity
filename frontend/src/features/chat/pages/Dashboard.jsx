import React, { useState, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useDashboard } from "../components/useDashboard";
import { useRef } from "react";
import getTheme from "../components/Theme";

import {
  Trash2,
  Sun,
  Moon,
  MoreHorizontal,
  MessageSquare,
  ArrowUp,
  Menu,
  X,
  User,
} from "lucide-react";

/* ================= TYPEWRITER ================= */

const Typewriter = ({ content }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 3;
      setText(content.slice(0, i));
      if (i >= content.length) clearInterval(id);
    }, 15);

    return () => clearInterval(id);
  }, [content]);

  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>;
};

/* ================= CHAT ITEM ================= */

const ChatItem = ({ c, isActive, onOpen, onDelete, t }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // click outside close
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      className={`group relative flex items-center justify-between rounded-xl px-3 py-2 transition-all duration-200
      ${t.bgItemHover} ${isActive ? t.bgItemActive : ""}`}
    >
      {/* Title */}
      <button
        onClick={() => onOpen(c.id)}
        className={`flex-1 truncate text-left text-sm transition-colors
        ${isActive ? t.textMain : t.textMuted}`}
      >
        {c.title}
      </button>

      {/* Dots Button */}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="opacity-0 group-hover:opacity-100 transition"
        >
          <MoreHorizontal size={16} />
        </button>

        {/* Dropdown */}

        {open && (
          <div
            className={`absolute right-0 mt-2 w-32 rounded-lg shadow-lg border ${t.borderMain} ${t.bgMain} z-50`}
          >
            <button
              onClick={() => onDelete(c.id)}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-red-500/10 text-red-500"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= SIDEBAR ================= */
const Sidebar = ({ chats, currentChatId, onOpen, onDelete, t }) => (
  <>
    <button
      onClick={() => window.location.reload()}
      className={`mb-6  flex w-full items-center justify-center gap-2 rounded-xl py-3 border ${t.borderMain} ${t.bgItemHover}`}
    >
      <MessageSquare size={22} /> New Chat
    </button>

    <div className="flex flex-col gap-1 overflow-y-auto">
      {Object.values(chats).map((c) => (
        <ChatItem
          key={c.id}
          c={c}
          isActive={currentChatId === c.id}
          onOpen={onOpen}
          onDelete={onDelete}
          t={t}
        />
      ))}
    </div>
  </>
);

/* ================= MAIN ================= */
const Dashboard = () => {
  const {
    chatInput,
    setChatInput,
    mobileOpen,
    setMobileOpen,
    isDark,
    chats,
    currentChatId,
    user,
    messagesEndRef,
    userDetail,
    handleSubmit,
    handleDelete,
    toggleTheme,
    handleOpenChat,
  } = useDashboard();

  /*  FIXED THEME */
  const t = useMemo(() => getTheme(isDark), [isDark]);

  const messages = chats[currentChatId]?.messages || [];

  return (
    <main className={`${t.bgMain} ${t.textMain} min-h-screen flex flex-col `}>
      {/* ================= NAVBAR ================= */}

      <header
        className={`flex justify-between items-center p-4 border-b ${t.borderMain}`}
      >
        <div className="flex items-center gap-2">
          <button onClick={() => setMobileOpen(true)} className="md:hidden">
            <Menu size={20} />
          </button>
          <h1 className="font-bold text-lg m-2">Perplexity</h1>
        </div>

        <div className="flex gap-5 items-center">
          <button onClick={toggleTheme}>
            {isDark ? <Sun size={22} /> : <Moon size={22} />}
          </button>

          {/* <button
            onClick={userDetail}
            className="w-8 h-8 rounded-full flex items-center justify-center border"
          >
            {user?.username ? user.username[0] : <User size={16} />}
          </button> */}
        </div>
      </header>

      {/* ================= BODY ================= */}
      <div className="flex flex-1 ">
        {/* Sidebar */}
        <aside
          className={`hidden md:flex flex-col w-64 p-4 border-r gap-3 ${t.borderMain}`}
        >
          <Sidebar
            chats={chats}
            currentChatId={currentChatId}
            onOpen={handleOpenChat}
            onDelete={handleDelete}
            t={t}
          />
        </aside>

        {/* Mobile Sidebar */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden ">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileOpen(false)}
            />
            <aside className={`relative w-64 p-4 ${t.bgMain}`}>
              <button onClick={() => setMobileOpen(false)}>
                <X />
              </button>
              <Sidebar
                chats={chats}
                currentChatId={currentChatId}
                onOpen={handleOpenChat}
                onDelete={handleDelete}
                t={t}
              />
            </aside>
          </div>
        )}

        {/* Chat Area */}
        <section className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-18 space-y-4">
            {messages.length ? (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`${msg.role === "user" ? "text-right" : ""} `}
                >
                  <div className="inline-block max-w-[80%]">
                    {msg.role === "user" ? (
                      <p>{msg.content}</p>
                    ) : msg.isNew ? (
                      <Typewriter content={msg.content} />
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center mt-20">
                <h1 className="text-4xl font-bold">Perplexity</h1>
                <p className={t.textMuted}>Ask anything...</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className={`p-8  flex justify-center`}>
            <div className={` flex gap-1 px-2  rounded-full max-w-200 `}>
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className={`flex-1 bg-transperent px-8 outline-none rounded-full border-1`}
                placeholder="Ask anything..."
              />
            </div>
            <div className={`flex m-1 p-3 bg-transperent  rounded-full border-1`}>
              <button type="submit" className="cursor-pointer ">
                <ArrowUp size={25} />
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
