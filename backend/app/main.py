# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from app.config import settings
# from app.database import Base, engine
# from app.api import auth, counseling

# Base.metadata.create_all(bind=engine)

# app = FastAPI(
#     title="AI Student Counseling Assistant",
#     description="Multi-Agent GenAI module for EduPath University Management Platform",
#     version="1.0.0"
# )

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[settings.frontend_url, "http://localhost:5173"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
# app.include_router(counseling.router, prefix="/api/counseling", tags=["counseling"])

# @app.get("/")
# def root():
#     return {
#         "module": "AI Student Counseling Assistant",
#         "platform": "EduPath University Management Platform",
#         "agents": ["OrchestratorAgent", "ProfilerAgent", "SkillGapAgent", "UniversityAgent", "SOPWriterAgent", "SOPReviewerAgent", "InterviewCoachAgent", "TrackerAgent"],
#         "status": "running"
#     }


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.api import auth, counseling

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Student Counseling Assistant",
    description="Multi-Agent GenAI module for EduPath University Management Platform",
    version="1.0.0"
)

# ── CORS — must be before all routes ─────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(counseling.router, prefix="/api/counseling", tags=["counseling"])

@app.get("/")
def root():
    return {
        "module": "AI Student Counseling Assistant",
        "platform": "EduPath University Management Platform",
        "status": "running",
        "agents": 8
    }

@app.options("/{rest_of_path:path}")
async def preflight_handler():
    return {"status": "ok"}