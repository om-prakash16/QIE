from fastapi import APIRouter, Depends, Query, Body
from typing import List, Optional, Dict, Any

from core.response import success_response
from core.dependencies import get_db, get_current_user_id, get_company_id
from core.exceptions import AuthorizationError

from modules.jobs.services.job_service import job_service
from modules.jobs.services.application_service import application_service
from modules.jobs.services.discovery_service import discovery_service

router = APIRouter()

# --- Public Endpoints ---

@router.get("/list")
async def list_all_jobs(
    user_id: Optional[str] = Query(None, description="Optional user ID for personalized scores")
):
    """Public job board. Returns jobs with AI scores if user_id is provided."""
    if user_id:
        data = await discovery_service.get_jobs_with_user_scores(user_id)
    else:
        data = await job_service.list_jobs()
    return success_response(data=data)

@router.get("/{job_id}")
async def get_job_details(job_id: str):
    """Fetch detailed job information."""
    data = await job_service.get_job_details(job_id)
    return success_response(data=data)

# --- Recruiter Endpoints ---

@router.post("/create")
async def create_job_posting(
    data: Dict[str, Any],
    user_id: str = Depends(get_current_user_id),
    company_id: str = Depends(get_company_id)
):
    """Post a new job. Requires company ownership."""
    data["company_id"] = company_id
    data["created_by"] = user_id
    result = await job_service.create_job(data)
    return success_response(data=result, message="Job posted successfully")

@router.get("/{job_id}/discovery")
async def discover_candidates(
    job_id: str,
    limit: int = Query(10),
    company_id: str = Depends(get_company_id)
):
    """AI-powered candidate discovery for a specific job."""
    # Note: get_company_id acts as an auth guard here
    candidates = await discovery_service.get_recommended_candidates(job_id, limit)
    return success_response(data=candidates)

@router.get("/company/applications")
async def get_company_applicants(
    job_id: Optional[str] = Query(None),
    company_id: str = Depends(get_company_id)
):
    """List all applicants for the company's jobs."""
    # In a real app, this would be in application_service
    from modules.jobs.services.application_service import application_service
    # Re-using the logic but filtering by company
    db = await get_db()
    query = db.table("applications").select("*, jobs!inner(title, company_id), users(full_name, profile_data)").eq("jobs.company_id", company_id)
    if job_id: query = query.eq("job_id", job_id)
    res = query.order("created_at", desc=True).execute()
    return success_response(data=res.data)

# --- Candidate Endpoints ---

@router.post("/apply")
async def apply_to_job(
    data: Dict[str, Any],
    user_id: str = Depends(get_current_user_id)
):
    """Submit a job application."""
    job_id = data.get("job_id")
    result = await application_service.apply_to_job(job_id, user_id)
    return success_response(data=result, message="Application submitted")

@router.get("/user/applications")
async def get_my_applications(
    user_id: str = Depends(get_current_user_id)
):
    """Track your own job applications."""
    apps = await application_service.get_user_applications(user_id)
    return success_response(data=apps)

@router.patch("/applications/{app_id}/status")
async def update_application_status(
    app_id: str,
    status: str = Body(..., embed=True),
    user_id: str = Depends(get_current_user_id),
    company_id: str = Depends(get_company_id)
):
    """Update application status (Recruiter action)."""
    result = await application_service.update_status(app_id, status, user_id)
    return success_response(data=result)

@router.post("/applications/{app_id}/submit-assessment")
async def submit_assessment(
    app_id: str,
    payload: Dict[str, Any],
    user_id: str = Depends(get_current_user_id)
):
    """Submit answers for a skill assessment."""
    result = await application_service.submit_assessment(
        app_id=app_id,
        score=payload.get("score", 0),
        answers=payload.get("answers", [])
    )
    return success_response(data=result)
