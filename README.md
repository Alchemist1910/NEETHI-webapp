# ⚖️ NEETHI — Legal Help, Simplified.

> **NEETHI** is an AI-powered legal-tech web platform designed to make legal assistance accessible to everyone in India. Connect with lawyers, get instant AI legal guidance, and stay informed with the latest legal news.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python)](https://python.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Folder Structure](#-folder-structure)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 📖 Project Overview

**NEETHI** bridges the gap between ordinary citizens and the legal system. Many people in India lack access to affordable legal guidance — NEETHI solves this by providing:

- An **AI chatbot** trained on Indian legal data that answers legal questions instantly.
- A **Lawyer Directory** where users can browse, filter, and connect with verified lawyers.
- A **Legal News Feed** that surfaces real-time legal updates and judgments.
- Secure **authentication** with role-based access for Users and Lawyers.

The name *Neethi* (நீதி / नीति) means **Justice** in several Indian languages.

---

## ✨ Key Features

- 🤖 **AI Legal Chatbot** — RAG-based chatbot powered by Groq (LLaMA 3.1) and a ChromaDB vector store, fine-tuned with Indian legal documents.
- 👨‍⚖️ **Lawyer Connect** — Browse and filter lawyers by specialization; initiate direct communication.
- 📰 **Legal News** — Auto-updated legal news feed via RSS/web scraping using `cheerio` and `rss-parser`.
- 🔐 **Auth & Roles** — Firebase Authentication with distinct User and Lawyer roles.
- 📱 **Responsive UI** — Clean, modern interface built with Next.js and TailwindCSS.
- ⚡ **Fast & Scalable Backend** — FastAPI async backend serving the RAG pipeline with low latency.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 16 (React 19) | UI framework & routing |
| TailwindCSS 4 | Styling |
| Lucide React | Icon library |
| Axios | HTTP client |
| Firebase SDK | Auth, real-time data |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | REST API server |
| Uvicorn | ASGI server |
| LangChain | RAG orchestration |
| ChromaDB | Vector store (local) |
| HuggingFace Embeddings | `all-MiniLM-L6-v2` sentence model |
| Groq API (LLaMA 3.1) | LLM inference |

### Data & Scraping
| Technology | Purpose |
|---|---|
| `rss-parser` | Legal news RSS feeds |
| `cheerio` | HTML scraping (Node.js) |

---

## 🏗️ System Architecture

```
User Query
    │
    ▼
┌─────────────────────────────────────────────────┐
│              Next.js Frontend                   │
│  (Chatbot UI → POST /chat → FastAPI backend)    │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│              FastAPI (RAG Backend)              │
│                                                 │
│  1. Embed question  →  HuggingFace MiniLM       │
│  2. Retrieve docs   →  ChromaDB (top-k=6)       │
│  3. Generate answer →  Groq / LLaMA 3.1         │
│  4. Return response →  JSON                     │
└─────────────────────────────────────────────────┘
```

**RAG (Retrieval-Augmented Generation)** works by:
1. Converting the user's legal question into a vector embedding.
2. Querying a ChromaDB store of pre-indexed Indian legal documents.
3. Passing the most relevant documents + question to an LLM (Groq) to generate a grounded, accurate answer.

---

## 🚀 Installation

### Prerequisites

- Node.js ≥ 18
- Python ≥ 3.10
- pip
- A [Groq API key](https://console.groq.com/)
- A [Firebase project](https://console.firebase.google.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/Alchemist1910/NEETHI-webapp.git
cd NEETHI-webapp
```

---

### 2. Frontend Setup (Next.js)

```bash
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`.

---

### 3. Backend Setup (FastAPI + RAG)

```bash
cd rag
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

> **Note:** Ensure `chroma_db/` is populated with your indexed legal documents before starting the server.

---

## 🔑 Environment Variables

### Backend (`rag/.env`)

```env
GROQ_API_KEY=your_groq_api_key_here
```

### Frontend (`.env.local` in project root)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_RAG_API_URL=http://127.0.0.1:8000
```

---

## 🖥️ Usage

1. **Register / Login** — Create an account as a User or Lawyer.
2. **Ask the AI** — Navigate to the Chatbot page and ask any Indian legal question.
3. **Find a Lawyer** — Browse the Lawyers directory and filter by specialization.
4. **Read Legal News** — Check the Legal News section for the latest updates.

---

## 📡 API Endpoints

### RAG Backend (FastAPI)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/chat` | Submit a legal question, receive an AI-generated answer |
| `GET` | `/docs` | Interactive Swagger UI (auto-generated) |
| `GET` | `/openapi.json` | OpenAPI schema |

#### `POST /chat` — Request Body

```json
{
  "question": "What is Section 498A of the Indian Penal Code?"
}
```

#### `POST /chat` — Response

```json
{
  "answer": "**Law:** IPC Section 498A\n\n**Key Points:**\n• Deals with cruelty by husband or relatives...\n\n**Explanation:**\nThis section protects married women from domestic abuse and cruelty."
}
```

---

## 📁 Folder Structure

```
NEETHI-webapp/
│
├── app/                        # Next.js App Router
│   ├── home/                   # Home page
│   ├── chat/                   # AI Chatbot page
│   ├── lawyers/                # Lawyer directory
│   ├── legal-news/             # Legal news feed
│   ├── login/                  # Login page
│   ├── register/               # Registration page
│   ├── role/                   # Role selection page
│   ├── about/                  # About page
│   ├── api/                    # Next.js API routes
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
│
├── components/                 # Shared React components
├── lib/                        # Utility functions / Firebase config
├── public/                     # Static assets
├── icons/                      # SVG icons
│
├── rag/                        # Python RAG backend
│   ├── main.py                 # FastAPI app entry point
│   ├── rag_pipeline.py         # RAG chain (LangChain + Groq)
│   ├── chroma_db/              # ChromaDB vector store (local)
│   └── .env                    # Backend environment variables
│
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

---

## 📸 Screenshots

> _Screenshots will be added soon._

| Page | Preview |
|---|---|
| Home | `[screenshot placeholder]` |
| AI Chatbot | `[screenshot placeholder]` |
| Lawyer Directory | `[screenshot placeholder]` |
| Legal News | `[screenshot placeholder]` |
| Login / Register | `[screenshot placeholder]` |

---

## 🗺️ Roadmap

- [ ] **Voice Input** — Let users speak their legal question
- [ ] **Multilingual Support** — Support for Hindi, Tamil, Telugu, and other Indian languages
- [ ] **Document Upload** — Allow users to upload legal documents for AI-powered analysis
- [ ] **Lawyer Booking** — Schedule consultations directly through the platform
- [ ] **Case Tracker** — Help users track the status of their legal cases
- [ ] **Push Notifications** — Notify users of new legal news or lawyer replies
- [ ] **Mobile App** — React Native companion app

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**NEETHI Team**

- GitHub: [@Alchemist1910](https://github.com/Alchemist1910)
- Project: [NEETHI-webapp](https://github.com/Alchemist1910/NEETHI-webapp)

---

<p align="center">Made with ❤️ for accessible justice in India</p>
