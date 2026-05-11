CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE counseling_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    student_goal TEXT NOT NULL,
    target_degree VARCHAR(50),
    target_field VARCHAR(100),
    target_country VARCHAR(100),
    budget_usd INT,
    gpa DECIMAL(3,2),
    english_test VARCHAR(20),
    english_score DECIMAL(4,2),
    work_experience INT DEFAULT 0,
    skills TEXT[],
    status VARCHAR(30) DEFAULT 'processing',
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE TABLE student_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES counseling_sessions(id) ON DELETE CASCADE,
    strengths TEXT[],
    weak_areas TEXT[],
    profile_summary TEXT,
    readiness_score INT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE skill_gap_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES counseling_sessions(id) ON DELETE CASCADE,
    current_skills TEXT[],
    required_skills TEXT[],
    missing_skills TEXT[],
    recommended_courses JSONB,
    gap_score INT,
    timeline_weeks INT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE university_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES counseling_sessions(id) ON DELETE CASCADE,
    university_name VARCHAR(200),
    country VARCHAR(100),
    program VARCHAR(200),
    ranking INT,
    tuition_usd INT,
    admission_chance INT,
    category VARCHAR(20),
    application_deadline VARCHAR(100),
    requirements TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sop_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES counseling_sessions(id) ON DELETE CASCADE,
    university_name VARCHAR(200),
    sop_content TEXT,
    word_count INT,
    version INT DEFAULT 1,
    review_feedback TEXT,
    review_score INT,
    strengths TEXT,
    improvements TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE interview_prep (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES counseling_sessions(id) ON DELETE CASCADE,
    questions JSONB,
    tips TEXT[],
    focus_areas TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE application_timelines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES counseling_sessions(id) ON DELETE CASCADE,
    deadlines JSONB,
    document_checklist JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE agent_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES counseling_sessions(id) ON DELETE CASCADE,
    agent_name VARCHAR(100),
    status VARCHAR(20) DEFAULT 'running',
    input_summary TEXT,
    output_summary TEXT,
    duration_ms INT,
    logged_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON counseling_sessions(user_id);
CREATE INDEX idx_agent_logs_session ON agent_logs(session_id);
CREATE INDEX idx_uni_matches_session ON university_matches(session_id);
CREATE INDEX idx_sop_session ON sop_drafts(session_id);
