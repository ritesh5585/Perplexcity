# Frontend – Complete Documentation

> This file explains every file, its purpose, the data flow, and all bugs that were found and fixed.

---

## Project Overview

This is a **Perplexity Gen AI ** — a chat-based web app where users can:

1. Register and log in
2. Send messages to an AI agent
3. View AI responses with markdown rendering
4. See chat history in a sidebar

**Tech Stack**:
React 19,
Redux Toolkit,
React Router v7,
Axios,
Socket.io,
TailwindCSS v4,
Vite

---

## Folder Structure

```
frontend/src/
├── main.jsx                          → App entry point, wraps App in Redux Provider
├── index.css                         → Imports TailwindCSS
├── app/
│   ├── App.jsx                       → Root component, initializes auth check, provides router
│   ├── app.router.jsx                → Defines all routes (/, /login, /register, /dashboard)
│   └── app.store.js                  → Redux store with auth and chat reducers
├── features/
│   ├── auth/
│   │   ├── auth.slice.js             → Redux slice: user, loading, error state
│   │   ├── components/
│   │   │   └── Protected.jsx         → Route guard: redirects to /login if not authenticated
│   │   ├── hook/
│   │   │   └── useAuth.js            → Custom hook: handleRegister, handleLogin, handleGetMe
│   │   ├── pages/
│   │   │   ├── Login.jsx             → Login form page
│   │   │   └── Register.jsx          → Registration form page
│   │   └── services/
│   │       └── auth.api.js           → Axios API calls: register(), login(), getMe()
│   └── chat/
│       ├── chat.slice.js             → Redux slice: chats, currentChatId, messages, loading
│       ├── hooks/
│       │   └── useChat.js            → Custom hook: handleSendMessage, handleGetChats, handleOpenChat
│       ├── pages/
│       │   └── Dashboard.jsx         → Main chat UI: sidebar + message area + input
│       └── services/
│           ├── chat.api.js           → Axios API calls: sendMessages(), getChats(), getMessages(), deleteChats()
│           └── chat.socket.js        → Socket.io client connection
```

---

## Data Flow

### Authentication Flow

```
Login.jsx → useAuth().handleLogin(email, password)

  → auth.api.js login() → POST /api/auth/login
  → dispatch(setUser(data.user)) → Redux auth.user is set
  → navigate("/") → Protected.jsx checks auth.user → renders Dashboard
```

### Chat Flow

```
Dashboard.jsx → useChat().handleGetChats()

  → chat.api.js getChats() → GET /api/chats
  → dispatch(setChats(...)) → sidebar shows chat list

Dashboard.jsx → useChat().handleSendMessage({ message, chatId })

  → chat.api.js sendMessages() → POST /api/chats/messages (sends { message, chat: chatId })
  → Backend returns { chatId, title, aiMessage }
  → dispatch(addNewMessage(...)) for user + AI messages
  → Messages appear in the chat area
```

### Redux State Shape

```javascript
{
  auth: {
    user: null | { id, email, username },  // Current logged-in user
    loading: true | false,                  // Auth operation in progress
    error: null | "error message"           // Last auth error
  },

  chat: {
    chats: {                                // All chats keyed by ID
      "chatId123": {
        id: "chatId123",
        title: "Chat Title",
        messages: [{ content: "...", role: "user"|"ai" }],
        lastUpdated: "..."
      }
    },

    currentChatId: null | "chatId123",      // Currently selected chat
    isLoading: false,                       // Chat operation in progress
    error: null                             // Last chat error
  }
  
}
```

---

## All Bugs Found and Fixed

### 1. `Register.jsx` — Completely Broken Form

- **Bug**: `onSubmit` was set to `""` (string), not a function
- **Bug**: `setUsername`, `setEmail`, `setPassword` called but never declared via `useState` → crash
- **Bug**: `value={...}` bindings were commented out → uncontrolled inputs
- **Bug**: No `useAuth` or `useNavigate` imported
- **Fix**: Added `useState` for all 3 fields, `useAuth`, `useNavigate`, and `submitForm` handler

### 2. `Login.jsx` — Navigate Runs on Failed Login

- **Bug**: `navigate("/")` ran even when `handleLogin` threw an error
- **Fix**: Wrapped in try/catch so navigation only fires on success

### 3. `useAuth.js` — Registration Doesn't Set User

- **Bug**: `handleRegister` never dispatched `setUser(data.user)` after success
- **Fix**: Added `dispatch(setUser(data.user))` and `throw error` for caller error handling

### 4. `authAuthInit.js` — Empty Dead File

- **Bug**: 0 bytes, not imported anywhere
- **Fix**: Deleted

### 5. `Dashboard.jsx` — Missing ReactMarkdown Import

- **Bug**: Used `<ReactMarkdown>` but never imported it → crash
- **Bug**: `react-markdown` package was not in `package.json`
- **Bug**: `key={message.id}` but messages don't have `id` field
- **Fix**: Added `import ReactMarkdown`, installed `react-markdown`, changed key to index

### 6. `useChat.js` — Multiple Critical Bugs

- **Bug**: `handleGetChats` used undefined `chatId` variable → crash
- **Bug**: Called `getMessages()` (single-chat API) instead of a "get all chats" API
- **Bug**: No try/catch in any function
- **Bug**: `role: "users"` typo (should be `"user"`)
- **Bug**: Destructured `data.chat._id` but backend returns `data.chatId` (flat)
- **Fix**: Fixed all API calls to match backend response, added error handling everywhere

### 7. `chat.api.js` — Multiple Errors

- **Bug**: `deleteChats` used `getAdapter.delete()` but `getAdapter` was undefined → crash
- **Bug**: `sendMessages` sent `{ chatId }` but backend reads `req.body.chat` → key mismatch
- **Bug**: No `getChats()` function existed for listing all chats
- **Fix**: Changed to `api.delete()`, changed to `{ chat: chatId }`, added `getChats()`

### 8. `chat.socket.js` — Socket Leak

- **Bug**: Socket created but never returned → can't clean up, leaks on re-renders
- **Fix**: Returns socket instance

### 9. `App.jsx` — Fragile Import

- **Bug**: `import from "./app.router"` missing `.jsx` extension
- **Fix**: Added explicit `.jsx` extension

### 10. Backend `app.js` — Typo

- **Bug**: `express.urlencoded({ extend: true })` — should be `extended`
- **Fix**: Changed to `extended: true`

### 11. Backend — Missing GET /api/chats Route

- **Bug**: Frontend `getChats()` called `GET /api/chats` but backend had no such route → 404
- **Fix**: Added `getAllChats` controller and `GET /` route in `chatRoutes.js`

---

## Frontend ↔ Backend API Mapping

| Frontend Function     | HTTP Call                            | Backend Route              | Backend Controller |
| --------------------- | ------------------------------------ | -------------------------- | ------------------ |
| `getChats()`          | `GET /api/chats`                     | `GET /`                    | `getAllChats`      |
| `sendMessages()`      | `POST /api/chats/messages`           | `POST /messages`           | `chatHandler`      |
| `getMessages(chatId)` | `GET /api/chats/:chatId/messages`    | `GET /:chatId/messages`    | `getChatList`      |
| `deleteChats(chatId)` | `DELETE /api/chats/:chatId/messages` | `DELETE /:chatId/messages` | `deleteChat`       |
| `register()`          | `POST /api/auth/register`            | `POST /register`           | auth controller    |
| `login()`             | `POST /api/auth/login`               | `POST /login`              | auth controller    |
| `getMe()`             | `GET /api/auth/get-me`               | `GET /get-me`              | auth controller    |
