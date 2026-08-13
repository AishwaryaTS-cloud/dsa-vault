# DSA Pattern Vault 🚀

A full-stack MERN application for managing and revising Data Structures & Algorithms problems in one place.

DSA Pattern Vault allows you to add problems, organize them by Topics and Patterns, track your solving and revision progress, and push your solutions directly to GitHub.

---

## 🌐 Live Application

**Frontend:**
https://dsa-vault-gamma.vercel.app/

**Backend:**
https://dsa-vault-c7cd.onrender.com/

**Health Check:**
https://dsa-vault-c7cd.onrender.com/api/health

---

## ✨ Features

### 📚 DSA Problem Management

- Add new DSA problems
- Edit existing problems
- Delete problems
- Search problems
- Filter by topic, pattern, difficulty and status
- Store solution code
- Track solved problems

### 🧩 Topics & Patterns

Problems can be organized dynamically using Topics and Patterns.

Example:

```text
Arrays
├── Two Pointers
├── Sliding Window
└── Prefix Sum

Greedy
├── Activity Selection
└── Interval Problems

Trees
├── DFS
├── BFS
└── Binary Search Tree

---
Topics and patterns can be created while adding problems instead of depending on a fixed list.

### 🔄 Revision Tracking

The application helps keep track of problems that need revision.

You can use it to maintain a personal DSA revision workflow instead of manually tracking problems in spreadsheets or notes.

### 🐙 GitHub Integration

Solutions can be pushed directly from the application to a GitHub repository.

The application supports:

- GitHub Personal Access Token
- Repository verification
- Branch selection
- Pushing solutions
- Organizing solutions by Topic and Pattern

Example:

```
dsa-solutions/
├── Arrays/
│   └── Two Pointers/
│       └── Two Sum.cpp
│
├── Greedy/
│   └── Interval Problems/
│       └── Activity Selection.cpp
│
└── Trees/
    └── DFS/
        └── Maximum Depth of Binary Tree.cpp
```

### 🔐 Authentication

The application includes:

- User registration
- User login
- JWT authentication
- Protected API requests
- Password hashing with bcrypt

### 💾 Database

Production data is stored using MongoDB Atlas through Mongoose.

The backend also includes an in-memory repository as a fallback when MongoDB is unavailable.

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS
- Fetch API

### Backend

- Node.js
- Express.js
- REST API
- JWT
- bcryptjs
- CORS
- dotenv

### Database

- MongoDB
- MongoDB Atlas
- Mongoose

### GitHub Integration

- GitHub REST API
- Octokit

### Deployment

- Vercel
- Render
- MongoDB Atlas

---

## 🏗️ Architecture

```
                         User
                          │
                          ▼
                ┌──────────────────┐
                │  React Frontend  │
                │     Vercel       │
                └────────┬─────────┘
                         │
                         │ REST API
                         ▼
                ┌──────────────────┐
                │ Node + Express   │
                │     Render       │
                └───────┬──────────┘
                        │
             ┌──────────┴──────────┐
             │                     │
             ▼                     ▼
     ┌───────────────┐     ┌────────────────┐
     │ MongoDB Atlas │     │ GitHub REST API│
     └───────────────┘     └────────────────┘
```

---

## 📁 Project Structure

```
dsa-pattern-vault/
│
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
│   │   │
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   └── package.json
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── models/
│   │   └── Question.js
│   │
│   ├── repositories/
│   │   ├── mongoRepository.js
│   │   └── memoryRepository.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── questions.js
│   │   └── github.js
│   │
│   ├── services/
│   │   └── githubService.js
│   │
│   ├── package.json
│   └── server.js
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```
git clone https://github.com/AishwaryaTS-cloud/dsa-vault.git
cd dsa-vault
```

### 2. Install backend dependencies

```
cd server
npm install
```

Start the backend:

```
npm run dev
```

The backend runs on:

```
http://localhost:5000
```

### 3. Install frontend dependencies

Open another terminal:

```
cd client
npm install
```

Start the frontend:

```
npm run dev
```

Vite will display the local frontend URL in the terminal.

---

## 🔑 Environment Variables

Create a `.env` file in the project root.

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

For the deployed frontend:

```
VITE_API_URL=https://dsa-vault-c7cd.onrender.com
```

Never commit the real `.env` file, database passwords, GitHub tokens, or other secrets to GitHub.

Use `.env.example` to document required environment variables.

---

## 🔌 API Endpoints

### Authentication

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Questions

```
GET    /api/questions
POST   /api/questions
PUT    /api/questions/:id
DELETE /api/questions/:id

GET    /api/questions/stats
GET    /api/questions/topics-patterns
```

### GitHub

```
POST /api/github/verify
POST /api/github/push/:id
```

### Health

```
GET /api/health
```

---

## 🌍 Deployment

The application is deployed using a separate frontend and backend.

### Frontend

```
Vercel
↓
React + Vite
↓
https://dsa-vault-gamma.vercel.app/
```

### Backend

```
Render
↓
Node.js + Express
↓
https://dsa-vault-c7cd.onrender.com/
```

### Database

```
MongoDB Atlas
↓
Mongoose
↓
Express Backend
```

The frontend communicates with the backend through the production API URL:

```
VITE_API_URL=https://dsa-vault-c7cd.onrender.com
```

---

## 🔄 Application Flow

The basic workflow is:

```
Register / Login
       ↓
Dashboard
       ↓
Add DSA Problem
       ↓
Select Topic & Pattern
       ↓
Store Solution
       ↓
Track Solved / Revision Status
       ↓
Push Solution to GitHub
       ↓
Revise Problems Later
```

---

## 🎯 Purpose

DSA Pattern Vault was built to solve a simple problem: keeping track of DSA practice becomes difficult when problems, solutions, revision notes, patterns, and GitHub code are scattered across different platforms.

This project brings those activities into a single application so that the complete DSA practice workflow can be managed from one place.

---

## 📌 Future Improvements

Possible improvements include:

- LeetCode API integration
- Automatic problem fetching
- Spaced repetition for revision
- Advanced progress analytics
- More detailed GitHub synchronization
- Deployment monitoring
- Automated testing
- Better mobile experience

---

## 👩‍💻 Author

**Aishwarya T S**

Built as a full-stack MERN project for learning, DSA practice, and portfolio development.

---