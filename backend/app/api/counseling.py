from fastapi import APIRouter, Depends, BackgroundTasks
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel
from typing import Optional, List
from app.database import get_db
from app.models.models import CounselingSession, AgentLog
from app.utils.jwt import verify_token
from app.agents.orchestrator import run_counseling_pipeline
import uuid, json, asyncio

router = APIRouter()

class SessionRequest(BaseModel):
    student_goal: str
    target_degree: Optional[str] = None
    target_field: Optional[str] = None
    target_country: Optional[str] = None
    budget_usd: Optional[int] = None
    gpa: Optional[float] = None
    english_test: Optional[str] = None
    english_score: Optional[float] = None
    work_experience: Optional[int] = 0
    skills: Optional[List[str]] = []

@router.post("/start")
def start_session(req: SessionRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db), token=Depends(verify_token)):
    user_id = token["sub"]
    session = CounselingSession(
        user_id=uuid.UUID(user_id),
        student_goal=req.student_goal,
        target_degree=req.target_degree,
        target_field=req.target_field,
        target_country=req.target_country,
        budget_usd=req.budget_usd,
        gpa=req.gpa,
        english_test=req.english_test,
        english_score=req.english_score,
        work_experience=req.work_experience,
        skills=req.skills,
        status="processing"
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    session_id = str(session.id)
    background_tasks.add_task(run_counseling_pipeline, session_id)
    return {"session_id": session_id, "status": "processing"}

@router.get("/status/{session_id}")
def get_status(session_id: str, db: Session = Depends(get_db), token=Depends(verify_token)):
    session = db.query(CounselingSession).filter(CounselingSession.id == uuid.UUID(session_id)).first()
    if not session:
        return {"status": "not_found"}
    logs = db.query(AgentLog).filter(AgentLog.session_id == uuid.UUID(session_id)).order_by(AgentLog.logged_at).all()
    return {
        "status": session.status,
        "agents_completed": [{"agent": l.agent_name, "status": l.status, "duration_ms": l.duration_ms} for l in logs]
    }

@router.get("/report/{session_id}")
def get_report(session_id: str, db: Session = Depends(get_db), token=Depends(verify_token)):
    rows = db.execute(text("""
        SELECT
            cs.student_goal, cs.target_degree, cs.target_field, cs.status, cs.created_at,
            sp.strengths, sp.weak_areas, sp.profile_summary, sp.readiness_score,
            sga.current_skills, sga.required_skills, sga.missing_skills,
            sga.recommended_courses, sga.gap_score, sga.timeline_weeks,
            ip.questions, ip.tips, ip.focus_areas,
            at2.deadlines, at2.document_checklist
        FROM counseling_sessions cs
        LEFT JOIN student_profiles sp ON sp.session_id = cs.id
        LEFT JOIN skill_gap_analysis sga ON sga.session_id = cs.id
        LEFT JOIN interview_prep ip ON ip.session_id = cs.id
        LEFT JOIN application_timelines at2 ON at2.session_id = cs.id
        WHERE cs.id = :sid
    """), {"sid": session_id}).fetchone()

    universities = db.execute(text(
        "SELECT * FROM university_matches WHERE session_id = :sid ORDER BY admission_chance DESC"
    ), {"sid": session_id}).fetchall()

    sop = db.execute(text(
        "SELECT * FROM sop_drafts WHERE session_id = :sid ORDER BY created_at DESC LIMIT 1"
    ), {"sid": session_id}).fetchone()

    logs = db.execute(text(
        "SELECT agent_name, status, duration_ms FROM agent_logs WHERE session_id = :sid ORDER BY logged_at"
    ), {"sid": session_id}).fetchall()

    if not rows:
        return {"error": "Session not found"}

    return {
        "session": {
            "student_goal": rows.student_goal,
            "target_degree": rows.target_degree,
            "target_field": rows.target_field,
            "status": rows.status,
            "created_at": rows.created_at.isoformat() if rows.created_at else None
        },
        "profile": {
            "strengths": rows.strengths or [],
            "weak_areas": rows.weak_areas or [],
            "summary": rows.profile_summary,
            "readiness_score": rows.readiness_score
        },
        "skill_gap": {
            "current_skills": rows.current_skills or [],
            "required_skills": rows.required_skills or [],
            "missing_skills": rows.missing_skills or [],
            "recommended_courses": rows.recommended_courses or [],
            "gap_score": rows.gap_score,
            "timeline_weeks": rows.timeline_weeks
        },
        "universities": [
            {
                "name": u.university_name, "country": u.country, "program": u.program,
                "ranking": u.ranking, "tuition_usd": u.tuition_usd,
                "admission_chance": u.admission_chance, "category": u.category,
                "deadline": u.application_deadline, "requirements": u.requirements
            } for u in universities
        ],
        "sop": {
            "university": sop.university_name if sop else None,
            "content": sop.sop_content if sop else None,
            "word_count": sop.word_count if sop else 0,
            "review_score": sop.review_score if sop else None,
            "strengths": sop.strengths if sop else None,
            "improvements": sop.improvements if sop else None,
            "feedback": sop.review_feedback if sop else None
        },
        "interview_prep": {
            "questions": rows.questions or [],
            "tips": rows.tips or [],
            "focus_areas": rows.focus_areas or []
        },
        "timeline": {
            "deadlines": rows.deadlines or [],
            "document_checklist": rows.document_checklist or []
        },
        "agent_logs": [{"agent": l.agent_name, "status": l.status, "ms": l.duration_ms} for l in logs]
    }

@router.get("/sessions")
def get_sessions(db: Session = Depends(get_db), token=Depends(verify_token)):
    user_id = token["sub"]
    sessions = db.query(CounselingSession).filter(
        CounselingSession.user_id == uuid.UUID(user_id)
    ).order_by(CounselingSession.created_at.desc()).all()
    return [
        {
            "id": str(s.id),
            "student_goal": s.student_goal[:80] + "..." if len(s.student_goal) > 80 else s.student_goal,
            "target_field": s.target_field,
            "target_degree": s.target_degree,
            "status": s.status,
            "created_at": s.created_at.isoformat() if s.created_at else None
        }
        for s in sessions
    ]
