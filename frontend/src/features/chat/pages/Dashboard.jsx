import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useDashboard } from "../components/useDashboard";
import {
  Trash2,
  Sun,
  Moon,
  MoreHorizontal,
  ArrowUp,
  Menu,
  X,
  User,
  Sparkles,
  Plus,
} from "lucide-react";

/* Markdown */
const Md = ({ children }) => (
  <div className="md">
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
  </div>
);

/* Typewriter */
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

  return <Md>{text}</Md>;
};

/* Chat Item */
const ChatItem = ({ c, isActive, onOpen, onDelete }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (!open) return;
    const fn = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [open]);

  return (
    <div
      ref={ref}
      className={`ci relative flex items-center gap-1 rounded-lg px-2 py-1.75 mb-px cursor-pointer transition ${isActive ? "active" : ""}`}
      onClick={() => onOpen(c.id)}
    >
      <span className="ci-title flex-1 text-[13px] truncate text-[var(--muted)]">
        {c.title}
      </span>

      <button
        className="ci-dot opacity-0 transition flex items-center p-1 rounded text-[var(--muted)]"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        <MoreHorizontal size={13} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden z-50 bg-[var(--bg)] border border-[var(--accent-b)] shadow-[var(--shadow)] min-w-27.5">
          <button
            className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-[var(--danger)] hover:bg-[var(--danger-bg)]"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(c.id);
              setOpen(false);
            }}
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

/* Sidebar */
const Sidebar = ({ chats, currentChatId, onOpen, onDelete, onNew }) => (
  <div className="flex flex-col h-full gap-1">
    <button
      onClick={onNew}
      className="flex  items-center justify-center gap-2 w-full py-2 px-3 rounded-xl text-[13px] font-semibold mb-2 border border-[var(--accent-b)] bg-[var(--accent-s)] text-[var(--active)] hover:brightness-110 transition"
    >
      <Plus size={14} /> New Chat
    </button>

    <p className="text-[10px] font-bold uppercase tracking-widest px-1 mb-1 text-[var(--muted)]">
      History
    </p>

    <div className="flex-1 overflow-y-auto p-2 ">
      {Object.values(chats).map((c) => (
        <ChatItem
          key={c.id}
          c={c}
          isActive={currentChatId === c.id}
          onOpen={onOpen}
          onDelete={onDelete}
        />
      ))}
    </div>
  </div>
);

/* Dashboard */
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

  const messages = chats[currentChatId]?.messages || [];

  const sidebarProps = {
    chats,
    currentChatId,
    onOpen: handleOpenChat,
    onDelete: handleDelete,
    onNew: () => window.location.reload(),
  };

  return (
    <>

      <div className="flex flex-col h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]">
        {/* NAVBAR */}
        <header className="flex items-center justify-between px-4 h-13.5 shrink-0 z-20 backdrop-blur-md bg-[var(--bg-nav)] border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <button
              className="md:hidden p-1.5 rounded-lg text-[var(--muted)]"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={19} />
            </button>

            <div className="flex items-center gap-2 font-bold text-[17px] text-[var(--accent)]">
              <Sparkles size={17} /> Perplexity
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="p-1.5 rounded-lg text-[var(--muted)] hover:bg-[var(--hover)]"
              onClick={toggleTheme}
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <button
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border border-[var(--accent-b)] bg-[var(--accent-s)] text-[var(--active)]"
              onClick={userDetail}
            >
              {user?.username ? (
                user.username[0].toUpperCase()
              ) : (
                <User size={14} />
              )}
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* SIDEBAR */}
          <aside className="hidden md:flex flex-col w-56 p-3 bg-[var(--bg-side)] border-r border-[var(--border)]">
            <Sidebar {...sidebarProps} />
          </aside>

          {/* MOBILE */}
          {mobileOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden ">
              <div
                className="absolute inset-0 bg-black/50 "
                onClick={() => setMobileOpen(false)}
              />
              <aside className="relative w-57.5 p-3 bg-[var(--bg-side)] ">
                <button
                  className="mb-2 text-var(--muted) "
                  onClick={() => setMobileOpen(false)}
                >
                  <X size={18} />
                </button>
                <Sidebar {...sidebarProps} />
              </aside>
            </div>
          )}

          {/* CHAT */}
          <section className="flex flex-1 flex-col overflow-hidden">
            {messages.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3">
                <Sparkles size={30} />
                <p className="text-3xl font-bold">Perplexity</p>
                <p className="text-sm text-var(--muted)">
                  Ask anything — I'll find the answer.
                </p>
              </div>
            ) : (
              <div className="msgs flex-1 overflow-y-auto flex flex-col gap-3 p-5">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start gap-2"}`}
                  >
                    {msg.role !== "user" && (
                      <div className="w-6 h-6 flex items-center justify-center bg-[var(--accent)] rounded">
                        <Sparkles size={12} color="#fff" />
                      </div>
                    )}

                    {msg.role === "user" ? (
                      <div className="max-w-[60%] px-4 py-2 rounded-lg bg-[var(--ubg)] border border-[var(--uborder)] text-[var(--utext)]">
                        {msg.content}
                      </div>
                    ) : (
                      <div className="max-w-[75%] text-[var(--ai-text)]">
                        {msg.isNew ? (
                          <Typewriter content={msg.content} />
                        ) : (
                          <Md>{msg.content}</Md>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* INPUT */}
            <div className="p-3 border-t border-gray-500 bg-[var(--bg-nav)]">
              <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
                <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-500 focus-within:border-[var(--accent-b)]">
                  <input
                    className="flex-1 bg-transparent outline-none text-sm text-var(--text) "
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask Anything"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="p-2 bg-[var(--accent)] rounded-full text-white rounded disabled:opacity-30"
                  >
                    <ArrowUp size={22} />
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
