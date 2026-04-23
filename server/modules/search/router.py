from fastapi import APIRouter, Query, Depends
from typing import Optional, List
from modules.search.service import SearchService

router = APIRouter()
search_service = SearchService()

@router.get("/")
async def unified_search(
    q: Optional[str] = Query(None, description="Search keyword"),
    skills: Optional[List[str]] = Query(None, description="Filter by skills"),
    min_score: Optional[int] = Query(None, description="Minimum Proof Score"),
    location: Optional[str] = Query(None, description="Location filter")
):
    """
    Step 5 & 10: Unified Search API.
    """
    return await search_service.search(
        query=q,
        skills=skills,
        min_score=min_score,
        location=location
    )
