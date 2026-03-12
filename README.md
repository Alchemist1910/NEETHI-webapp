<div align="center">

<img src="./public/neethi-logo.svg" alt="NEETHI Logo" width="180"/>

# NEETHI — Legal Intelligence Platform

**AI-powered legal assistant for Everyone**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase)](https://firebase.google.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-RAG%20Pipeline-3776AB?logo=python)](https://python.org/)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Pages & Routes](#-pages--routes)
- [RAG Pipeline](#-rag-pipeline)
- [Environment Variables](#-environment-variables)

---

## 🏛️ About

**NEETHI** is a modern, AI-powered legal intelligence web application designed to make legal information accessible to everyone. It combines a conversational AI chatbot powered by a Retrieval-Augmented Generation (RAG) pipeline with real-time legal news aggregation and a lawyer directory — all wrapped in a premium, dark-themed UI.

---

## ✨ Features

- 🤖 **AI Legal Chatbot** — Conversational assistant with context-aware legal Q&A powered by RAG
- 📰 **Legal News Feed** — Live legal news aggregation via RSS feeds
- 👨‍⚖️ **Lawyer Directory** — Browse and connect with verified legal professionals
- 🔐 **Authentication** — Secure login and registration via Firebase Auth
- 🎭 **Role Selection** — Separate flows for citizens and legal professionals
- 📱 **Responsive Design** — Fully responsive across desktop and mobile
- ✨ **Premium UI** — Glassmorphism effects, gradient animations, and micro-interactions

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI Library** | [React 19](https://react.dev/) |
| **Language** | JavaScript / [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Vanilla CSS |
| **Auth** | [Firebase Authentication](https://firebase.google.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **HTTP Client** | [Axios](https://axios-http.com/) |
| **RSS Parsing** | [rss-parser](https://www.npmjs.com/package/rss-parser) |
| **Web Scraping** | [Cheerio](https://cheerio.js.org/) |
| **RAG Backend** | Python (ChromaDB vector store) |
| **Fonts** | Google Fonts — Outfit |

---

## 📁 Project Structure

```
NEETHI-webapp/
│
├── 📂 app/                          # Next.js App Router root
│   ├── 📂 about/                    # About page
│   │   └── page.js
│   ├── 📂 api/                      # API Routes (Next.js route handlers)
│   │   └── 📂 legal-news/
│   │       └── route.js             # RSS legal news aggregation endpoint
│   ├── 📂 chat/                     # AI Chatbot page
│   │   └── page.js
│   ├── 📂 components/               # App-level shared components
│   │   └── Navbar.js                # Global navigation bar
│   ├── 📂 home/                     # Home/landing page
│   │   └── page.js
│   ├── 📂 lawyers/                  # Lawyer directory page
│   │   └── page.js
│   ├── 📂 legal-news/               # Legal news listing page
│   │   └── page.js
│   ├── 📂 lib/                      # App-level utilities
│   │   └── firebase.js              # Firebase app configuration & init
│   ├── 📂 login/                    # Login page
│   │   └── page.js
│   ├── 📂 register/                 # Registration page
│   │   └── page.js
│   ├── 📂 role/                     # Role selection page (citizen / lawyer)
│   │   └── page.js
│   ├── favicon.ico                  # App favicon
│   ├── globals.css                  # Global CSS resets & base styles
│   ├── layout.tsx                   # Root layout (fonts, metadata, providers)
│   └── page.js                      # Root entry route (redirects to /home)
│
├── 📂 components/                   # Reusable UI component library
│   ├── 📂 ui/                       # Primitive UI components
│   │   ├── ai-input-with-loading.tsx  # AI chat input with streaming loader
│   │   └── textarea.tsx             # Auto-resizing textarea primitive
│   └── 📂 hooks/                    # Custom React hooks
│       └── use-auto-resize-textarea.ts  # Hook for dynamic textarea height
│
├── 📂 lib/                          # Shared utilities (root level)
│   └── utils.ts                     # clsx + tailwind-merge utility (cn())
│
├── 📂 public/                       # Static assets served at /
│   ├── 📂 icons/                    # Navigation & UI icon images
│   │   ├── connect.png
│   │   ├── home.png
│   │   ├── lady-justics.png
│   │   ├── login.png
│   │   └── news.png
│   ├── neethi-logo.svg              # Primary brand logo
│   ├── image-removebg-preview.png   # Supplementary brand image
│   ├── globe.svg                    # Decorative SVG
│   ├── next.svg                     # Next.js logo
│   ├── vercel.svg                   # Vercel logo
│   └── window.svg                   # Decorative SVG
│
├── 📂 icons/                        # Source icon assets (build-time)
│   ├── connect.png
│   ├── home.png
│   ├── login.png
│   └── news.png
│
├── 📂 rag/                          # Python RAG (Retrieval-Augmented Generation) backend
│   ├── 📂 chroma_db/                # Persisted ChromaDB vector store
│   ├── 📂 rag/
│   │   └── 📂 chroma_db/            # Nested ChromaDB collections
│   ├── 📂 __pycache__/              # Python bytecode cache
│   ├── main.py                      # FastAPI / entry point for RAG server
│   └── rag_pipeline.py              # Core RAG logic (embedding + retrieval)
│
├── .gitignore                       # Git ignore rules
├── eslint.config.mjs                # ESLint flat config
├── next.config.ts                   # Next.js configuration
├── next-env.d.ts                    # Next.js TypeScript declarations
├── package.json                     # NPM dependencies & scripts
├── package-lock.json                # Locked dependency tree
├── postcss.config.mjs               # PostCSS config (Tailwind plugin)
├── script.js                        # Utility / helper script
├── style.css                        # Legacy / supplementary styles
├── tsconfig.json                    # TypeScript compiler config
└── wrk2.code-workspace              # VS Code workspace settings
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ & **npm** v9+
- **Python** 3.9+ (for the RAG pipeline)
- A **Firebase** project with Authentication enabled

### 1. Clone the Repository

```bash
git clone https://github.com/Alchemist1910/NEETHI-webapp.git
cd NEETHI-webapp
```

### 2. Install Node Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root (see [Environment Variables](#-environment-variables)).

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. (Optional) Start the RAG Backend

```bash
cd rag
pip install -r requirements.txt   # if a requirements.txt exists
python main.py
```

---

## 📜 Available Scripts

| Script | Command | Description |
|---|---|---|
| **dev** | `npm run dev` | Start Next.js in development mode with hot reload |
| **build** | `npm run build` | Create an optimised production build |
| **start** | `npm run start` | Run the production build locally |
| **lint** | `npm run lint` | Run ESLint across the codebase |

---

## 🗺 Pages & Routes

| Route | File | Description |
|---|---|---|
| `/` | `app/page.js` | Root entry — redirects to `/home` |
| `/home` | `app/home/page.js` | Landing / hero page |
| `/chat` | `app/chat/page.js` | AI legal chatbot interface |
| `/legal-news` | `app/legal-news/page.js` | Live legal news feed |
| `/lawyers` | `app/lawyers/page.js` | Lawyer directory & profiles |
| `/about` | `app/about/page.js` | About the NEETHI platform |
| `/login` | `app/login/page.js` | User sign-in page |
| `/register` | `app/register/page.js` | New user registration page |
| `/role` | `app/role/page.js` | Role selection (citizen / lawyer) |
| **API** | | |
| `GET /api/legal-news` | `app/api/legal-news/route.js` | Fetches & returns legal RSS news |

---

## 🧠 RAG Pipeline

The `rag/` directory contains a standalone Python service that powers the chatbot's knowledge retrieval:

| File | Purpose |
|---|---|
| `main.py` | Server entry point — exposes API endpoints for the Next.js frontend |
| `rag_pipeline.py` | Core pipeline — document loading, embedding, ChromaDB indexing & retrieval |
| `chroma_db/` | Persistent vector store holding embedded legal document chunks |

The chatbot sends user queries to this service, which retrieves the most relevant legal context before generating a response.

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root with the following keys:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# RAG Backend (Python service URL)
NEXT_PUBLIC_RAG_API_URL=http://localhost:8000
```

> ⚠️ **Never commit `.env.local` to version control.** It is already listed in `.gitignore`.

---

<div align="center">

Made with ❤️ by the NEETHI Team

</div>
