from typing import List, Dict, Any, Optional
from core.supabase import get_supabase

class SearchService:
    def __init__(self):
        pass

    async def search_candidates(self, 
                                skills: Optional[List[str]] = None, 
                                min_score: Optional[float] = None, 
                                location: Optional[str] = None,
                                query: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Candidate Search with AI Ranking.
        """
        db = get_supabase()
        # Start building the search query
        sb = db.table("search_candidates").select("*")
        
        if skills:
            sb = sb.contains("skills", skills)
        
        if min_score:
            sb = sb.gte("proof_score", min_score)
            
        if location:
            sb = sb.ilike("location", f"%{location}%")
            
        if query:
            # Full text search using tsquery
            sb = sb.text_search("search_vector", query)
            
        # AI Ranking (Proof Score Descending)
        sb = sb.order("proof_score", desc=True)
        
        response = sb.execute()
        return response.data if response.data else []

    async def search_jobs(self, 
                          skills: Optional[List[str]] = None, 
                          job_type: Optional[str] = None, 
                          min_salary: Optional[float] = None,
                          query: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Job Search with Filtering.
        """
        db = get_supabase()
        sb = db.table("search_jobs").select("*")
        
        if skills:
            sb = sb.contains("skills", skills)
            
        if job_type:
            sb = sb.eq("job_type", job_type)
            
        if query:
            sb = sb.text_search("search_vector", query)
            
        # Default sorting by updated_at (Newest First)
        sb = sb.order("updated_at", desc=True)
        
        response = sb.execute()
        return response.data if response.data else []
