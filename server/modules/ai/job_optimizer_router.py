"""
AI Job Description Optimizer Router.
Endpoints for analyzing and optimizing job listings.
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from modules.auth.service import get_current_user
from modules.ai.services.job_optimizer_service import JobOptimizerService

router = APIRouter()
optimizer_service = JobOptimizerService()


class JDAnalysisRequest(BaseModel):
    title: str
    description: str
    skills: List[str]


class JDAnalysisResponse(BaseModel):
    overall_score: int
    clarity: Dict[str, Any]
    skills_analysis: Dict[str, Any]
    experience_normalization: Dict[str, Any]
    salary_benchmark: Dict[str, Any]
    recommendations: List[str]


@router.post("/optimize", response_model=JDAnalysisResponse)
async def optimize_job_description(
    req: JDAnalysisRequest,
    current_user=Depends(get_current_user)
):
    """
    AI Job Description Optimizer.
    Parses a JD and returns an optimization score with suggestions for 
    missing skills, market alignment, and clarity.
    """
    try:
        analysis = optimizer_service.analyze_job_description(
            title=req.title,
            description=req.description,
            skills=req.skills
        )
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/benchmarks")
async def get_market_benchmarks(
    title: str,
    skills: str, # Comma separated
    current_user=Depends(get_current_user)
):
    """Get standalone market salary and rarity data for a role."""
    skill_list = [s.strip() for s in skills.split(",")]
    salary = optimizer_service._get_salary_benchmark(title, skill_list)
    rarity = optimizer_service._calculate_skill_rarity(skill_list)
    
    return {
        "status": "success",
        "job_title": title,
        "salary_benchmark": salary,
        "market_rarity": rarity
    }
