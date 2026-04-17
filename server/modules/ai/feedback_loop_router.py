"""
Hiring Feedback Learning Loop Router.
Endpoints for recording hires, submitting reviews, and tracking model improvement.
"""
from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from typing import Optional
from modules.auth.service import get_current_user
from modules.ai.services.feedback_loop_service import FeedbackLoopService

router = APIRouter()
feedback_service = FeedbackLoopService()


class HiringEventRequest(BaseModel):
    candidate_id: str
    job_id: str
    company_id: str
    match_percentage: float
    proof_score: int


class PerformanceReviewRequest(BaseModel):
    candidate_id: str
    job_id: str
    technical_rating: int  # 1-5
    communication_rating: int  # 1-5
    culture_rating: int  # 1-5
    overall_rating: int  # 1-5
    would_rehire: str  # "absolutely", "probably", "no"
    comments: Optional[str] = ""


@router.post("/record-hire")
async def record_hiring_event(
    req: HiringEventRequest,
    current_user=Depends(get_current_user)
):
    """Record a new hire for 90-day feedback tracking."""
    return feedback_service.record_hiring_event(
        candidate_id=req.candidate_id,
        job_id=req.job_id,
        company_id=req.company_id,
        match_percentage=req.match_percentage,
        proof_score=req.proof_score
    )


@router.post("/submit-review")
async def submit_performance_review(
    req: PerformanceReviewRequest,
    current_user=Depends(get_current_user)
):
    """Submit 90-day performance review. Updates Proof-Score and triggers model training."""
    return feedback_service.process_performance_review(
        candidate_id=req.candidate_id,
        job_id=req.job_id,
        technical_rating=req.technical_rating,
        communication_rating=req.communication_rating,
        culture_rating=req.culture_rating,
        overall_rating=req.overall_rating,
        would_rehire=req.would_rehire,
        comments=req.comments
    )


@router.get("/pending-reviews")
async def get_pending_reviews(
    company_id: str = Query(..., description="Company ID"),
    current_user=Depends(get_current_user)
):
    """Get all hires due for 90-day performance review."""
    return {"pending_reviews": feedback_service.get_pending_reviews(company_id)}
