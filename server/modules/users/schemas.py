from pydantic import BaseModel
from typing import Optional, List, Dict

class SkillBase(BaseModel):
    name: str
    category: Optional[str] = None

class UserSkillBase(BaseModel):
    skill_name: str
    proficiency_level: str = "Intermediate"

class ExperienceBase(BaseModel):
    company_name: str
    role: str
    description: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: bool = False

class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    project_url: Optional[str] = None
    github_url: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None

class EducationBase(BaseModel):
    institution: str
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None

class ProfileBase(BaseModel):
    full_name: str
    headline: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    visibility: str = "public"
    user_code: Optional[str] = None

class FullProfileResponse(BaseModel):
    profile: ProfileBase
    skills: List[UserSkillBase]
    experiences: List[ExperienceBase]
    projects: List[ProjectBase]
    education: List[EducationBase]
    ai_scores: Optional[Dict[str, int]] = None
