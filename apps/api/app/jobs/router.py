from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from app.auth.service import require_permission, get_current_user
from app.jobs.service import JobService
from app.jobs.models import (
    CompanyCreate, CompanyResponse,
    JobCreate, JobResponse, JobSchemaFieldResponse,
    ApplicationCreate, ApplicationResponse
)
from core.postgres import get_db_connection
from app.services.notification_service import NotificationService

router = APIRouter()
job_service = JobService()

# --- Company Endpoints ---

@router.post("/companies", response_model=CompanyResponse)
async def create_company(company: CompanyCreate, user = Depends(get_current_user)):
    """Create a new company profile for a user."""
    wallet_address = user.get("user_metadata", {}).get("wallet_address") or user.get("id")
    # ... logic here (move to JobService in future)
    return CompanyResponse(id="mock", owner_wallet=wallet_address, is_verified=False, **company.dict())

# --- Job Posting Endpoints ---

@router.post("/jobs/create", response_model=JobResponse)
async def create_job(job: JobCreate, user = Depends(require_permission("job.create"))):
    """
    Creates a job opening with both core and dynamic fields.
    """
    result = await job_service.create_job(job.model_dump())
    
    # Audit Log & Admin Notification
    await NotificationService.log_activity(
        user_id=user.get("id"),
        action_type="job_create",
        entity_type="job",
        entity_id=result["id"],
        description=f"New job created: {job.title}"
    )
    
    return JobResponse(id=result["id"], is_active=True, **job.model_dump())

@router.get("/jobs/list")
async def list_jobs(skill: Optional[str] = None):
    """
    Public job board with optional skill filtering.
    """
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        query = "SELECT * FROM jobs WHERE is_active = TRUE"
        params = []
        if skill:
            query += " AND %s = ANY(required_skills)"
            params.append(skill)
        
        cur.execute(query, params)
        rows = cur.fetchall()
        # Parse results into JobResponse models
        return [{"id": str(r[0]), "title": r[1]} for r in rows]
    finally:
        cur.close()
        conn.close()

# --- Job Application Endpoints ---

@router.post("/jobs/apply", response_model=ApplicationResponse)
async def apply_to_job(data: ApplicationCreate, user = Depends(get_current_user)):
    """
    Submits an application and triggers high-fidelity AI matching.
    """
    result = await job_service.apply_to_job(data.job_id, data.candidate_wallet)
    
    # Notify Candidate
    await NotificationService.create_event_notification(
        user_id=user.get("id"),
        type="job_apply",
        title="Application Submitted",
        message=f"You successfully applied for the job. AI Match Score: {result['ai_match_score']}%"
    )
    
    # Log Activity
    await NotificationService.log_activity(
        user_id=user.get("id"),
        action_type="apply_to_job",
        entity_type="job",
        entity_id=data.job_id,
        description=f"Applied with score {result['ai_match_score']}%"
    )
    
    return ApplicationResponse(id=result["id"], status=result["status"], ai_match_score=result["ai_match_score"], **data.model_dump())

@router.get("/applications/user")
async def get_user_applications(wallet: str):
    """
    Fetch all applications for a specific candidate.
    """
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT * FROM applications WHERE candidate_wallet = %s", (wallet,))
        rows = cur.fetchall()
        return [{"id": str(r[0]), "status": r[4], "ai_score": r[5]} for r in rows]
    finally:
        cur.close()
        conn.close()

@router.get("/applications/job")
async def get_job_applications(job_id: str, recruiter = Depends(require_permission("job.moderate"))):
    """
    Fetch all applicants for a specific job opening, ordered by AI match score.
    """
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT * FROM applications WHERE job_id = %s ORDER BY ai_match_score DESC", (job_id,))
        rows = cur.fetchall()
        return [{"id": str(r[0]), "candidate": r[3], "status": r[4], "ai_score": r[5]} for r in rows]
    finally:
        cur.close()
        conn.close()
