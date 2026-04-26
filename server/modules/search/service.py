from typing import List, Dict, Any, Optional
from core.supabase import get_supabase
import asyncio
from cachetools import TTLCache

class SearchService:
    # Cache for 1 minute
    _SEARCH_CACHE = TTLCache(maxsize=500, ttl=60)

    @staticmethod
    async def search(
        query: Optional[str] = None,
        skills: Optional[List[str]] = None,
        min_score: Optional[int] = None,
        max_score: Optional[int] = None,
        location: Optional[str] = None,
        job_type: Optional[str] = None
    ) -> Dict[str, List[Dict[str, Any]]]:
        cache_key = f"{query}:{skills}:{min_score}:{max_score}:{location}:{job_type}"
        if cache_key in SearchService._SEARCH_CACHE:
            return SearchService._SEARCH_CACHE[cache_key]

        db = get_supabase()
        if not db: return {"candidates": [], "jobs": []}

        # 1. Candidate Search
        candidate_query = db.table("search_candidates").select("*")
        
        if query:
            upper_query = query.upper()
            if upper_query.startswith("SS-") or upper_query.startswith("BH-"):
                # Direct lookup by Best Hiring code (Audit/Deep-link path)
                res = db.table("users").select("*, profiles(*), ai_scores(*)").eq("user_code", query.upper()).execute()
                # Map to match search_candidates format if needed, or just return
                return {"candidates": res.data, "jobs": []}
            else:
                # Full Text Search on denormalized index
                candidate_query = candidate_query.text_search("fts", query)
        
        if skills:
            # Overlap search for tags
            candidate_query = candidate_query.overlaps("skills", skills)
            
        if min_score:
            candidate_query = candidate_query.gte("proof_score", min_score)
            
        if location:
            candidate_query = candidate_query.ilike("location", f"%{location}%")

        res = candidate_query.order("proof_score", desc=True).limit(20).execute()
        result = {"candidates": res.data, "jobs": []}
        SearchService._SEARCH_CACHE[cache_key] = result
        return result

