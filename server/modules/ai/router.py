from fastapi import APIRouter, Depends
from typing import List, Dict, Any, Optional
from modules.auth.service import get_current_user
from modules.ai.services.evaluation_service import EvaluationService as AIService
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
from pydantic import BaseModel

router = APIRouter()
ai_service = AIService()

# Include sub-routers (no extra prefix to match frontend api-client)
router.include_router(quiz_router, tags=["Quiz"])
router.include_router(interview_router, tags=["Interview Prep"])
router.include_router(
    portfolio_router, prefix="/portfolio", tags=["Portfolio Auto-Builder"]
)
router.include_router(salary_router, prefix="/salary", tags=["Salary Prediction AI"])
router.include_router(fraud_router, prefix="/fraud", tags=["AI Fraud Detection"])
router.include_router(
    soft_skills_router, prefix="/soft-skills", tags=["Soft Skill Verification"]
)
router.include_router(
    skill_graph_router, prefix="/skill-graph", tags=["Skill Graph Intelligence"]
)
router.include_router(
    recruiter_dashboard_router,
    prefix="/recruiter",
    tags=["Recruiter Intelligence Dashboard"],
)
router.include_router(
    external_platform_router,
    prefix="/platforms",
    tags=["External Platform Integration"],
)
router.include_router(
    feedback_loop_router, prefix="/feedback", tags=["Hiring Feedback Loop"]
)
router.include_router(
    simulation_router, prefix="/simulation", tags=["Real Work Simulation Engine"]
)
router.include_router(
    job_optimizer_router, prefix="/job-optimizer", tags=["AI Job Description Optimizer"]
)
router.include_router(
    team_analyzer_router, prefix="/team-analyzer", tags=["Team Skill Balance Analyzer"]
)
router.include_router(
    career_risk_router, prefix="/career-risk", tags=["AI Career Risk Predictor"]
)
router.include_router(
    pitch_router, prefix="/pitch", tags=["AI Pitch Deck Engine"]
)


class ProfileAnalysisRequest(BaseModel):
    profile_data: Dict[str, Any]


class SkillRecommendationResponse(BaseModel):
    recommended_skills: List[str]
    reasoning: str


# AI Reasoning Engine


@router.post("/analyze-profile")
async def analyze_profile_insights(
    req: ProfileAnalysisRequest, current_user=Depends(get_current_user)
):
    """
    Resume and profile analysis via Gemini 1.5.
    """
    return await ai_service.analyze_resume(req.profile_data)


from fastapi import UploadFile, File, HTTPException
import io
import PyPDF2

@router.post("/analyze-resume")
async def analyze_resume_endpoint(
    file: UploadFile = File(...)
):
    """
    Endpoint for the Landing Page /verify UI to parse uploaded PDFs.
    """
    try:
        content = await file.read()
        reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = ""
        for page in reader.pages:
            if page.extract_text():
                text += page.extract_text() + "\n"
                
        from modules.ai.services.resume_service import ResumeService
        resume_service = ResumeService()
        
        # User ID fallback for public demo or disconnected wallet scenarios
        user_id = "anonymous"
        
        result = await resume_service.analyze_resume(user_id=user_id, resume_text=text)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
            
        frontend_data = {
            "skills": result.get("extracted_skills", []),
            "soft_skills": result.get("soft_skills", []),
            "experience_years": result.get("experience_years", 0),
            "roles": [result.get("primary_role", "Developer")],
            "education": result.get("education", []),
            "forensic_confidence": result.get("forensic_confidence", 85)
        }
        
        return {"status": "success", "parsed_data": frontend_data}
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))



async def extract_text_from_pdf(file: UploadFile) -> str:
    content = await file.read()
    reader = PyPDF2.PdfReader(io.BytesIO(content))
    text = ""
    for page in reader.pages:
        if page.extract_text():
            text += page.extract_text() + "\n"
    return text

@router.post("/compare-jd-cv")
async def analyze_jd_cv_endpoint(
    resume: UploadFile = File(...),
    jd: UploadFile = File(...)
):
    """
    Endpoint to compare a Resume against a Job Description.
    """
    try:
        resume_text = await extract_text_from_pdf(resume)
        jd_text = await extract_text_from_pdf(jd)
        
        from modules.ai.services.resume_service import ResumeService
        resume_service = ResumeService()
        
        result = await resume_service.compare_jd_cv(jd_text=jd_text, resume_text=resume_text)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
            
        return {"status": "success", "match_result": result}
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/match-jd-candidates")
async def match_jd_candidates_endpoint(
    jd: UploadFile = File(...)
):
    """
    Upload a JD and get a list of best matching candidates from the network.
    """
    try:
        jd_text = await extract_text_from_pdf(jd)
        
        from modules.ai.services.resume_service import ResumeService
        resume_service = ResumeService()
        
        matches = await resume_service.match_candidates_to_jd(jd_text=jd_text)
        
        return {"status": "success", "matches": matches}
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/scores")

async def get_proof_scores(
    user_id: Optional[str] = None, current_user=Depends(get_current_user)
):
    """
    Fetch current Proof Score and competency metrics.
    """
    target_id = user_id or current_user.get("sub")
    return await ai_service.get_user_scores(target_id)


@router.get("/verification-stream-demo")
async def verification_stream_demo():
    """
    Streams demo log output for the Landing Page Terminal UI.
    """
    return [
        "> SYSTEM REBOOT INITIATED...",
        "> LOAD BALANCING SERVERS...",
        "> AI MODEL: GEMINI 1.5 PRO CONNECTED",
        "> SYNCHRONIZING WITH SOLANA MAINNET BETA...",
        "> ======================================",
        "> INCOMING CONNECTION: 0x8a92...f2e5",
        "> PARSING RUST COMPETENCY PROFILE...",
        "> CROSS_REFERENCING GITHUB AST LOGS...",
        "> EXECUTING STATIC ANALYSIS ON PORTFOLIO...",
        "> AI CONFIDENCE: 98.4%",
        "> [SUCCESS] VERIFICATION MINTED TO CHAIN",
    ]


@router.post("/recommend-skills", response_model=SkillRecommendationResponse)
async def recommend_skills(current_user=Depends(get_current_user)):
    """
    AI-driven skill gap analysis and growth suggestions.
    """
    return await ai_service.generate_skill_suggestions(current_user.get("sub"))


# Assessment & Quizzes


@router.get("/quizzes")
async def get_assessment_quizzes(skill_id: Optional[str] = None):
    """
    Fetch AI-generated competency assessment quizzes.
    """
    return await ai_service.get_available_quizzes(skill_id)


@router.post("/calculate-score")
async def trigger_score_calculation(current_user=Depends(get_current_user)):
    """
    Trigger real-time Proof Score calculation based on latest profile data.
    """
    from modules.ai.proof_service import ProofScoreService
    return await ProofScoreService.calculate_proof_score(current_user["id"])
