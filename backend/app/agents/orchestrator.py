"""
AI Student Counseling Assistant - 8 Agent Orchestrator
Contributed Module: EduPath University Management Platform
"""
import json, time, uuid, traceback
from groq import Groq
from app.config import settings
from app.database import SessionLocal
from app.models.models import (
    CounselingSession, StudentProfile, SkillGapAnalysis,
    UniversityMatch, SOPDraft, InterviewPrep, ApplicationTimeline, AgentLog
)
from datetime import datetime

print(f"[INIT] Groq key present: {bool(settings.groq_api_key)}")
print(f"[INIT] Model: {settings.groq_model}")

try:
    client = Groq(api_key=settings.groq_api_key)
    print("[INIT] Groq client initialized OK")
except Exception as e:
    print(f"[ERROR] Groq client failed: {e}")
    client = None

def call_groq(system: str, user: str) -> dict:
    if not client:
        raise Exception("Groq client not initialized - check GROQ_API_KEY in .env")
    resp = client.chat.completions.create(
        model=settings.groq_model,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user}
        ],
        max_tokens=2000,
        response_format={"type": "json_object"}
    )
    return json.loads(resp.choices[0].message.content)

def log_agent(db, session_id, name, status, inp, out, ms):
    try:
        db.add(AgentLog(
            session_id=uuid.UUID(session_id),
            agent_name=name, status=status,
            input_summary=str(inp)[:300],
            output_summary=str(out)[:300],
            duration_ms=ms
        ))
        db.commit()
        print(f"[LOG] {name} -> {status} ({ms}ms)")
    except Exception as e:
        print(f"[LOG ERR] {e}")

# Agent 1
def profiler_agent(sd):
    print("[A1] ProfilerAgent running...")
    t = time.time()
    r = call_groq(
        'You are a student profiler. Return ONLY valid JSON with these exact keys: {"strengths":["s1","s2","s3"],"weak_areas":["w1","w2"],"profile_summary":"2-3 sentence summary about the student","readiness_score":70,"recommended_action":"key recommendation"}',
        f"Analyze this student: {json.dumps(sd)}"
    )
    print(f"[A1] Done. readiness_score={r.get('readiness_score')}")
    return {"agent": "ProfilerAgent", "duration": int((time.time()-t)*1000), "data": r}

# Agent 2
def skill_gap_agent(sd, pd):
    print("[A2] SkillGapAgent running...")
    t = time.time()
    r = call_groq(
        'You are a skill gap analyzer. Return ONLY valid JSON: {"current_skills":["skill1","skill2"],"required_skills":["req1","req2","req3","req4","req5"],"missing_skills":["missing1","missing2"],"recommended_courses":[{"course":"Course Name","platform":"Coursera","duration":"4 weeks","priority":"high"}],"gap_score":65,"timeline_weeks":12,"gap_summary":"brief summary"}',
        f"Student: {json.dumps(sd)}\nProfile: {json.dumps(pd)}"
    )
    print(f"[A2] Done. gap_score={r.get('gap_score')}")
    return {"agent": "SkillGapAgent", "duration": int((time.time()-t)*1000), "data": r}

# Agent 3
def university_agent(sd, pd, sgd):
    print("[A3] UniversityAgent running...")
    t = time.time()
    r = call_groq(
        'You are a university admissions expert. Return ONLY valid JSON with exactly 6 universities (2 safe 70-90%, 2 target 40-70%, 2 reach 15-40%): {"universities":[{"name":"University Name","country":"USA","program":"MS Computer Science","ranking":50,"tuition_usd":35000,"admission_chance":75,"category":"safe","deadline":"January 15 2026","requirements":"GPA 3.0, IELTS 6.5","why_good_fit":"Strong AI program matching student goals"}],"recommendation_summary":"overall advice"}',
        f"Student: {json.dumps(sd)}"
    )
    unis = r.get("universities", [])
    print(f"[A3] Done. {len(unis)} universities found")
    return {"agent": "UniversityAgent", "duration": int((time.time()-t)*1000), "data": r}

# Agent 4
def sop_writer_agent(sd, pd, top_uni):
    print("[A4] SOPWriterAgent running...")
    t = time.time()
    r = call_groq(
        'You are an expert SOP writer. Write a complete personalized Statement of Purpose. Return ONLY valid JSON: {"sop_content":"Write a full 600 word SOP here. Include: hook introduction, academic background, relevant projects with specific details, why this specific university and program, career goals, strong conclusion. Make it personal and specific.","word_count":600,"key_themes":["theme1","theme2","theme3"],"personalization_elements":["element1","element2"]}',
        f"Student: {json.dumps(sd)}\nTarget University: {json.dumps(top_uni)}"
    )
    print(f"[A4] Done. word_count={r.get('word_count')}")
    return {"agent": "SOPWriterAgent", "duration": int((time.time()-t)*1000), "data": r}

