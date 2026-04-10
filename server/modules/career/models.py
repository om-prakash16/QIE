from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import date, datetime

class CareerTaskBase(BaseModel):
    task_title: str
    status: str = "TODO"
    priority: str = "Medium"
    due_date: Optional[date] = None

class CareerTaskCreate(CareerTaskBase):
    goal_id: UUID

class CareerTask(CareerTaskBase):
    id: UUID
    goal_id: UUID
    created_at: datetime

class CareerGoalBase(BaseModel):
    goal_title: str
    target_role: Optional[str] = None
    deadline: Optional[date] = None
    status: str = "ACTIVE"

class CareerGoalCreate(CareerGoalBase):
    user_id: UUID

class CareerGoal(CareerGoalBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    progress_percentage: float = 0.0
    tasks: List[CareerTask] = []
