import logging
import uuid
from typing import List, Dict, Any, Optional
from core.supabase import get_supabase
from core.exceptions import NotFoundError, ExternalServiceError, ValidationError
from modules.notifications.core.service import NotificationService

logger = logging.getLogger(__name__)

class ApplicationService:
    async def apply_to_job(self, job_id: str, candidate_id: str) -> Dict[str, Any]:
        """Handles the job application flow."""
        db = get_supabase()
        if not db: raise ExternalServiceError("Database unavailable")

        # 1. Verify existence and fetch context
        job_res = db.table("jobs").select("title, created_by, company:companies(name, id)").eq("id", job_id).single().execute()
        user_res = db.table("users").select("full_name, email, profile_data").eq("id", candidate_id).single().execute()

        if not job_res.data or not user_res.data:
            raise NotFoundError("Job or Candidate not found")

        job = job_res.data
        user = user_res.data

        # 2. Simple Match Score Calculation (Keyword overlap)
        job_skills = set([s.lower() for s in job.get("skills_required", [])])
        user_skills = set([s.lower() for s in user.get("profile_data", {}).get("skills", [])])
        match_score = (len(job_skills.intersection(user_skills)) / len(job_skills)) * 100 if job_skills else 0
        match_score = round(match_score, 2)

        # 3. Store Application
        try:
            app_res = db.table("applications").insert({
                "job_id": job_id,
                "candidate_id": candidate_id,
                "status": "applied",
                "ai_match_score": match_score
            }).execute()
            
            if not app_res.data:
                raise ExternalServiceError("Failed to store application")
            
            application = app_res.data[0]
        except Exception as e:
            logger.error(f"Application persistence failed: {e}")
            raise ExternalServiceError("Failed to submit application")

        # 4. Trigger Background Tasks (Notifications, MCQs)
        await self._post_application_actions(job, user, application)

        return {
            "application": application,
            "match_score": match_score
        }

    async def _post_application_actions(self, job, user, application):
        """Handle side effects like notifications and MCQ generation."""
        try:
            # Generate AI MCQs
            from modules.ai.services.interview_service import interview_service
            await interview_service.generate_questions(
                user_id=application["candidate_id"], 
                job_id=application["job_id"], 
                count=5
            )

            # Notify Candidate
            await NotificationService.create_event_notification(
                user_id=application["candidate_id"],
                type="job_app_submitted",
                title="Application Sent",
                message=f"Applied to {job['title']}. Your AI assessment is ready.",
                link="/dashboard/candidate/applications"
            )

            # Notify Recruiter
            if job.get("created_by"):
                await NotificationService.create_event_notification(
                    user_id=job["created_by"],
                    type="new_applicant",
                    title="New Applicant",
                    message=f"{user['full_name']} applied for {job['title']}",
                    link=f"/dashboard/company/jobs/{application['job_id']}"
                )
        except Exception as e:
            logger.error(f"Post-application actions failed: {e}")

    async def update_status(self, app_id: str, status: str, recruiter_id: str) -> Dict[str, Any]:
        """Updates the status of an application and notifies the candidate."""
        db = get_supabase()
        
        # Verify app exists
        app_res = db.table("applications").select("*, jobs(title)").eq("id", app_id).single().execute()
        if not app_res.data:
            raise NotFoundError("Application not found")
        
        app_data = app_res.data
        job_title = app_data.get("jobs", {}).get("title", "Job")

        # Update
        res = db.table("applications").update({"status": status}).eq("id", app_id).execute()
        if not res.data:
            raise ExternalServiceError("Failed to update status")

        # Notify
        await NotificationService.create_event_notification(
            user_id=app_data["candidate_id"],
            type="app_status_update",
            title="Status Updated",
            message=f"Your application for {job_title} is now: {status.upper()}"
        )

        return res.data[0]

    async def get_user_applications(self, user_id: str) -> List[Dict[str, Any]]:
        db = get_supabase()
        res = db.table("applications").select("*, jobs(title, companies(name))").eq("candidate_id", user_id).execute()
        return res.data or []

    async def submit_assessment(self, app_id: str, score: float, answers: List[Any]) -> Dict[str, Any]:
        db = get_supabase()
        res = db.table("applications").update({
            "assessment_score": score,
            "assessment_results": {"answers": answers},
            "status": "shortlisted" if score >= 85 else "applied"
        }).eq("id", app_id).execute()
        
        if not res.data:
            raise NotFoundError("Application not found")
        
        return res.data[0]

# Singleton
application_service = ApplicationService()
