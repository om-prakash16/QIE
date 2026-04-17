"""
Recruiter Intelligence Dashboard Router.
Provides analytics endpoints for hiring insights.
"""
from fastapi import APIRouter, Depends, Query
from typing import Optional, List
from modules.auth.service import get_current_user
from modules.ai.services.recruiter_dashboard_service import RecruiterDashboardService

router = APIRouter()
dashboard_service = RecruiterDashboardService()


@router.get("/rankings")
async def get_candidate_rankings(
    job_id: str = Query(..., description="Job ID to rank candidates for"),
    current_user=Depends(get_current_user)
):
    """AI-ranked candidate list sorted by Match% + Proof-Score."""
    return {"rankings": dashboard_service.get_candidate_rankings(job_id)}


@router.get("/time-to-fill")
async def predict_hiring_time(
    job_id: str = Query(..., description="Job ID"),
    current_user=Depends(get_current_user)
):
    """Predict time-to-fill based on qualified talent pool."""
    return dashboard_service.get_hiring_time_prediction(job_id)


@router.get("/skill-trends")
async def get_skill_demand_trends(current_user=Depends(get_current_user)):
    """6-month skill demand trend data for charts."""
    return {"trends": dashboard_service.get_skill_demand_trends()}


@router.get("/talent-availability")
async def get_talent_availability(current_user=Depends(get_current_user)):
    """Talent supply breakdown by skill."""
    return {"availability": dashboard_service.get_talent_availability()}


@router.get("/skill-gap")
async def analyze_skill_gap(
    skills: str = Query(..., description="Comma-separated required skills"),
    current_user=Depends(get_current_user)
):
    """Compare job requirements vs available talent pool."""
    skill_list = [s.strip() for s in skills.split(",")]
    return dashboard_service.get_skill_gap_analysis(skill_list)


@router.get("/funnel")
async def get_engagement_funnel(
    job_id: str = Query(..., description="Job ID"),
    current_user=Depends(get_current_user)
):
    """Hiring funnel conversion metrics."""
    return dashboard_service.get_engagement_funnel(job_id)
