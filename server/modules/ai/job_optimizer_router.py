from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any

from core.response import success_response
from core.dependencies import get_db, get_current_user_id
from modules.ai.services.job_optimizer_service import job_optimizer_service

router = APIRouter()

class JDAnalysisRequest(BaseModel):
    title: str
    description: str
    skills: List[str]

@router.post("/optimize")
async def optimize_job_description(
    req: JDAnalysisRequest,
    user_id: str = Depends(get_current_user_id)
):
    """
    AI Job Description Optimizer.
    Parses a JD and returns an optimization score with suggestions.
    """
    try:
        analysis = await job_optimizer_service.analyze_job_description(
            title=req.title, description=req.description, skills=req.skills
        )
        return success_response(data=analysis)
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"JD Optimization failed: {e}")
        return success_response(data={"error": "Optimization engine degraded"}, status_code=500)

@router.get("/benchmarks")
async def get_market_benchmarks(
    title: str,
    skills: str
):
    """Get standalone market salary and rarity data for a role."""
    skill_list = [s.strip() for s in skills.split(",")]
    
    # Internal service calls (assuming they exist or are cleaned up)
    salary = await job_optimizer_service.get_salary_benchmark(title, skill_list)
    rarity = await job_optimizer_service.get_skill_rarity(skill_list)

    return success_response(data={
        "job_title": title,
        "salary_benchmark": salary,
        "market_rarity": rarity
    })