# Agent 5
def sop_reviewer_agent(sop_content, university, student_goal):
    print("[A5] SOPReviewerAgent running...")
    t = time.time()
    r = call_groq(
        'You are a strict SOP reviewer. Return ONLY valid JSON: {"review_score":78,"strengths":"2-3 sentences about what works well in this SOP","improvements":"2-3 sentences about what needs to be improved","review_feedback":"Detailed paragraph with specific line-by-line feedback","revised_intro":"Write a stronger opening paragraph here","missing_elements":["missing element 1","missing element 2"],"overall_verdict":"good"}',
        f"Review this SOP for {university}:\n{sop_content[:1500]}"
    )
    print(f"[A5] Done. review_score={r.get('review_score')}")
    return {"agent": "SOPReviewerAgent", "duration": int((time.time()-t)*1000), "data": r}

# Agent 6
def interview_coach_agent(sd, pd, unis):
    print("[A6] InterviewCoachAgent running...")
    t = time.time()
    r = call_groq(
        'You are an interview coach. Return ONLY valid JSON: {"questions":[{"question":"Why do you want to pursue this specific program?","type":"motivational","tip":"Connect to your personal journey and specific career goals"},{"question":"Describe a challenging project you worked on","type":"behavioral","tip":"Use STAR method with specific metrics"}],"tips":["tip1","tip2","tip3","tip4","tip5"],"focus_areas":["area1","area2","area3"],"opening_statement":"A 3-sentence strong self-introduction script","common_mistakes":["mistake1","mistake2","mistake3"]}. Generate exactly 6 questions.',
        f"Student: {json.dumps(sd)}\nProfile strengths: {pd.get('strengths', [])}\nWeak areas: {pd.get('weak_areas', [])}"
    )
    print(f"[A6] Done. {len(r.get('questions', []))} questions")
    return {"agent": "InterviewCoachAgent", "duration": int((time.time()-t)*1000), "data": r}

# Agent 7
def tracker_agent(sd, unis):
    print("[A7] TrackerAgent running...")
    t = time.time()
    r = call_groq(
        'You are an application tracker. Return ONLY valid JSON: {"deadlines":[{"university":"University Name","deadline":"December 15 2025","type":"regular","days_left":90}],"document_checklist":[{"document":"Statement of Purpose","status":"pending","notes":"Customize for each university"},{"document":"3 Letters of Recommendation","status":"pending","notes":"Ask professors early"},{"document":"Official Transcripts","status":"pending","notes":"Request 4 weeks in advance"},{"document":"English Test Score","status":"pending","notes":"IELTS/TOEFL report"},{"document":"Updated Resume/CV","status":"pending","notes":"Highlight research and projects"},{"document":"GRE Score","status":"pending","notes":"Optional but recommended"}],"monthly_plan":[{"month":"Month 1","tasks":["task1","task2"]},{"month":"Month 2","tasks":["task1","task2"]}],"urgent_actions":["action1","action2","action3"]}',
        f"Student target: {sd.get('student_goal')}\nUniversities: {json.dumps([u.get('name') for u in unis[:4]])}"
    )
    print(f"[A7] Done.")
    return {"agent": "TrackerAgent", "duration": int((time.time()-t)*1000), "data": r}

# Agent 8
def orchestrator_compile(sd, results):
    print("[A8] OrchestratorAgent compiling final report...")
    t = time.time()
    readiness = results.get("profiler", {}).get("data", {}).get("readiness_score", 70)
    gap = results.get("skill_gap", {}).get("data", {}).get("gap_score", 60)
    unis_count = len(results.get("universities", {}).get("data", {}).get("universities", []))
    r = call_groq(
        'You are the master AI orchestrator. Return ONLY valid JSON: {"executive_summary":"Write 3-4 sentences summarizing overall student assessment and chances","admission_readiness":"ready","top_recommendation":"The single most important piece of advice for this student","success_probability":72,"key_action_items":["action1","action2","action3","action4","action5"],"encouragement":"Write a warm personalized motivational message for this student"}',
        f"Student goal: {sd.get('student_goal')}\nReadiness score: {readiness}\nSkill gap: {gap}\nUniversities matched: {unis_count}"
    )
    print(f"[A8] Done. success_probability={r.get('success_probability')}")
    return {"agent": "OrchestratorAgent", "duration": int((time.time()-t)*1000), "data": r}

