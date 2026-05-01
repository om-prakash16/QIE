from fastapi import APIRouter, Depends, Query
from typing import List, Optional

from core.response import success_response
from core.dependencies import get_db
from modules.ai.services.recruiter_dashboard_service import recruiter_service

router = APIRouter()

# TODO: Add real RBAC dependency here
# from modules.auth.core.guards import require_company_role

@router.get("/candidates/{job_id}")
async def get_job_candidates(
    job_id: str,
    # _ = Depends(require_company_role)
):
    """
    Get ranked candidate list for a specific job.
    Includes Proof-Scores and Trust-Shields.
    """
    rankings = await recruiter_service.get_candidate_rankings(job_id)
    return success_response(data=rankings)

@router.get("/insights/{job_id}")
async def get_job_insights(
    job_id: str
):
    """
    Get predictive hiring insights and funnel analytics for a job.
    """
    prediction = await recruiter_service.get_hiring_time_prediction(job_id)
    funnel = await recruiter_service.get_engagement_funnel(job_id)
    
    return success_response(data={
        "hiring_prediction": prediction,
        "funnel_metrics": funnel
    })

@router.get("/market-trends")
async def get_market_trends():
    """
    Get global skill demand trends across the platform.
    """
    trends = await recruiter_service.get_skill_demand_trends()
    return success_response(data=trends)
