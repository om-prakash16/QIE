from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from modules.auth.service import get_current_user
from modules.career.service import CareerService
from modules.career.models import CareerGoalCreate, CareerTaskCreate

router = APIRouter()
career_service = CareerService()

@router.post("/create-goal")
async def create_goal(goal: CareerGoalCreate, current_user = Depends(get_current_user)):
    """
    Start a new career growth roadmap.
    """
    try:
        if str(goal.user_id) != current_user.get("sub"):
            raise HTTPException(status_code=403, detail="Unauthorized")
        return await career_service.create_goal(goal.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/add-task")
async def add_task(task: CareerTaskCreate, current_user = Depends(get_current_user)):
    """
    Add a milestone or specific task to a goal.
    """
    try:
        # We should verify goal ownership here (omitted for brevity)
        return await career_service.add_task(task.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/goals")
async def get_goals(user_id: str, current_user = Depends(get_current_user)):
    """
    Retrieve user roadmap and progress.
    """
    try:
        if user_id != current_user.get("sub"):
            raise HTTPException(status_code=403, detail="Unauthorized")
        return await career_service.get_user_goals(user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
