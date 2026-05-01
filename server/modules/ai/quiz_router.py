from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from typing import Dict, Optional

from core.response import success_response
from core.dependencies import get_db, get_validated_wallet
from modules.ai.services.quiz_service import quiz_service

router = APIRouter()

class QuizRequest(BaseModel):
    skill: str
    difficulty: str = "intermediate"
    question_count: int = 10

class QuizSubmission(BaseModel):
    quiz_id: str
    answers: Dict[str, str]  # { "q1": "A", "q2": "C" }

@router.post("/generate")
async def generate_quiz(
    data: QuizRequest,
    wallet: str = Depends(get_validated_wallet)
):
    """
    Generate an AI-powered skill assessment quiz.
    Stores the session in the database with a 15-minute time limit.
    """
    result = await quiz_service.generate_quiz_session(
        wallet=wallet,
        skill=data.skill,
        difficulty=data.difficulty,
        count=data.question_count
    )
    return success_response(data=result)

@router.post("/evaluate")
async def evaluate_quiz(
    data: QuizSubmission,
    wallet: str = Depends(get_validated_wallet)
):
    """
    Evaluate quiz answers and determine if the candidate passed.
    Enforces time limits and authenticates the wallet.
    """
    result = await quiz_service.evaluate_submission(
        quiz_id=data.quiz_id,
        wallet=wallet,
        answers=data.answers
    )
    return success_response(data=result)

@router.get("/history")
async def quiz_history(
    wallet: str = Depends(get_validated_wallet)
):
    """
    Get all quiz attempts for the authenticated wallet.
    """
    db = await get_db()
    
    response = (
        db.table("skill_quizzes")
        .select("id, skill_name, score, passed, difficulty, completed_at")
        .eq("candidate_wallet", wallet)
        .order("completed_at", desc=True)
        .execute()
    )
    
    return success_response(data=response.data)
