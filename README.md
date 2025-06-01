# 🧠 MindWeave — Reflect, Remix, Rewire

**MindWeave** is a reflective thinking platform designed for curious minds to share insights, remix ideas, and explore thematic threads across topics like self-growth, career, relationships, and mindfulness.

Built for the MisogiAI MAC Challenge, this full-stack app empowers users to participate in public wisdom, one thread at a time.

---

## 🌐 Live Demo

🌀 [Visit MindWeave Now](https://spire-thread-nexus.vercel.app)

---

## 🚀 Features

### ✍️ Thread-Based Learning & Reflection
- Create segmented reflective threads (like mini blog chains)
- Explore public threads by topic (self, career, life, etc.)
- Remix others’ threads into your own reflections

### 🔐 Auth & Identity
- Sign up/log in with Supabase Auth
- Users have personal profiles and can track their creations

### 💬 Community Interactions
- Reactions (like 🔥, 💡, 💭) for quick emotional feedback
- Bookmarks and Collections to save threads for later
- "Remix" functionality to reinterpret other users' threads

### 📚 Admin Tools (Optional for future extension)
- Moderation panel for curated threads
- Category/tag management system

---

## 🧱 Built With

- ⚛️ **Next.js 14 (App Router)** — Scalable full-stack framework
- 💅 **Tailwind CSS** — Clean and responsive UI
- 🧩 **Supabase** — Auth, Database, and API services
- 🪄 **Shadcn/ui** — Beautiful headless UI components
- 🔄 **React Query** — Real-time thread syncing
- 💾 **Database schema** — Threads, Segments, Reactions, Bookmarks, Remixes

---

## 📁 Folder Structure

mindweave/
├── src/
│ ├── components/
│ ├── app/
│ ├── lib/
│ ├── utils/
│ └── styles/
├── supabase/
├── public/
├── tailwind.config.ts
└── README.md

---

## 🛠️ Getting Started Locally

```bash
git clone https://github.com/your-username/mindweave.git
cd mindweave
npm install
npm run dev

Create a .env.local file:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key

🔑 Supabase Tables Overview
users: Authenticated user data

threads: Each reflective thread (title, author, category)

segments: Segmented posts within a thread

reactions: Per-segment emoji feedback

bookmarks: Save threads for later

collections: Organize saved threads

remixes: Derived content from other users' threads

💡 How It Works
Feature	Purpose
✨ Threads	Reflective microblogs
➕ Segments	Thought-by-thought expression
🔁 Remixing	Community idea building
📌 Bookmarks	Save deep insights
🔥 Reactions	Show appreciation or resonance


📜 MIT License
🚀 Built by ROHAN RAJ

📍 Special Thanks
🧠 Inspired by ideas from Twitter threads and digital journaling

📣 Designed to foster mindful reflection and collective wisdom


