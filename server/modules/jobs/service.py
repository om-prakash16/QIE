import uuid
from typing import List, Dict, Any, Optional
from core.supabase import get_supabase
from modules.notifications.service import NotificationService

class JobService:
    def __init__(self):
        from modules.ai.services.matcher import JobMatcher
        self.matcher = JobMatcher()

    async def create_job(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        SECTION 2: Create a job post.
        """
        db = get_supabase()
        if not db:
            raise Exception("Database service unavailable")
        response = db.table("jobs").insert({
            "company_id": data.get("company_id"),
            "title": data.get("title"),
            "description": data.get("description"),
            "skills_required": data.get("required_skills", []),
            "experience_level": data.get("experience_level"),
            "salary_range": data.get("salary_range"),
            "job_type": data.get("job_type", "remote"),
            "location": data.get("location"),
            "is_active": True
        }).execute()
        
        if not response.data:
            raise Exception("Failed to create job")
            
        return response.data[0]

    async def get_jobs_with_scores(self, user_id: str) -> List[Dict[str, Any]]:
        """
        SECTION 4: Public job board with AI match score preview.
        """
        db = get_supabase()
        if not db: return []
        
        # 1. Fetch active jobs
        try:
            jobs_resp = db.table("jobs").select("*, companies(name)").eq("is_active", True).execute()
            jobs = jobs_resp.data if jobs_resp.data else []
        except Exception as e:
            print(f"[ERROR] Failed to fetch jobs with company join: {str(e)}")
            # Fallback to fetching jobs without the join if it fails
            jobs_resp = db.table("jobs").select("*").eq("is_active", True).execute()
            jobs = jobs_resp.data if jobs_resp.data else []
        
        if not user_id or not jobs:
            return jobs

        # 2. Fetch user profile
        user_resp = db.table("users").select("profile_data").eq("id", user_id).single().execute()
        user_data = user_resp.data if user_resp.data else {}
        profile = user_data.get("profile_data", {})

        # 3. Batch Match
        matches = await self.matcher.match(profile, jobs)
        
        # 4. Merge scores into jobs
        match_map = {m["job_id"]: m["match_score"] for m in matches}
        for job in jobs:
            job["ai_match_percentage"] = match_map.get(job["id"], 0)
            
        return sorted(jobs, key=lambda x: x.get("ai_match_percentage", 0), reverse=True)

    async def get_job_details(self, job_id: str) -> Dict[str, Any]:
        """
        SECTION 10: Fetch job details with company info.
        """
        db = get_supabase()
        if not db: return {}
        try:
            response = db.table("jobs").select("*, companies(name)").eq("id", job_id).single().execute()
            return response.data
        except Exception as e:
            print(f"[ERROR] Failed to fetch job details: {str(e)}")
            response = db.table("jobs").select("*").eq("id", job_id).single().execute()
            return response.data

    async def apply_to_job(self, job_id: str, candidate_id: str) -> Dict[str, Any]:
        """
        SECTION 5 & 7: Application Flow + AI Match Score.
        """
        db = get_supabase()
        if not db:
            raise Exception("Database service unavailable")
        
        # 1. Fetch Job and Candidate Skills
        job_resp = db.table("jobs").select("title, skills_required").eq("id", job_id).single().execute()
        user_resp = db.table("users").select("profile_data").eq("id", candidate_id).single().execute()
        
        job = job_resp.data if job_resp.data else {}
        user = user_resp.data if user_resp.data else {}
        
        if not job or not user:
            raise Exception("Job or Candidate not found")

        # 2. Calculate AI Match Score
        job_skills = set(job.get("skills_required", []))
        user_skills = set(user.get("profile_data", {}).get("skills", []))
        
        match_score = 0
        if job_skills:
            intersection = job_skills.intersection(user_skills)
            match_score = (len(intersection) / len(job_skills)) * 100
        
        match_score = round(match_score, 2)

        # 3. Store Application
        response = db.table("applications").insert({
            "job_id": job_id,
            "candidate_id": candidate_id,
            "status": "applied",
            "ai_match_score": match_score
        }).execute()

        # Trigger Notifications & Logs
        try:
            await NotificationService.create_event_notification(
                user_id=uuid.UUID(candidate_id),
                type="job_app",
                title="Application Submitted",
                message=f"Your application for {job.get('title', 'Job')} was submitted with an AI Match Score of {match_score}%."
            )
            
            await NotificationService.log_activity(
                user_id=uuid.UUID(candidate_id),
                action_type="job_apply",
                entity_type="job",
                entity_id=uuid.UUID(job_id),
                description=f"Applied to {job.get('title', 'Job')}."
            )
        except Exception:
            pass

        return response.data[0] if response.data else {}

    async def update_application_status(self, app_id: str, status: str) -> Dict[str, Any]:
        """
        SECTION 6: Update application status (Shortlist, Hire, etc.)
        """
        db = get_supabase()
        if not db: return {}
        response = db.table("applications").update({"status": status}).eq("id", app_id).execute()
        
        if response.data:
            app = response.data[0]
            try:
                # Notify Candidate of status update
                await NotificationService.create_event_notification(
                    user_id=uuid.UUID(app["candidate_id"]),
                    type="job_status",
                    title="Application Updated",
                    message=f"Your application status has been updated to: {status.upper()}"
                )
                
                # Log Activity
                await NotificationService.log_activity(
                    user_id=None,
                    action_type="status_change",
                    entity_type="application",
                    entity_id=uuid.UUID(app_id),
                    description=f"Application {app_id} moved to {status}."
                )
            except Exception: pass

        return response.data[0] if response.data else {}

    async def get_company_applications(self, company_id: str) -> List[Dict[str, Any]]:
        """
        SECTION 10: Fetch all applications for a company's jobs.
        """
        db = get_supabase()
        if not db: return []
        response = db.table("applications") \
            .select("*, jobs!inner(title, company_id), users(id, full_name, wallet_address)") \
            .eq("jobs.company_id", company_id) \
            .execute()
        return response.data

