# 🚀 VelocityChat

A fast, no-nonsense real-time chat app built with full-stack TypeScript.

The goal here wasn't to build a massive WhatsApp clone with a hundred half-baked features. Instead, I wanted to focus on building a simple chat app the **right way**—handling edge cases, keeping the database fast, and making sure the server doesn't crash if things go wrong.

---

## Core Features & How They Work Under the Hood ----->

### 1. Simple, Smart DB Design (PostgreSQL + Drizzle)

Most chat apps make the mistake of creating one table for 1-on-1 private chats and a totally different table for group chats. That turns your backend code into spaghetti.

- **The Fix:** VelocityChat treats everything as a "Conversation Room." Whether it’s a DM between 2 people or a group chat with 5 people, it’s just a row in the `conversations` table.
- **Why it matters:** When a user sends a message, the backend doesn't need to ask "Is this a DM or a group?". It just sends the message to that Room ID. In this codebase that model is implemented in the DB schema and repo layers under `app/backend/src/db/schema` and `app/backend/src/repo`, and the rest of the server and socket logic relies on the conversation id as the single source of truth for routing messages.

### 2. The 3-Step Handshake (No Chat Spam)

You can't just message anyone out of the blue. To prevent spam, starting a chat looks like a phone call:

1. **User A** sends a request via username.
2. The server spins up a "pending" room in the DB and pings **User B** in real-time.
3. **User B** hits Accept or Reject. If they accept, the server instantly locks both users into the room. If they reject, the database cleanly wipes the pending room so there's no ghost data floating around.

In this project the handshake logic lives in the socket handlers (`app/backend/src/socket/handlers/chat.handler.ts` and `connection.handler.ts`). The server creates the conversation record on accept, joins both sockets to the room id, and returns the `privateChatId` back to both clients so the UI can open the correct room.

### 3. Bulletproof Real-Time Logic (Socket.io)

Real-time code can get messy quickly. Here’s how this app stays stable:

- **No Server Crashes:** All async database writes are completely isolated. If the database hiccups while User A is connecting, it won't crash the server or affect User B who is already chatting.
- **No Memory Leaks:** On the frontend (React), when you switch from Chat A to Chat B, the app automatically tears down the old network listener before opening a new one. This stops your browser from running slow or duplicating messages on your screen.

Concretely, socket handling is implemented under `app/backend/src/socket` and the frontend listeners are wired in `app/frontend/src/socket` and the hooks (`app/frontend/src/hooks/useSocket.ts`, `useConversations.ts`). Those hooks make sure listeners are registered and cleaned up according to the active conversation, preventing duplicate events and memory leaks.

---

## 🛠️ The Tech Stack ----->

- **Frontend:** React 19 + TypeScript (For a clean, type-safe UI)
- **State Management:** Redux Toolkit (To keep track of active chats and message lists)
- **Backend:** Node.js + Express + TypeScript (Fast, asynchronous event loop)
- **Real-time:** Socket.io (For the live message streams)
- **Database:** PostgreSQL run on **Docker** + Drizzle ORM (Pure SQL speed with TypeScript safety)

---

## What’s Next (The Scaling Roadmap) ---->

The code is intentionally structured so that these two major infrastructure upgrades can be plugged in easily next:

### Scaling Out with Redis Pub/Sub

Right now, if this app runs on a single server, it works great. But what happens when we scale to 2 or 3 servers behind a load balancer? If you are on Server 1 and your friend is on Server 2, your web sockets can't talk to each other.

- **The Plan:** I will add **Redis Pub/Sub** as a middleman. When you send a message, Server 1 throws it into Redis, Redis blasts it to all other servers, and your friend gets the message instantly no matter what server they are hooked up to.

### Priority Notification Queue

System notifications (like security alerts or password reset emails) shouldn't get stuck in the same slow traffic line as regular chat messages.

- **The Plan:** Implement a priority queue using **Redis Sorted Sets**. This gives every background job a weight. A security alert will skip the line ahead of 1,000 chat messages, ensuring critical actions happen instantly.

---

## 💻 How to Run It Locally ---->

### 1. Boot up the Database (Docker)

```bash
docker compose -f app/backend/docker-compose.yml up -d
```

### 2. Start the Backend Server

```bash
cd app/backend
npm install
# (optional) populate seed data locally
npm run seed
npm run dev        # Starts the dev server
```

### 3. Start the Frontend App

```bash
cd app/frontend
npm install
npm run dev        # Starts the React app
```

Open `http://localhost:5174` in your browser, and you should see the login page. Create two accounts in different browsers or incognito windows to test the chat functionality.
