from fastapi import APIRouter, Depends, Query, HTTPException
from typing import List, Dict, Any, Optional

from core.response import success_response
from core.dependencies import get_db, get_current_user_id
from modules.ai.services.interview_service import interview_service
from modules.ai.models import InterviewGenerationRequest, InterviewQuestionBase

router = APIRouter()

@router.post("/generate-interview-questions")
async def generate_interview_questions(
    req: InterviewGenerationRequest,
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Generate personalized MCQ interview questions based on candidate profile and job requirements.
    """
    try:
        questions = await interview_service.generate_questions(
            user_id=req.user_id, job_id=req.job_id, count=req.count
        )
        return success_response(data=questions)
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"Interview generation failed: {e}")
        return success_response(data={"error": "Failed to generate questions"}, status_code=500)

@router.post("/set-interview-questions")
async def set_interview_questions(
    user_id: str,
    job_id: str,
    questions: List[InterviewQuestionBase],
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Allow HR to manually set MCQ questions for a candidate.
    """
    # TODO: Add role-based check (only COMPANY/HR)
    try:
        saved_questions = await interview_service.save_hr_questions(
            user_id=user_id, job_id=job_id, questions=questions
        )
        return success_response(data=saved_questions)
    except Exception as e:
        return success_response(data={"error": str(e)}, status_code=500)

@router.get("/interview-questions")
async def get_interview_questions(
    user_id: str = Query(..., description="The candidate's user ID"),
    job_id: Optional[str] = Query(None, description="The job ID to filter by"),
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Retrieve interview questions for a candidate.
    """
    questions = await interview_service.get_questions(
        user_id=user_id, job_id=job_id
    )
    return success_response(data=questions, meta={"count": len(questions)})
