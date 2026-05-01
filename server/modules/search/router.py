from fastapi import APIRouter, Query, Depends
from typing import Optional, List

from core.response import success_response
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
    """Global candidate search with AI score filtering."""
    skill_list = skills.split(",") if skills else None
    result = await search_service.search(
        query=query,
        skills=skill_list,
        min_score=min_score,
        location=location
    )
    return success_response(data=result)

@router.get("/jobs")
async def search_jobs(
    query: Optional[str] = Query(None, description="Search keyword"),
    location: Optional[str] = Query(None, description="Location filter")
):
    """Search for job opportunities."""
    result = await search_service.search(
        query=query,
        location=location
    )
    return success_response(data=result)

@router.get("/companies")
async def search_companies(
    query: Optional[str] = Query(None, description="Search keyword"),
    industry: Optional[str] = Query(None, description="Industry filter"),
    size: Optional[str] = Query(None, description="Company size filter"),
    location: Optional[str] = Query(None, description="Location filter")
):
    """Search for companies."""
    result = await search_service.search_companies(
        query=query,
        industry=industry,
        size=size,
        location=location
    )
    return success_response(data=result)
