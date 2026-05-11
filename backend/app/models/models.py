from sqlalchemy import Column, String, Text, Integer, DateTime, Numeric, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.sql import func
from app.database import Base
import uuid

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class CounselingSession(Base):
    __tablename__ = "counseling_sessions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    student_goal = Column(Text, nullable=False)
    target_degree = Column(String(50))
    target_field = Column(String(100))
    target_country = Column(String(100))
    budget_usd = Column(Integer)
    gpa = Column(Numeric(3, 2))
    english_test = Column(String(20))
    english_score = Column(Numeric(4, 2))
    work_experience = Column(Integer, default=0)
    skills = Column(ARRAY(Text))
    status = Column(String(30), default="processing")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))

class StudentProfile(Base):
    __tablename__ = "student_profiles"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("counseling_sessions.id", ondelete="CASCADE"))
    strengths = Column(ARRAY(Text))
    weak_areas = Column(ARRAY(Text))
    profile_summary = Column(Text)
    readiness_score = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SkillGapAnalysis(Base):
    __tablename__ = "skill_gap_analysis"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("counseling_sessions.id", ondelete="CASCADE"))
    current_skills = Column(ARRAY(Text))
    required_skills = Column(ARRAY(Text))
    missing_skills = Column(ARRAY(Text))
    recommended_courses = Column(JSONB)
    gap_score = Column(Integer)
    timeline_weeks = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class UniversityMatch(Base):
    __tablename__ = "university_matches"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("counseling_sessions.id", ondelete="CASCADE"))
    university_name = Column(String(200))
    country = Column(String(100))
    program = Column(String(200))
    ranking = Column(Integer)
    tuition_usd = Column(Integer)
    admission_chance = Column(Integer)
    category = Column(String(20))
    application_deadline = Column(String(100))
    requirements = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SOPDraft(Base):
    __tablename__ = "sop_drafts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("counseling_sessions.id", ondelete="CASCADE"))
    university_name = Column(String(200))
    sop_content = Column(Text)
    word_count = Column(Integer)
    version = Column(Integer, default=1)
    review_feedback = Column(Text)
    review_score = Column(Integer)
    strengths = Column(Text)
    improvements = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class InterviewPrep(Base):
    __tablename__ = "interview_prep"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("counseling_sessions.id", ondelete="CASCADE"))
    questions = Column(JSONB)
    tips = Column(ARRAY(Text))
    focus_areas = Column(ARRAY(Text))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ApplicationTimeline(Base):
    __tablename__ = "application_timelines"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("counseling_sessions.id", ondelete="CASCADE"))
    deadlines = Column(JSONB)
    document_checklist = Column(JSONB)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AgentLog(Base):
    __tablename__ = "agent_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("counseling_sessions.id", ondelete="CASCADE"))
    agent_name = Column(String(100))
    status = Column(String(20), default="running")
    input_summary = Column(Text)
    output_summary = Column(Text)
    duration_ms = Column(Integer)
    logged_at = Column(DateTime(timezone=True), server_default=func.now())
