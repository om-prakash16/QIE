from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from modules.auth.service import get_current_user
from core.supabase import get_supabase
from modules.ai.services.evaluation_service import EvaluationService as AIService
from pydantic import BaseModel

router = APIRouter()
ai_service = AIService()

class ProfileAnalysisRequest(BaseModel):
    profile_data: Dict[str, Any]

class SkillRecommendationResponse(BaseModel):
    recommended_skills: List[str]
    reasoning: str

# AI Reasoning Engine

@router.post("/analyze-profile")
async def analyze_profile_insights(req: ProfileAnalysisRequest, current_user = Depends(get_current_user)):
    """
    resume and profile analysis via Gemini 1.5.
    """
    return await ai_service.analyze_resume(req.profile_data)

@router.get("/scores")
async def get_proof_scores(user_id: Optional[str] = None, current_user = Depends(get_current_user)):
    """
    Fetch current Proof Score and competency metrics.
    """
    target_id = user_id or current_user["id"]
    return await ai_service.get_user_scores(target_id)

@router.post("/recommend-skills", response_model=SkillRecommendationResponse)
async def recommend_skills(current_user = Depends(get_current_user)):
    """
    AI-driven skill gap analysis and growth suggestions.
    """
    return await ai_service.generate_skill_suggestions(current_user["id"])

# Assessment & Quizzes

@router.get("/quizzes")
async def get_assessment_quizzes(skill_id: Optional[str] = None):
    """
    Fetch AI-generated competency assessment quizzes.
    """
    return await ai_service.get_available_quizzes(skill_id)

@router.post("/quizzes/submit")
async def submit_quiz_result(quiz_id: str, results: Dict[str, Any], current_user = Depends(get_current_user)):
    """
    Submit quiz results and trigger score updates.
    """
    return await ai_service.evaluate_quiz(current_user["id"], quiz_id, results)
