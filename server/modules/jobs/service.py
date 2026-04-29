import uuid
from typing import List, Dict, Any, Optional
from core.supabase import get_supabase
from modules.notifications.core.service import NotificationService


class JobService:
    def __init__(self):
        from modules.ai.services.matcher import JobMatcher
        from modules.ai.services.resume_service import ResumeService

        self.matcher = JobMatcher()
        self.ai = ResumeService()

    async def parse_jd_text(self, text: str) -> Dict[str, Any]:
        """
        Use AI to extract structured fields from raw JD text.
        """
        return await self.ai.parse_job_description(text)


    async def create_job(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a job post.
        """
        db = get_supabase()
        if not db:
            raise Exception("Database service unavailable")
        
        # Determine company_id if not provided
        company_id = data.get("company_id")
        if not company_id or company_id == "pending":
            # Lookup first company owned by this user
            user_id = data.get("created_by")
            if user_id:
                comp_res = db.table("companies").select("id").eq("created_by_user_id", user_id).limit(1).execute()
                if comp_res.data:
                    company_id = comp_res.data[0]["id"]
        
        response = (
            db.table("jobs")
            .insert(
                {
                    "company_id": company_id,
                    "title": data.get("title"),
                    "description": data.get("description"),
                    "skills_required": data.get("required_skills", []),
                    "experience_level": data.get("experience_level"),
                    "salary_range": data.get("salary_range"),
                    "job_type": data.get("job_type", "remote"),
                    "location": data.get("location"),
                    "assessment_questions": [
                        q.model_dump() if hasattr(q, "model_dump") else q
                        for q in data.get("assessment_questions", [])
                    ],
                    "is_active": True,
                    "created_by": data.get("created_by")
                }
            )
            .execute()
        )

        if not response.data:
            raise Exception("Failed to create job")

        job = response.data[0]

        # Emit JOB_POSTED event for alert subscriptions
        try:
            from core.events import bus
            await bus.emit("JOB_POSTED", {
                "job_id": job["id"],
                "title": job["title"],
                "company_id": job["company_id"],
                "skills_required": job["skills_required"]
            })
        except Exception as e:
            print(f"[ERROR] Failed to emit JOB_POSTED event: {e}")

        return job

    async def get_jobs_with_scores(self, user_id: str) -> List[Dict[str, Any]]:
        """
        Public job board with AI match score preview. Optimized with parallel data fetching.
        """
        db = get_supabase()
        if not db:
            return []

        import asyncio
        
        # Define tasks for parallel execution
        tasks = [
            db.table("jobs").select("*, companies(name)").eq("is_active", True).execute()
        ]
        if user_id:
            tasks.append(db.table("users").select("profile_data").eq("id", user_id).single().execute())

        # Execute in parallel
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        jobs_resp = results[0]
        user_resp = results[1] if len(results) > 1 else None

        # Handle jobs response
        if isinstance(jobs_resp, Exception):
            print(f"[ERROR] Failed to fetch jobs: {jobs_resp}")
            return []
        jobs = jobs_resp.data if jobs_resp.data else []

        if not user_id or not jobs or isinstance(user_resp, Exception) or not user_resp:
            return jobs

        # Process user data and matching
        user_data = user_resp.data if user_resp.data else {}
        profile = user_data.get("profile_data", {})

        # Batch Match
        matches = await self.matcher.match(profile, jobs)

        # Merge scores into jobs
        match_map = {m["job_id"]: m["match_score"] for m in matches}
        for job in jobs:
            job["ai_match_percentage"] = match_map.get(job["id"], 0)

        return sorted(jobs, key=lambda x: x.get("ai_match_percentage", 0), reverse=True)

    async def get_job_details(self, job_id: str) -> Dict[str, Any]:
        """
        Fetch job details with company info.
        """
        db = get_supabase()
        if not db:
            return {}
        try:
            response = (
                db.table("jobs")
                .select("*, companies(name)")
                .eq("id", job_id)
                .single()
                .execute()
            )
            return response.data
        except Exception as e:
            print(f"[ERROR] Failed to fetch job details: {str(e)}")
            response = db.table("jobs").select("*").eq("id", job_id).single().execute()
            return response.data

    async def apply_to_job(self, job_id: str, candidate_id: str) -> Dict[str, Any]:
        """
        Application Flow + AI Match Score. Parallelized data retrieval.
        """
        db = get_supabase()
        if not db:
            raise Exception("Database service unavailable")

        import asyncio
        
        # Parallel fetch of Job and Candidate data
        tasks = [
            db.table("jobs").select("title, skills_required, created_by, company:companies(name, id)").eq("id", job_id).single().execute(),
            db.table("users").select("full_name, email, profile_data").eq("id", candidate_id).single().execute()
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        job_resp, user_resp = results

        if isinstance(job_resp, Exception) or isinstance(user_resp, Exception):
            raise Exception("Failed to fetch application context")

        job = job_resp.data if job_resp.data else {}
        user = user_resp.data if user_resp.data else {}

        if not job or not user:
            raise Exception("Job or Candidate not found")

        # Refined AI Match Score (Simple keyword overlap for now, but logged)
        job_skills = set([s.lower() for s in job.get("skills_required", [])])
        user_skills = set(
            [s.lower() for s in user.get("profile_data", {}).get("skills", [])]
        )

        match_score = 0
        if job_skills:
            intersection = job_skills.intersection(user_skills)
            match_score = (len(intersection) / len(job_skills)) * 100

        match_score = round(match_score, 2)

        # Store Application
        response = (
            db.table("applications")
            .insert(
                {
                    "job_id": job_id,
                    "candidate_id": candidate_id,
                    "status": "applied",
                    "ai_match_score": match_score,
                }
            )
            .execute()
        )

        # 4. Vision: Automatic Skill Assessment (MCQ Generation)
        # We trigger this in the background or inline if lightweight enough.
        # Generating 10 questions takes ~3-5s.
        try:
            from modules.ai.services.interview_service import InterviewService

            interview_service = InterviewService()
            await interview_service.generate_questions(
                user_id=candidate_id, job_id=job_id, count=5
            )
            print(
                f"[VISION] Automated MCQs generated for application {response.data[0]['id'] if response.data else 'unknown'}"
            )
        except Exception as ai_err:
            print(f"[VISION] Failed to auto-generate MCQs: {ai_err}")

        # 1. Notify Candidate
        await NotificationService.create_event_notification(
            user_id=candidate_id,
            type="job_app_submitted",
            title="Application Sent & Assessment Ready",
            message=f"Applied to {job.get('title')}. Your personalized skill assessment (MCQs) has been generated.",
            link="/dashboard/candidate/applications",
        )

        # 2. Notify Recruiter (Job Owner)
        if job.get("created_by"):
            await NotificationService.create_event_notification(
                user_id=job["created_by"],
                type="new_applicant",
                title="New Job Applicant",
                message=f"{user.get('full_name')} applied for your position: {job.get('title')}",
                link=f"/dashboard/company/jobs/{job_id}",
            )

        # 3. Log Activity
        await NotificationService.log_activity(
            user_id=candidate_id,
            action_type="job_apply",
            entity_type="job",
            entity_id=job_id,
            description=f"Applied to {job.get('title')} at {job.get('company', {}).get('name')}",
        )

        # 4. Emit Global Event (Side effects like transactional email)
        from core.events import bus
        from modules.auth.core.handlers import JOB_APPLIED

        await bus.emit(
            JOB_APPLIED,
            {
                "user_id": candidate_id,
                "email": user.get("email"),
                "name": user.get("full_name"),
                "job_title": job.get("title"),
                "company_name": job.get("company", {}).get("name"),
            },
        )

        return {
            "application": response.data[0] if response.data else {},
            "job_title": job.get("title"),
            "match_score": match_score,
            "has_custom_assessment": len(job.get("assessment_questions", [])) > 0,
            "custom_assessment_count": len(job.get("assessment_questions", [])),
        }

    async def update_application_status(
        self, app_id: str, status: str, recruiter_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Update application status (Shortlist, Hire, etc.)
        """
        db = get_supabase()
        if not db:
            return {}

        # Fetch existing application and job title for the notification
        app_resp = (
            db.table("applications")
            .select("*, jobs(title)")
            .eq("id", app_id)
            .single()
            .execute()
        )
        app_data = app_resp.data if app_resp.data else {}

        if not app_data:
            raise Exception("Application not found")

        job_title = app_data.get("jobs", {}).get("title", "Job")

        # Update status
        response = (
            db.table("applications")
            .update({"status": status})
            .eq("id", app_id)
            .execute()
        )

        if response.data:
            app = response.data[0]
            # 1. Notify Candidate of status update
            await NotificationService.create_event_notification(
                user_id=app["candidate_id"],
                type="app_status_update",
                title="Application Status Changed",
                message=f"Your application for {job_title} has been moved to: {status.upper()}",
                link="/dashboard/candidate/applications",
            )

            # 2. Log Activity
            await NotificationService.log_activity(
                user_id=recruiter_id,
                action_type="status_change",
                entity_type="application",
                entity_id=app_id,
                description=f"Status for application {app_id} (Job: {job_title}) updated to {status} by {recruiter_id or 'System'}.",
            )

        return response.data[0] if response.data else {}

    async def get_company_applications(
        self, company_id: str, job_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Fetch applications for a company's jobs, optionally filtered by job_id.
        """
        db = get_supabase()
        if not db:
            return []

        query = (
            db.table("applications")
            .select(
                "*, jobs!inner(title, company_id), users(id, full_name, wallet_address, profile_data, user_identities(id_status))"
            )
            .eq("jobs.company_id", company_id)
        )

        if job_id:
            query = query.eq("job_id", job_id)

        response = query.order("created_at", desc=True).execute()
        return response.data

    async def save_job(self, job_id: str, candidate_id: str) -> Dict[str, Any]:
        """
        Save a job for later review.
        """
        db = get_supabase()
        if not db:
            raise Exception("Database service unavailable")

        response = (
            db.table("saved_jobs")
            .insert({"job_id": job_id, "candidate_id": candidate_id})
            .execute()
        )

        if response.data:
            # Log Activity
            try:
                await NotificationService.log_activity(
                    user_id=uuid.UUID(candidate_id),
                    action_type="save_job",
                    entity_type="job",
                    entity_id=uuid.UUID(job_id),
                    description="Saved job for later review.",
                )
            except Exception:
                pass

        return response.data[0] if response.data else {}

    async def unsave_job(self, job_id: str, candidate_id: str) -> bool:
        """
        Remove a job from saved list.
        """
        db = get_supabase()
        if not db:
            return False

        (
            db.table("saved_jobs")
            .delete()
            .eq("job_id", job_id)
            .eq("candidate_id", candidate_id)
            .execute()
        )

        return True

    async def get_saved_jobs(self, candidate_id: str) -> List[Dict[str, Any]]:
        """
        Fetch all jobs saved by the candidate.
        """
        db = get_supabase()
        if not db:
            return []

        response = (
            db.table("saved_jobs")
            .select("*, jobs(*, companies(name))")
            .eq("candidate_id", candidate_id)
            .execute()
        )

        return response.data

    async def get_recommended_candidates(
        self, job_id: str, limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        AI Discovery: Find best-fit public talent for a job.
        """
        db = get_supabase()
        if not db:
            return []

        # 1. Fetch Job
        job_resp = db.table("jobs").select("*").eq("id", job_id).single().execute()
        job = job_resp.data
        if not job:
            return []

        # 2. Fetch Public Candidates
        candidates_resp = (
            db.table("users")
            .select("id, full_name, bio, profile_data, reputation_score")
            .eq("role", "USER")
            .limit(100)
            .execute()
        )

        candidates = candidates_resp.data

        if not candidates:
            # Fallback to some test users
            candidates_resp = (
                db.table("users")
                .select("id, full_name, bio, profile_data, reputation_score")
                .limit(10)
                .execute()
            )
            candidates = candidates_resp.data if candidates_resp.data else []

        # 3. AI Ranking
        recommended = await self.matcher.match_candidates_to_job(job, candidates)

        return recommended[:limit]

    async def get_company_jobs_with_metrics(
        self, company_id: str
    ) -> List[Dict[str, Any]]:
        """
        Fetch all jobs for a company with application metadata.
        """
        db = get_supabase()
        if not db:
            return []

        # 1. Fetch Jobs
        jobs_resp = (
            db.table("jobs")
            .select("*")
            .eq("company_id", company_id)
            .order("created_at", desc=True)
            .execute()
        )
        jobs = jobs_resp.data if jobs_resp.data else []

        if not jobs:
            return []

        # 2. Add App Counts
        # We fetch all applications for these jobs to avoid N+1 count calls
        job_ids = [j["id"] for j in jobs]
        apps_resp = (
            db.table("applications").select("job_id").in_("job_id", job_ids).execute()
        )

        app_counts = {}
        for app in apps_resp.data or []:
            jid = app["job_id"]
            app_counts[jid] = app_counts.get(jid, 0) + 1

        for job in jobs:
            job["applicant_count"] = app_counts.get(job["id"], 0)
            job["has_assessment"] = len(job.get("assessment_questions", [])) > 0
            # Simulated Auto-Match count (could be calculated for real in a future optimization)
            job["discovery_match_count"] = 12 if job["is_active"] else 0

        return jobs

    async def submit_assessment_results(
        self, application_id: str, answers: List[str], score: float
    ) -> Dict[str, Any]:
        """
        Record assessment results and update application score/status.
        """
        db = get_supabase()
        if not db:
            raise Exception("Database unavailable")

        # 1. Update Application
        response = (
            db.table("applications")
            .update(
                {
                    "assessment_score": score,
                    "assessment_results": {"answers": answers},
                    # Optionally update status to 'shortlisted' if score is very high
                    "status": "shortlisted" if score >= 90 else "applied",
                }
            )
            .eq("id", application_id)
            .execute()
        )

        if not response.data:
            raise Exception("Application not found or update failed")

        app = response.data[0]

        # 2. Fetch Job/Recruiter Info for notification
        job_resp = (
            db.table("applications")
            .select("*, jobs(title, created_by)")
            .eq("id", application_id)
            .single()
            .execute()
        )
        job_data = job_resp.data if job_resp.data else {}
        job_title = job_data.get("jobs", {}).get("title", "Job")
        recruiter_id = job_data.get("jobs", {}).get("created_by")

        # 3. Notify Recruiter
        if recruiter_id:
            await NotificationService.create_event_notification(
                user_id=recruiter_id,
                type="assessment_complete",
                title="High-Resonance Assessment",
                message=f"A candidate completed the assessment for {job_title} with a score of {score}%",
                link=f"/dashboard/company/jobs/{app['job_id']}",
            )

        # 4. Log Activity
        await NotificationService.log_activity(
            user_id=uuid.UUID(app["candidate_id"]),
            action_type="assessment_submit",
            entity_type="application",
            entity_id=uuid.UUID(application_id),
            description=f"Completed skill assessment for {job_title} with score {score}%",
        )

        return app
