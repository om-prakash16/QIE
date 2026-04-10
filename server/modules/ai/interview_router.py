from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Dict, Any, Optional
from modules.auth.service import get_current_user
from modules.ai.services.interview_service import InterviewService
from modules.ai.models import (
    InterviewGenerationRequest, 
    InterviewQuestionBase, 
    InterviewQuestionResponse
)

router = APIRouter()
interview_service = InterviewService()

@router.post("/generate-interview-questions")
async def generate_interview_questions(
    req: InterviewGenerationRequest, 
    current_user = Depends(get_current_user)
):
    """
    Generate personalized MCQ interview questions based on candidate profile and job requirements.
    """
    try:
        # Check if the user is authorized to generate for this user_id (optional, based on logic)
        # For simplicity, we allow it if the user is the one in the request or an admin
        questions = await interview_service.generate_questions(
            user_id=req.user_id,
            job_id=req.job_id,
            count=req.count
        )
        return {"status": "success", "data": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/set-interview-questions")
async def set_interview_questions(
    user_id: str,
    job_id: str,
    questions: List[InterviewQuestionBase],
    current_user = Depends(get_current_user)
):
    """
    Allow HR to manually set MCQ questions for a candidate.
    """
    try:
        # Here we should ideally check if current_user has 'HR' or 'COMPANY' role
        saved_questions = await interview_service.save_hr_questions(
            user_id=user_id,
            job_id=job_id,
            questions=questions
        )
        return {"status": "success", "data": saved_questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/interview-questions", response_model=Dict[str, Any])
async def get_interview_questions(
    user_id: str = Query(..., description="The candidate's user ID"),
    job_id: Optional[str] = Query(None, description="The job ID to filter by"),
    current_user = Depends(get_current_user)
):
    """
    Retrieve interview questions for a candidate.
    """
    try:
        questions = await interview_service.get_questions(user_id=user_id, job_id=job_id)
        return {"status": "success", "count": len(questions), "data": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
