# 🔍 Perplexity City

 A production-grade AI search engine that doesn't just call an API — it orchestrates tools, manages state, and thinks before responding.

## 🎯 What This Is

An AI-powered search system where **the agent decides** when to search the web, when to use uploaded documents, and when it has enough context to answer. Not a chatbot wrapper — a **multi-tool reasoning system** with persistent memory and real-time search.

**Built to solve:** How do you make an LLM reliable when it needs external knowledge?

---

## 🧠 System Architecture

```
User Query
    ↓
Agent (LangChain) — Decides which tool to use
    ├─→ Tavily Search (real-time web)
    ├─→ RAG Pipeline (user documents)
    └─→ LLM (Groq - LLaMA 3.3 70B)
    ↓
Context Injection → Answer Generation
    ↓
MongoDB (persist chat + memory)
    ↓
Streaming UI (React + Redux)
```

**Flow that matters:**
1. Agent receives query → analyzes intent
2. Calls `tavilySearch` tool if web knowledge needed
3. Calls `ragSearch` tool if question about uploaded docs
4. Injects retrieved context into LLM prompt
5. Streams response with markdown rendering
6. Saves to MongoDB with per-user memory isolation

---

## ⚙️ Technical Decisions

### 1. **Agent-First Design**
Instead of hardcoding "if X then search," I use LangChain's `bindTools()` — the LLM **chooses** which tool to invoke based on the query. This makes it extensible (add weather tool, calculator, etc.) without changing core logic.

### 2. **Proper Message Formatting**
LangChain v1.x broke `AgentExecutor`. I rebuilt using:
- `AIMessage` with `tool_calls` → trigger tool
- `ToolMessage` with `tool_call_id` → return result
- Clean message history for multi-turn conversations

This took 8+ hours to debug. Now it works flawlessly.

### 3. **MongoDB Vector Search (Upcoming)**
Embeddings stored in same DB as chats. No external vector DB needed. Cosine similarity in-memory for <1000 docs, Atlas Vector Search for scale.

### 4. **OAuth2 Done Right**
Gmail OAuth2 with **auto-refreshing tokens** using `googleapis`. Not App Password — real production auth with 7-day Testing mode workaround documented.

### 5. **Optimistic UI Updates**
Redux dispatches message **before** API response. Chat feels instant. Server confirms async. If fail → rollback with error state.

---

## 🔥 What Makes This Different

| Most AI Projects | This Project |
|-----------------|--------------|
| Single API call → response | Agent orchestrates multiple tools |
| Stateless conversations | Per-user persistent memory (MongoDB) |
| Hardcoded logic | Dynamic tool selection by LLM |
| Tutorial-level error handling | Production error boundaries + rollback |
| Chat-only | Chat + Document Upload + RAG (coming) |

**This is systems thinking** — not "connect API and pray."

---

## 🛠️ Tech Stack

**Frontend:** React 18 + Redux Toolkit + TailwindCSS + Vite  
**Backend:** Node.js + Express + MongoDB + Mongoose  
**AI Layer:** LangChain 1.x + Groq (LLaMA 3.3 70B) + Tavily Search  
**Auth:** JWT + Gmail OAuth2 (auto-refresh)  
**Tools:** Nodemailer + Socket.io + @xenova/transformers (embeddings)

---

## 💀 Real Problems Solved

### Problem 1: LangChain v1.x Breaking Changes
`langchain/agents` path removed. `AgentExecutor` deprecated. Docs outdated.

**Solution:** Rebuilt agent using `llm.bindTools()` with proper `AIMessage` → `ToolMessage` flow. Studied source code when docs failed.

---

### Problem 2: Empty AI Responses
Agent was calling `llmWithTools.invoke()` in final step — causing infinite tool loop.

**Solution:** Use `llm.invoke()` (no tools) for final answer generation after tool results received. Subtle but critical.

---

### Problem 3: Chat Not Saving
`currentChatId` used before declaration in `sendMessage` controller.

**Solution:** Hoisting issue. Moved declaration to top. Added proper `try-catch` with rollback.

---

### Problem 4: OAuth2 Tokens Expiring
Gmail refresh token dies after 7 days in Testing mode.

**Solution:** Publish app in Google Console. Generate new refresh token. Document the process for future deployments.

---

### Problem 5: MongoDB .sort() Crash
Passed `{ createdAt: 1 }` to JavaScript array `.sort()` instead of Mongoose query.

**Solution:** `messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))`. Type checking would've caught this (TypeScript next).