# Main Pipeline
def run_counseling_pipeline(session_id: str) -> dict:
    print(f"\n{'='*60}")
    print(f"[PIPELINE] Starting session: {session_id}")
    print(f"{'='*60}")
    db = SessionLocal()
    results = {}
    try:
        session = db.query(CounselingSession).filter(
            CounselingSession.id == uuid.UUID(session_id)
        ).first()
        if not session:
            return {"error": "Session not found"}

        sd = {
            "student_goal": session.student_goal,
            "target_degree": session.target_degree,
            "target_field": session.target_field,
            "target_country": session.target_country,
            "budget_usd": session.budget_usd,
            "gpa": float(session.gpa) if session.gpa else None,
            "english_test": session.english_test,
            "english_score": float(session.english_score) if session.english_score else None,
            "work_experience": session.work_experience,
            "skills": session.skills or []
        }
        print(f"[PIPELINE] Goal: {session.student_goal[:80]}...")

        # Run all 8 agents
        r1 = profiler_agent(sd)
        results["profiler"] = r1
        pd = r1["data"]
        db.add(StudentProfile(
            session_id=uuid.UUID(session_id),
            strengths=pd.get("strengths", []),
            weak_areas=pd.get("weak_areas", []),
            profile_summary=pd.get("profile_summary"),
            readiness_score=pd.get("readiness_score", 50)
        ))
        db.flush()
        log_agent(db, session_id, "ProfilerAgent", "completed", "", str(pd)[:200], r1["duration"])

        r2 = skill_gap_agent(sd, pd)
        results["skill_gap"] = r2
        sgd = r2["data"]
        db.add(SkillGapAnalysis(
            session_id=uuid.UUID(session_id),
            current_skills=sgd.get("current_skills", []),
            required_skills=sgd.get("required_skills", []),
            missing_skills=sgd.get("missing_skills", []),
            recommended_courses=sgd.get("recommended_courses", []),
            gap_score=sgd.get("gap_score", 50),
            timeline_weeks=sgd.get("timeline_weeks", 12)
        ))
        db.flush()
        log_agent(db, session_id, "SkillGapAgent", "completed", "", str(sgd)[:200], r2["duration"])

        r3 = university_agent(sd, pd, sgd)
        results["universities"] = r3
        unis = r3["data"].get("universities", [])
        for u in unis:
            db.add(UniversityMatch(
                session_id=uuid.UUID(session_id),
                university_name=u.get("name"),
                country=u.get("country"),
                program=u.get("program"),
                ranking=u.get("ranking"),
                tuition_usd=u.get("tuition_usd"),
                admission_chance=u.get("admission_chance"),
                category=u.get("category"),
                application_deadline=u.get("deadline"),
                requirements=u.get("requirements")
            ))
        db.flush()
        log_agent(db, session_id, "UniversityAgent", "completed", "", f"{len(unis)} unis", r3["duration"])

        top_uni = unis[0] if unis else {}
        r4 = sop_writer_agent(sd, pd, top_uni)
        results["sop"] = r4
        sopd = r4["data"]

        r5 = sop_reviewer_agent(
            sopd.get("sop_content", ""),
            top_uni.get("name", ""),
            sd.get("student_goal", "")
        )
        results["sop_review"] = r5
        revd = r5["data"]
        db.add(SOPDraft(
            session_id=uuid.UUID(session_id),
            university_name=top_uni.get("name"),
            sop_content=sopd.get("sop_content"),
            word_count=sopd.get("word_count", 0),
            review_feedback=revd.get("review_feedback"),
            review_score=revd.get("review_score", 70),
            strengths=revd.get("strengths"),
            improvements=revd.get("improvements")
        ))
        db.flush()
        log_agent(db, session_id, "SOPWriterAgent", "completed", "", f"{sopd.get('word_count')} words", r4["duration"])
        log_agent(db, session_id, "SOPReviewerAgent", "completed", "", f"Score:{revd.get('review_score')}", r5["duration"])

        r6 = interview_coach_agent(sd, pd, unis)
        results["interview"] = r6
        intd = r6["data"]
        db.add(InterviewPrep(
            session_id=uuid.UUID(session_id),
            questions=intd.get("questions", []),
            tips=intd.get("tips", []),
            focus_areas=intd.get("focus_areas", [])
        ))
        db.flush()
        log_agent(db, session_id, "InterviewCoachAgent", "completed", "", f"{len(intd.get('questions',[]))} Qs", r6["duration"])

        r7 = tracker_agent(sd, unis)
        results["tracker"] = r7
        trd = r7["data"]
        db.add(ApplicationTimeline(
            session_id=uuid.UUID(session_id),
            deadlines=trd.get("deadlines", []),
            document_checklist=trd.get("document_checklist", [])
        ))
        db.flush()
        log_agent(db, session_id, "TrackerAgent", "completed", "", "Timeline built", r7["duration"])

        r8 = orchestrator_compile(sd, results)
        results["orchestrator"] = r8
        log_agent(db, session_id, "OrchestratorAgent", "completed", "", str(r8["data"])[:200], r8["duration"])

        session.status = "completed"
        session.completed_at = datetime.utcnow()
        db.commit()
        print(f"[PIPELINE] SUCCESS! Session {session_id} completed.")
        return {"session_id": session_id, "status": "completed"}

    except Exception as e:
        error_detail = traceback.format_exc()
        print(f"[PIPELINE ERROR]\n{error_detail}")
        try:
            s = db.query(CounselingSession).filter(
                CounselingSession.id == uuid.UUID(session_id)
            ).first()
            if s:
                s.status = "failed"
                db.commit()
        except:
            pass
        return {"error": str(e), "session_id": session_id}
    finally:
        db.close()
