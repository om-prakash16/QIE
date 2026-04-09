from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from modules.auth.service import require_permission, get_current_user
from modules.jobs.service import JobService
from modules.search.service import SearchService
from modules.jobs.models import (
    JobCreate, JobUpdate, JobResponse,
    JobApplicationRequest, JobApplicationResponse,
    CompanyCreate, CompanyResponse,
    JobSchemaFieldResponse,
    ApplicationCreate, ApplicationResponse
)
from core.supabase import get_supabase
from core.postgres import get_db_connection
from modules.notifications.service import NotificationService
from modules.activity.service import record_event

router = APIRouter()
job_service = JobService()

# Company Endpoints

@router.get("/list")
async def list_jobs(user_id: Optional[str] = None):
    """
    Public job board with dynamic AI scores for candidates.
    """
    return await job_service.get_jobs_with_scores(user_id)

@router.get("/details/{job_id}")
async def get_job_details(job_id: str):
    """
    Job detail view.
    """
    return await job_service.get_job_details(job_id)

# Job Posting Endpoints

@router.post("/create", response_model=JobResponse)
async def create_job(job: JobCreate, user = Depends(get_current_user)):
    """
    Create a job post. 
    """
    result = await job_service.create_job(job.model_dump())

    # Log the event for the activity feed
    await record_event(
        actor_id=user.get("sub", ""),
        actor_role="company",
        event_type="created_job",
        description=f"Posted a new job: {job.title}",
        entity_type="job",
        entity_id=result.get("id"),
    )

    return JobResponse(id=result["id"], **result)

@router.post("/apply", response_model=ApplicationResponse)
async def apply_to_job(data: ApplicationCreate, user = Depends(get_current_user)):
    """
    Submits an application and triggers AI matching.
    """
    result = await job_service.apply_to_job(data.job_id, data.candidate_id)
    
    # Notify Candidate
    try:
        await NotificationService.create_event_notification(
            user_id=user.get("id"),
            type="job_apply",
            title="Application Submitted",
            message=f"You successfully applied for the job. AI Match Score: {result.get('ai_match_score', 0)}%"
        )
        
        # Log Activity
        await NotificationService.log_activity(
            user_id=user.get("id"),
            action_type="apply_to_job",
            entity_type="job",
            entity_id=data.job_id,
            description=f"Applied with score {result.get('ai_match_score', 0)}%"
        )
    except Exception:
        pass # Best effort for notifications

    return ApplicationResponse(
        id=result["id"], 
        status=result.get("status", "applied"), 
        ai_match_score=result.get("ai_match_score", 0), 
        **data.model_dump()
    )


@router.get("/user")
async def get_user_applications(user_id: str):
    """
    Candidate's application tracking.
    """
    db = get_supabase()
    if not db: return []
    response = db.table("applications") \
        .select("*, jobs(title, companies(name))") \
        .eq("candidate_id", user_id) \
        .execute()
    return response.data

@router.get("/company/{company_id}")
async def get_company_applications(company_id: str):
    """
    Recruiter's applicant list.
    """
    return await job_service.get_company_applications(company_id)


@router.patch("/{app_id}/status")
async def update_app_status(app_id: str, status: str, recruiter = Depends(require_permission("job.moderate"))):
    """
    Step 13: Recruiter Action (Shortlist, Hire, Reject).
    """
    return await job_service.update_application_status(
        application_id=app_id, 
        new_status=status, 
        recruiter_id=recruiter.get("id")
    )
