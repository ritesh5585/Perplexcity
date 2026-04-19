# 🔍 Perplexity Clone — Real-Time AI Search Engine

An advanced Retrieval-Augmented Generation (RAG) system that combines live web search, semantic retrieval, and LLM-based synthesis to deliver accurate, source-backed answers in real-time.

---

## 🚀 Features

- ⚡ Real-time AI-powered search
- 🌐 Live web retrieval (Tavily / Serper)
- 📚 Context-aware answer generation
- 🔗 Source citations
- 🔄 Streaming responses (SSE)
- 🧠 Scalable RAG architecture

---

## 🏗️ Tech Stack

- Frontend: React.js
- Backend: Node.js + Express
- LLM: OpenAI / Anthropic
- Search API: Tavily / Serper
- Scraping: Cheerio / Playwright
- Vector DB: Pinecone (planned)

---

## 🧠 Architecture

```mermaid
graph TD
A[User Query] --> B[Search API]
B --> C[Web Scraper]
C --> D[Chunking]
D --> E[Vector DB]
E --> F[Top-K Retrieval]
F --> G[LLM]
G --> H[Streaming Response]
H --> I[React UI]

git clone https://github.com/your-repo
cd project

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

OPENAI_API_KEY=
TAVILY_API_KEY=
PINECONE_API_KEY=
