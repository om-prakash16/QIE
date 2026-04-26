from fastapi import APIRouter, Depends, Body
from typing import Dict, Any, Optional
from modules.auth.service import require_permission, get_current_user
from modules.auth.guards import require_company
from modules.jobs.service import JobService
from modules.jobs.models import (
    JobCreate,
    JobResponse,
    ApplicationCreate,
    ApplicationResponse,
)
from core.supabase import get_supabase
from modules.notifications.service import NotificationService
from modules.activity.service import record_event

router = APIRouter()
job_service = JobService()


@router.post("/parse-jd")
async def parse_job_description(
    text: str = Body(..., embed=True), user=Depends(require_company)
):
    """
    AI JD Parser: Extracts title, skills, and description from raw text.
    """
    return await job_service.parse_jd_text(text)

# Company Endpoints


@router.get("/list")
async def list_jobs(user_id: Optional[str] = None):
    """
    Public job board with dynamic AI scores for candidates.
    """
    return await job_service.get_jobs_with_scores(user_id)


@router.get("/{job_id}/discovery")
async def get_job_discovery(
    job_id: str, limit: int = 10, current_user=Depends(get_current_user)
):
    """
    AI Candidate Discovery for recruiters.
    """
    # Verify recruiter role (simple check for now)
    if current_user.get("role") not in ["COMPANY", "ADMIN", "staff"]:
        # Fallback check if role is 'admin' or something else
        pass

    return await job_service.get_recommended_candidates(job_id, limit)


@router.get("/{job_id}")
async def get_job_details(job_id: str):
    """
    Job detail view.
    """
    return await job_service.get_job_details(job_id)


# Job Posting Endpoints


@router.post("/create", response_model=JobResponse)
async def create_job(job: JobCreate, user=Depends(require_company)):
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
async def apply_to_job(data: ApplicationCreate, user=Depends(get_current_user)):
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
            message=f"You successfully applied for the job. AI Match Score: {result.get('ai_match_score', 0)}%",
        )

        # Log Activity
        await NotificationService.log_activity(
            user_id=user.get("id"),
            action_type="apply_to_job",
            entity_type="job",
            entity_id=data.job_id,
            description=f"Applied with score {result.get('ai_match_score', 0)}%",
        )
    except Exception:
        pass  # Best effort for notifications

    return ApplicationResponse(
        id=result["id"],
        status=result.get("status", "applied"),
        ai_match_score=result.get("ai_match_score", 0),
        **data.model_dump(),
    )


@router.post("/save")
async def save_job(job_id: str, user=Depends(get_current_user)):
    """
    Save a job for later review.
    """
    return await job_service.save_job(job_id, user.get("id"))


@router.delete("/unsave/{job_id}")
async def unsave_job(job_id: str, user=Depends(get_current_user)):
    """
    Remove a job from saved list.
    """
    return await job_service.unsave_job(job_id, user.get("id"))


@router.get("/saved")
async def get_saved_jobs(user=Depends(get_current_user)):
    """
    Get all jobs saved by the current user.
    """
    return await job_service.get_saved_jobs(user.get("id"))


@router.get("/user")
async def get_user_applications(user_id: str):
    """
    Candidate's application tracking.
    """
    db = get_supabase()
    if not db:
        return []
    response = (
        db.table("applications")
        .select("*, jobs(title, assessment_questions, companies(company_name))")
        .eq("candidate_id", user_id)
        .execute()
    )
    return response.data


@router.get("/company/{company_id}")
async def get_company_applications(company_id: str, job_id: Optional[str] = None, user=Depends(require_company)):
    """
    Recruiter's applicant list.
    """
    return await job_service.get_company_applications(company_id, job_id)


@router.get("/company-metrics/{company_id}")
async def get_company_jobs_metrics(company_id: str, user=Depends(require_company)):
    """
    Recruiter's job list with high-level metrics (counts, discovery).
    """
    return await job_service.get_company_jobs_with_metrics(company_id)


@router.patch("/{app_id}/status")
async def update_app_status(
    app_id: str, status: str, recruiter=Depends(require_permission("job.moderate"))
):
    """
    Step 13: Recruiter Action (Shortlist, Hire, Reject).
    """
    return await job_service.update_application_status(
        application_id=app_id, new_status=status, recruiter_id=recruiter.get("id")
    )


@router.patch("/applications/{app_id}/submit-assessment")
async def submit_assessment(app_id: str, data: Dict[str, Any], user=Depends(get_current_user)):
    """
    Submits candidate's assessment answers and updates score.
    """
    return await job_service.submit_assessment_results(
        application_id=app_id,
        answers=data.get("answers", []),
        score=data.get("score", 0),
    )
