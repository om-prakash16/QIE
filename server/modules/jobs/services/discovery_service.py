import logging
from typing import List, Dict, Any, Optional
from core.supabase import get_supabase
from core.exceptions import NotFoundError, ExternalServiceError
from core.cache import cache_result

logger = logging.getLogger(__name__)

class DiscoveryService:
    def __init__(self):
        from modules.ai.services.matcher import JobMatcher
        self.matcher = JobMatcher()

    @cache_result(ttl=300)
    async def get_recommended_candidates(self, job_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """AI Discovery: Matches public talent to a specific job."""
        db = get_supabase()
        if not db: return []

        # 1. Fetch Job
        job_res = db.table("jobs").select("*").eq("id", job_id).single().execute()
        if not job_res.data:
            raise NotFoundError("Job not found")
        job = job_res.data

        # 2. Fetch Candidates (Optimized for discovery)
        candidates_res = (
            db.table("users")
            .select("id, full_name, profile_data, reputation_score")
            .eq("role", "USER")
            .limit(100)
            .execute()
        )
        candidates = candidates_res.data or []

        # 3. AI Ranking
        try:
            recommended = await self.matcher.match_candidates_to_job(job, candidates)
            return recommended[:limit]
        except Exception as e:
            logger.error(f"Discovery matching failed: {e}")
            return []

    async def get_jobs_with_user_scores(self, user_id: str) -> List[Dict[str, Any]]:
        """Fetches active jobs and calculates personalized AI match scores."""
        db = get_supabase()
        
        # Parallel fetch
        import asyncio
        tasks = [
            db.table("jobs").select("*, companies(name)").eq("is_active", True).execute(),
            db.table("users").select("profile_data").eq("id", user_id).single().execute()
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        jobs = results[0].data if hasattr(results[0], "data") else []
        user_data = results[1].data if hasattr(results[1], "data") else {}
        
        if not jobs or not user_data:
            return jobs

        # Batch Match
        try:
            profile = user_data.get("profile_data", {})
            matches = await self.matcher.match(profile, jobs)
            
            match_map = {m["job_id"]: m["match_score"] for m in matches}
            for job in jobs:
                job["ai_match_percentage"] = match_map.get(job["id"], 0)
                
            return sorted(jobs, key=lambda x: x.get("ai_match_percentage", 0), reverse=True)
        except Exception as e:
            logger.error(f"Personalized matching failed: {e}")
            return jobs

# Singleton
discovery_service = DiscoveryService()
