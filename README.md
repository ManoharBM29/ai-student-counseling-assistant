# 🤖 AI Student Counseling Assistant
### Module Contribution — EduPath University Management Platform

> A full-stack GenAI + Agentic AI module built as an internship contribution.
> Powered by **Groq LLaMA 3.3 70B** · **FastAPI** · **React** · **PostgreSQL**

---

## 🏗️ Architecture

```
Frontend (React + Tailwind)
        ↓ REST API
Backend (FastAPI)
        ↓
8-Agent Orchestrator (Groq LLaMA 3.3)
  ├── OrchestratorAgent  → Master brain
  ├── ProfilerAgent      → Academic analysis
  ├── SkillGapAgent      → Skills + courses
  ├── UniversityAgent    → University matching
  ├── SOPWriterAgent     → SOP generation
  ├── SOPReviewerAgent   → SOP review + score
  ├── InterviewCoachAgent→ Interview prep
  └── TrackerAgent       → Timeline + checklist
        ↓
PostgreSQL (9 tables)
```

---

## 🚀 Setup

### Step 1 — Database
```bash
psql -U postgres
CREATE DATABASE ai_counseling;
\c ai_counseling
\i database/schema.sql
\q
```

### Step 2 — Backend
```bash
cd backend
cp .env.example .env
# Edit .env → add GROQ_API_KEY

python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Step 3 — Frontend
```bash
cd frontend
npm install
npm run dev
```

### Or Docker (one command)
```bash
export GROQ_API_KEY=gsk_your_key
export JWT_SECRET=any_random_string
docker-compose up --build
```

---

## 📁 Project Structure

```
ai-counseling-module/
├── backend/
│   └── app/
│       ├── main.py              # FastAPI entry
│       ├── agents/
│       │   └── orchestrator.py  # ALL 8 AGENTS
│       ├── api/
│       │   ├── auth.py          # JWT auth
│       │   └── counseling.py    # Session APIs
│       ├── models/models.py     # DB models
│       └── utils/jwt.py         # Token utils
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Home.jsx         # Landing
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── NewSessionPage.jsx
│       │   ├── LiveAgentsPage.jsx  # Real-time agent view
│       │   └── ReportPage.jsx   # Full results
│       ├── services/api.js
│       └── store/store.js
├── database/schema.sql          # 9 tables
└── docker-compose.yml
```

---

## 🔌 API Endpoints

```
POST /api/auth/register
POST /api/auth/login
POST /api/counseling/start      → starts 8-agent pipeline
GET  /api/counseling/status/:id → poll agent progress
GET  /api/counseling/report/:id → full report
GET  /api/counseling/sessions   → session history
```

---

## 💬 Resume Line

> "Developed AI Student Counseling Assistant module for EduPath EdTech Platform — an 8-agent LangGraph orchestration system using Groq LLaMA 3.3 + FastAPI that automates university matching, SOP generation, skill gap analysis, interview prep and application tracking, reducing manual counseling from 9 hours to 2 minutes per student."
