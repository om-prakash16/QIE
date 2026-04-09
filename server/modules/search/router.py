from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional, Dict, Any
from modules.search.service import SearchService
from modules.ai.models import ParsedResume
from modules.notifications.service import NotificationService

router = APIRouter()
search_service = SearchService()

# API Endpoints

@router.get("/candidates")
async def search_candidates(
    skills: Optional[List[str]] = Query(None),
    min_score: Optional[float] = Query(0.0),
    location: Optional[str] = Query(None),
    query: Optional[str] = Query(None)
):
    """
    High-performance candidate discovery with AI ranking.
    """
    return await search_service.search_candidates(
        skills=skills,
        min_score=min_score,
        location=location,
        query=query
    )

@router.get("/jobs")
async def search_jobs(
    skills: Optional[List[str]] = Query(None),
    job_type: Optional[str] = Query(None),
    min_salary: Optional[float] = Query(0.0),
    query: Optional[str] = Query(None)
):
    """
    High-performance job search with dynamic filtering.
    """
    return await search_service.search_jobs(
        skills=skills,
        job_type=job_type,
        min_salary=min_salary,
        query=query
    )