---
- Think in **system flows** — not just functions
- Read error **stack traces** properly
- Understand **why** a pattern exists before using it
- Debug by **isolating** — add logs, test one thing, move forward

**Biggest shift:** From "fix bugs" to "understand the system."

---

## 🚀 Features

- ✅ Real-time web search integration (Tavily)
- ✅ AI agent with multi-tool orchestration (LangChain)
- ✅ Persistent chat history per user (MongoDB)
- ✅ Auto-generated chat titles via LLM inference
- ✅ JWT authentication + cookie sessions
- ✅ Gmail OAuth2 email verification (auto-refresh tokens)
- ✅ Markdown rendering with syntax highlighting
- ✅ Typewriter effect for streaming responses
- ✅ Dark/Light theme with localStorage persistence
- ✅ Mobile-responsive sidebar
- ✅ Delete & manage chat history
- 🔜 **RAG Integration** — upload PDFs, ask from your docs
- 🔜 **TypeScript Migration** — type safety for scale

---

## 📂 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx      # Main chat UI
│   │   ├── Typewriter.jsx     # Streaming effect
│   │   └── ErrorBoundary.jsx  # Graceful failures
│   ├── hooks/
│   │   ├── useChat.js         # Chat logic extraction
│   │   └── useAuth.js         # Auth state management
│   ├── store/
│   │   ├── chat.slice.js      # Redux chat state
│   │   └── auth.slice.js      # Redux auth state
│   └── services/
│       ├── chat.api.js        # API calls
│       └── chat.socket.js     # Socket.io client

backend/
├── src/
│   ├── ai/
│   │   ├── llm.js             # Groq LLM setup
│   │   ├── tools.js           # Tavily + RAG tools
│   │   ├── agent.js           # Agent with bindTools
│   │   └── rag.service.js     # Document embeddings (upcoming)
│   ├── controllers/
│   │   ├── auth.controller.js # Login/register/verify
│   │   └── chat.controller.js # Message handling
│   ├── models/
│   │   ├── user.model.js
│   │   ├── chat.model.js
│   │   └── message.model.js
│   ├── middleware/
│   │   └── auth.middleware.js # JWT validation
│   └── routes/
│       ├── auth.routes.js
│       └── chat.routes.js
```

### Installation

```bash
# Clone repo
git clone https://github.com/yourusername/perplexity-city.git
cd perplexity-city

# Backend setup
cd backend
npm install
cp .env.example .env  # Add your API keys

# Frontend setup
cd ../frontend
npm install

# Run (separate terminals)
npm run dev  # Backend (port 3000)
npm run dev  # Frontend (port 5173)
```

### Environment Variables

```env
# Backend (.env)
PORT=3000
MONGO_URI=mongodb://localhost:27017/perplexity
JWT_SECRET=your_secret_here
GROQ_API_KEY=gsk_...
TAVILY_API_KEY=tvly-...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REFRESH_TOKEN=...
GOOGLE_USER=your.email@gmail.com
```

---

## 🎓 Learning Resources Used

- [LangChain JS Docs](https://js.langchain.com/docs) — Agent patterns
- [Groq API Docs](https://console.groq.com/docs) — LLM integration
- [Tavily Docs](https://docs.tavily.com) — Search API
- [MongoDB Vector Search](https://www.mongodb.com/docs/atlas/atlas-vector-search) — RAG prep
- Stack Overflow + reading actual error traces

---

## 🔮 Roadmap

- [ ] RAG Integration (MongoDB Vector Search + @xenova embeddings)
- [ ] TypeScript migration for type safety
- [ ] Socket.io real-time streaming (instead of polling)
- [ ] Multi-model support (Gemini, Claude)
- [ ] Deployment (Vercel + Render/Railway)
- [ ] Rate limiting + Redis caching
- [ ] Unit tests (Jest + Supertest)

---

## 📊 Performance

- **Response Time:** ~2-3s (includes LLM + Tavily roundtrip)
- **Chat History:** Limited to 20 messages/user (token optimization)
- **Chunk Size:** 500 chars with 50 char overlap (RAG)
- **Embedding Model:** Xenova/all-MiniLM-L6-v2 (384 dims, local, free)

---

## 🤝 Contributing

This is a learning project, but suggestions welcome!

1. Fork the repo
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📝 License

MIT License — feel free to learn from it, build on it, ship it.

---


⭐ **If this helped you understand AI systems better, consider starring the repo!**
