from portal.apps.jobs.repository import JobRepository
from portal.apps.matching.service import MatchingService
from typing import List, Dict, Any

class JobService:
    def __init__(self):
        self.repository = JobRepository()
        self.matching = MatchingService()

    async def post_job(self, data: Dict[str, Any]):
        # Business logic for job posting (e.g. enrichment)
        job = self.repository.create(data)
        
        # Emit event for scouting agent
        from portal.events.producer import dispatch_event
        await dispatch_event("JOB_POSTED", {
            "job_id": job["id"],
            "company_id": job["company_id"]
        })
        
        return job

    async def get_jobs_for_candidate(self, user_id: str):
        jobs = self.repository.list_active()
        if not user_id:
            return jobs
            
        # Get candidate profile for matching
        from portal.apps.users.service import UserService
        user_service = UserService()
        profile = await user_service.get_profile(user_id)
        
        # Match using the centralized matching service
        matches = await self.matching.match_candidate_to_jobs(profile["profile"], jobs)
        
        # Merge scores
        match_map = {m["job_id"]: m["match_score"] for m in matches}
        for job in jobs:
            job["ai_match_percentage"] = match_map.get(job["id"], 0)
            
        return sorted(jobs, key=lambda x: x.get("ai_match_percentage", 0), reverse=True)
