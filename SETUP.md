# ✅ Quick Setup Guide

## Step 1 — Create .env file
Go to `backend/` folder, copy `.env.example` to `.env`
Fill in ONLY these 2 values:
```
GROQ_API_KEY=gsk_your_actual_groq_key_here
DATABASE_URL=postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/ai_counseling
```
Leave everything else as-is.

## Step 2 — Setup Database (if not done already)
Open SQL Shell (psql), press Enter for all defaults, then run:
```sql
CREATE DATABASE ai_counseling;
\c ai_counseling
\i 'C:/path/to/ai-counseling-module/database/schema.sql'
\q
```

## Step 3 — Run Backend
```cmd
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
✅ Check: http://127.0.0.1:8000 should show JSON response

## Step 4 — Run Frontend (new terminal)
```cmd
cd frontend
npm install
npm run dev
```
✅ Open: http://localhost:5173

## Step 5 — Test
1. Register account at http://localhost:5173/register
2. Click "New Session"
3. Fill your goal + details
4. Click "Launch AI Counseling"
5. Watch 8 agents run live
6. View full report!

## Groq API Key
Get free key at: https://console.groq.com
