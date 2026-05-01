import logging
from typing import List, Dict, Any, Optional
from core.supabase import get_supabase
from core.exceptions import NotFoundError, ExternalServiceError, ValidationError

logger = logging.getLogger(__name__)

class JobService:
    async def create_job(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Creates a new job posting."""
        db = get_supabase()
        if not db:
            raise ExternalServiceError("Database unavailable")

        company_id = data.get("company_id")
        if not company_id:
            raise ValidationError("Company ID is required to post a job")

        try:
            response = db.table("jobs").insert({
                "company_id": company_id,
                "title": data.get("title"),
                "description": data.get("description"),
                "skills_required": data.get("skills_required", []),
                "experience_level": data.get("experience_level"),
                "salary_range": data.get("salary_range"),
                "job_type": data.get("job_type", "remote"),
                "location": data.get("location"),
                "assessment_questions": data.get("assessment_questions", []),
                "is_active": True,
                "created_by": data.get("created_by")
            }).execute()

            if not response.data:
                raise ExternalServiceError("Failed to persist job record")

            job = response.data[0]

            # Emit event for subscriptions
            try:
                from core.events import bus
                await bus.emit("JOB_POSTED", {
                    "job_id": job["id"],
                    "title": job["title"],
                    "company_id": job["company_id"],
                    "skills_required": job["skills_required"]
                })
            except Exception as e:
                logger.error(f"Event emission failed: {e}")

            return job
        except Exception as e:
            logger.error(f"Job creation failed: {e}")
            raise ExternalServiceError(f"Database error during job creation: {str(e)}")

    async def get_job_details(self, job_id: str) -> Dict[str, Any]:
        """Fetches detailed job information."""
        db = get_supabase()
        try:
            res = db.table("jobs").select("*, companies(name)").eq("id", job_id).single().execute()
            if not res.data:
                raise NotFoundError(f"Job with ID {job_id} not found")
            return res.data
        except Exception as e:
            if "not found" in str(e).lower():
                raise NotFoundError(f"Job with ID {job_id} not found")
            logger.error(f"Failed to fetch job {job_id}: {e}")
            raise ExternalServiceError("Failed to retrieve job details")

    async def list_jobs(self, is_active: bool = True) -> List[Dict[str, Any]]:
        """Lists jobs, optionally filtered by status."""
        db = get_supabase()
        res = db.table("jobs").select("*, companies(name)").eq("is_active", is_active).order("created_at", desc=True).execute()
        return res.data or []

    async def update_job(self, job_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        db = get_supabase()
        res = db.table("jobs").update(data).eq("id", job_id).execute()
        if not res.data:
            raise NotFoundError(f"Job {job_id} not found")
        return res.data[0]

# Singleton
job_service = JobService()
