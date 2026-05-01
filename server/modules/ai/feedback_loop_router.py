from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from typing import Optional, List

from core.response import success_response
from core.dependencies import get_db, get_current_user_id
from modules.ai.services.feedback_loop_service import feedback_service

router = APIRouter()

class HiringEventRequest(BaseModel):
    candidate_id: str
    job_id: str
    company_id: str
    match_percentage: float
    proof_score: int

class PerformanceReviewRequest(BaseModel):
    candidate_id: str
    job_id: str
    technical_rating: int
    communication_rating: int
    culture_rating: int
    overall_rating: int
    would_rehire: str
    comments: Optional[str] = ""

@router.post("/record-hire")
async def record_hiring_event(
    req: HiringEventRequest,
    user_id: str = Depends(get_current_user_id)
):
    """Record a new hire for feedback tracking."""
    result = await feedback_service.record_hiring_event(
        candidate_id=req.candidate_id,
        job_id=req.job_id,
        company_id=req.company_id,
        match_percentage=req.match_percentage,
        proof_score=req.proof_score,
    )
    return success_response(data=result)

@router.post("/submit-review")
async def submit_performance_review(
    req: PerformanceReviewRequest,
    user_id: str = Depends(get_current_user_id)
):
    """Submit 90-day review. Affects Proof-Score and platform heuristics."""
    result = await feedback_service.process_performance_review(
        candidate_id=req.candidate_id,
        job_id=req.job_id,
        technical_rating=req.technical_rating,
        communication_rating=req.communication_rating,
        culture_rating=req.culture_rating,
        overall_rating=req.overall_rating,
        would_rehire=req.would_rehire,
        comments=req.comments,
    )
    return success_response(data=result)

@router.get("/pending-reviews")
async def get_pending_reviews(
    company_id: str = Query(...),
    user_id: str = Depends(get_current_user_id)
):
    """Get hires due for review."""
    reviews = await feedback_service.get_pending_reviews(company_id)
    return success_response(data=reviews)
