from fastapi import APIRouter, Depends, Body, Query
from typing import Optional, Dict, Any

from core.response import success_response
from core.dependencies import get_current_user_id, get_company_id
from modules.jobs.services.application_service import application_service

router = APIRouter()

@router.get("/my-applications")
async def get_candidate_applications(
    user_id: str = Depends(get_current_user_id)
):
    """Fetch all applications for the authenticated candidate."""
    apps = await application_service.get_user_applications(user_id)
    return success_response(data=apps)

@router.get("/company-applications")
async def get_recruiter_applications(
    job_id: Optional[str] = Query(None),
    company_id: str = Depends(get_company_id)
):
    """Fetch all applications for the recruiter's company."""
    # Re-using the logic from application_service or job_router
    from core.dependencies import get_db
    db = await get_db()
    query = db.table("applications").select("*, jobs!inner(title, company_id), users(full_name, profile_data)").eq("jobs.company_id", company_id)
    if job_id: query = query.eq("job_id", job_id)
    res = query.order("created_at", desc=True).execute()
    return success_response(data=res.data)

@router.patch("/{app_id}/status")
async def update_status(
    app_id: str,
    status: str = Body(..., embed=True),
    user_id: str = Depends(get_current_user_id),
    company_id: str = Depends(get_company_id)
):
    """Update application status (Shortlist, Hire, Reject)."""
    result = await application_service.update_status(
        app_id=app_id,
        status=status,
        recruiter_id=user_id
    )
    return success_response(data=result, message=f"Application status updated to {status}")

@router.post("/{app_id}/assessment")
async def submit_assessment(
    app_id: str,
    payload: Dict[str, Any],
    user_id: str = Depends(get_current_user_id)
):
    """Submit candidate assessment results."""
    result = await application_service.submit_assessment(
        app_id=app_id,
        score=payload.get("score", 0),
        answers=payload.get("answers", [])
    )
    return success_response(data=result)
