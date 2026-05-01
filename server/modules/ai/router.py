from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from typing import List, Dict, Any, Optional
import io
import PyPDF2

from core.response import success_response
from core.dependencies import get_db, get_current_user_id, get_validated_wallet
from modules.ai.services.resume_service import resume_service
from modules.ai.services.reputation_service import reputation_service

# Import sub-routers
from modules.ai.quiz_router import router as quiz_router
from modules.ai.interview_router import router as interview_router
from modules.ai.portfolio_router import router as portfolio_router
from modules.ai.salary_router import router as salary_router
from modules.ai.fraud_router import router as fraud_router
from modules.ai.soft_skills_router import router as soft_skills_router
from modules.ai.skill_graph_router import router as skill_graph_router
from modules.ai.recruiter_dashboard_router import router as recruiter_dashboard_router
from modules.ai.external_platform_router import router as external_platform_router
from modules.ai.feedback_loop_router import router as feedback_loop_router
from modules.ai.simulation_router import router as simulation_router
from modules.ai.job_optimizer_router import router as job_optimizer_router
from modules.ai.team_analyzer_router import router as team_analyzer_router
from modules.ai.career_risk_router import router as career_risk_router
from modules.ai.pitch_router import router as pitch_router
from modules.ai.scoring_router import router as scoring_router

router = APIRouter()

# Include sub-routers
router.include_router(scoring_router, tags=["Scoring"])
router.include_router(quiz_router, tags=["Quiz"])
router.include_router(interview_router, tags=["Interview"])
router.include_router(portfolio_router, prefix="/portfolio", tags=["Portfolio"])
router.include_router(salary_router, prefix="/salary", tags=["Salary"])
router.include_router(fraud_router, prefix="/fraud", tags=["Fraud"])
router.include_router(soft_skills_router, prefix="/soft-skills", tags=["Soft Skills"])
router.include_router(skill_graph_router, prefix="/skill-graph", tags=["Skill Graph"])
router.include_router(recruiter_dashboard_router, prefix="/recruiter", tags=["Recruiter"])
router.include_router(external_platform_router, prefix="/platforms", tags=["Platforms"])
router.include_router(feedback_loop_router, prefix="/feedback", tags=["Feedback"])
router.include_router(simulation_router, prefix="/simulation", tags=["Simulation"])
router.include_router(job_optimizer_router, prefix="/job-optimizer", tags=["Job Optimizer"])
router.include_router(team_analyzer_router, prefix="/team-analyzer", tags=["Team Analyzer"])
router.include_router(career_risk_router, prefix="/career-risk", tags=["Career Risk"])
router.include_router(pitch_router, prefix="/pitch", tags=["Pitch"])

async def extract_text_from_file(file: UploadFile) -> str:
    content = await file.read()
    filename = file.filename.lower() if file.filename else ""
    if filename.endswith(".pdf"):
        reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = ""
        for page in reader.pages:
            if page.extract_text(): text += page.extract_text() + "\n"
        return text
    return content.decode("utf-8", errors="ignore")

@router.post("/analyze-resume")
async def analyze_resume_endpoint(
    file: UploadFile = File(...)
):
    """Parse uploaded resume and extract skills/experience."""
    text = await extract_text_from_file(file)
    result = await resume_service.analyze_resume(user_id="anonymous", resume_text=text)
    
    frontend_data = {
        "skills": result.get("extracted_skills", []),
        "soft_skills": result.get("soft_skills", []),
        "experience_years": result.get("experience_years", 0),
        "roles": [result.get("primary_role", "Developer")],
        "education": result.get("education", []),
        "confidence": result.get("forensic_confidence", 85)
    }
    return success_response(data=frontend_data)

@router.post("/compare-jd-cv")
async def analyze_jd_cv_endpoint(
    resume: UploadFile = File(...),
    jd: Optional[UploadFile] = File(None),
    jd_text_input: Optional[str] = Form(None)
):
    """Match resume against job description."""
    resume_text = await extract_text_from_file(resume)
    jd_text = await extract_text_from_file(jd) if jd else jd_text_input
    
    if not jd_text:
        raise HTTPException(status_code=400, detail="Missing Job Description")
        
    result = await resume_service.compare_jd_cv(jd_text=jd_text, resume_text=resume_text)
    return success_response(data=result)

@router.post("/match-jd-candidates")
async def match_jd_candidates_endpoint(
    jd: UploadFile = File(...)
):
    """Find best candidates for a given JD."""
    jd_text = await extract_text_from_file(jd)
    matches = await resume_service.match_candidates_to_jd(jd_text=jd_text)
    return success_response(data=matches)

@router.post("/calculate-score")
async def trigger_score_calculation(
    wallet: str = Depends(get_validated_wallet)
):
    """Recalculate reputation score for the authenticated wallet."""
    score = await reputation_service.calculate_and_store_score(wallet)
    return success_response(data=score)

@router.get("/status-stream")
async def status_stream_demo():
    """Mock stream for terminal UI."""
    return success_response(data=[
        "> SYSTEM ONLINE",
        "> CONNECTED TO SOLANA",
        "> AI CORE READY"
    ])
