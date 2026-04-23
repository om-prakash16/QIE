from typing import List, Dict, Any, Optional
from core.supabase import get_supabase
import asyncio

class SearchService:
    @staticmethod
    async def search(
        query: Optional[str] = None,
        skills: Optional[List[str]] = None,
        min_score: Optional[int] = None,
        max_score: Optional[int] = None,
        location: Optional[str] = None,
        job_type: Optional[str] = None
    ) -> Dict[str, List[Dict[str, Any]]]:
        """
        Step 5: High-performance search using PostgreSQL tsvector and relational joins.
        """
        db = get_supabase()
        if not db: return {"candidates": [], "jobs": []}

        # --- 1. Candidate Search Logic ---
        # We use a RPC or a raw query if possible, but with Supabase client we use .text() or filter chains
        candidate_query = db.table("users").select("*, profiles!inner(*), ai_scores(*)")

        # Full-Text Keyword Search
        if query:
            # Handle user_code exact match
            if query.upper().startswith("BHT-"):
                candidate_query = candidate_query.eq("user_code", query.upper())
            else:
                # Use the pre-computed search_vector in profiles
                # Note: .text_search is a Supabase client method for FTS
                candidate_query = candidate_query.text_search("profiles.search_vector", query, {"config": "english"})

        # Advanced Relational Filters
        if skills:
            # Filter candidates who have ALL specified skills (Relational AND)
            # This is complex in a single query, so we use a subquery/filter
            candidate_query = candidate_query.filter("user_skills_relational.skill_name", "in", f"({','.join(skills)})")

        if min_score is not None:
            candidate_query = candidate_query.gte("ai_scores.proof_score", min_score)
        
        if location:
            candidate_query = candidate_query.ilike("profiles.location", f"%{location}%")

        # Execute Candidate Search with Ranking
        candidates = candidate_query.order("ai_scores.proof_score", desc=True).limit(50).execute()

        # --- 2. Job Search Logic ---
        job_query = db.table("jobs").select("*, companies(*)")
        
        if query:
            job_query = job_query.text_search("search_vector", query, {"config": "english"})
        
        if job_type:
            job_query = job_query.eq("job_type", job_type)
            
        if location:
            job_query = job_query.ilike("location", f"%{location}%")

        jobs = job_query.order("created_at", desc=True).limit(50).execute()

        return {
            "candidates": candidates.data,
            "jobs": jobs.data
        }
