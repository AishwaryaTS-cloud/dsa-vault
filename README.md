# DSA Pattern Vault 🚀

A modern, minimalist, Vercel/Linear-inspired MERN application to track Data Structures & Algorithms (DSA) problems, organize them dynamically into Topics and Patterns, and push code solutions directly to GitHub.

---

## Key Features

- **Zero Pre-loaded Bloat**: Starts 100% empty (`0 Problems, 0 Solved, 0 Due`).
- **Dynamic Topic & Pattern Tree**: Create topics (e.g. *Arrays*, *Greedy*, *Trees*) and patterns (e.g. *Two Pointers*, *Sliding Window*, *Monotonic Stack*) on-the-fly when adding problems.
- **GitHub REST Integration**: Pushes solution code directly to GitHub repositories using `@octokit/rest` under `<Repo>/<Topic>/<Pattern>/<Title>.<ext>`. Automatically updates existing files upon revision.
- **In-Memory Fallback & MongoDB**: Operates seamlessly with MongoDB Mongoose or automatic in-memory persistence fallback if MongoDB URI is not active.
- **Classy Linear/Vercel Aesthetic**: Plain CSS design system with subtle dark/light themes, code editor preview window controls, difficulty badges, and clean metric cards.

---

## Project Structure

```
dsa-pattern-vault/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── StatsOverview.jsx
│   │   │   ├── TopicList.jsx
│   │   │   ├── PatternGrid.jsx
│   │   │   ├── QuestionTable.jsx
│   │   │   ├── QuestionModal.jsx
│   │   │   ├── SolutionModal.jsx
│   │   │   └── GitHubSettingsModal.jsx
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
├── server/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── Question.js
│   ├── repositories/
│   │   ├── mongoRepository.js
│   │   └── memoryRepository.js
│   ├── routes/
│   │   ├── questions.js
│   │   └── github.js
│   ├── services/
│   │   └── githubService.js
│   ├── package.json
│   └── server.js
├── .env
├── .env.example
├── .gitignore
└── README.md
```

---

## Quick Start

### 1. Install & Run Backend Server

```bash
cd server
npm install
npm run dev
```
*The Express backend server runs on `http://localhost:5000`.*

### 2. Install & Run Frontend Client

```bash
cd client
npm install
npm run dev
```
*The Vite React frontend client runs on `http://localhost:3000`.*

---

## GitHub Integration Setup

1. Click **Connect GitHub** in the top navigation bar.
2. Enter your **GitHub Personal Access Token (PAT)** with `repo` scope.
3. Enter your target repository (`username/dsa-solutions`).
4. Click **Test Connection** and save!
5. When adding or viewing a solution, click **Push to GitHub** to publish code instantly.
