from fastapi import APIRouter, Query, Depends
from typing import Optional, List
from modules.search.service import SearchService

router = APIRouter()
search_service = SearchService()

@router.get("/candidates")
async def search_candidates(
    query: Optional[str] = Query(None, description="Search keyword"),
    skills: Optional[str] = Query(None, description="Comma-separated skills"),
    min_score: Optional[int] = Query(None, description="Minimum Proof Score"),
    location: Optional[str] = Query(None, description="Location filter")
):
    skill_list = skills.split(",") if skills else None
    return await search_service.search(
        query=query,
        skills=skill_list,
        min_score=min_score,
        location=location
    )

@router.get("/jobs")
async def search_jobs(
    query: Optional[str] = Query(None, description="Search keyword"),
    location: Optional[str] = Query(None, description="Location filter")
):
    return await search_service.search(
        query=query,
        location=location
    )
