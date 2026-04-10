from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class UserSkillBase(BaseModel):
    skill_name: str
    proficiency_level: int = 1

class UserSkillCreate(UserSkillBase):
    pass

class UserSkill(UserSkillBase):
    id: UUID
    user_id: UUID
    is_verified: bool
    verification_hash: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class VerificationStatus(BaseModel):
    is_verified: bool
    verified_at: Optional[datetime]
    verified_by: Optional[UUID]
    verification_method: Optional[str]
