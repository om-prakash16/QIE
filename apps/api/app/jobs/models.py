from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime

class CompanyBase(BaseModel):
    name: str
    website: Optional[str] = None
    industry: Optional[str] = None
    company_size: Optional[str] = None
    location: Optional[str] = None
    logo_url: Optional[str] = None
    about_company: Optional[str] = None

class CompanyCreate(CompanyBase):
    pass

class CompanyResponse(CompanyBase):
    id: str
    owner_wallet: str
    is_verified: bool
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class JobBase(BaseModel):
    title: str
    description: str
    required_skills: List[str] = []
    experience_level: Optional[str] = None
    salary_range: Optional[str] = None
    job_type: str = "remote" # remote | onsite | hybrid
    employment_type: str = "full-time" # full-time | part-time | contract | internship
    deadline: Optional[datetime] = None
    min_reputation_score: int = 0
    dynamic_fields: Dict[str, Any] = {}

class JobCreate(JobBase):
    company_id: str

class JobResponse(JobBase):
    id: str
    company_id: str
    is_active: bool
    solana_job_pda: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ApplicationBase(BaseModel):
    job_id: str
    candidate_wallet: str

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationResponse(ApplicationBase):
    id: str
    status: str # applied | shortlisted | interview | hired | rejected
    ai_match_score: float
    solana_app_pda: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class JobSchemaFieldResponse(BaseModel):
    id: str
    label: str
    key: str
    field_type: str
    required: bool
    section_name: str
    display_order: int

    class Config:
        from_attributes = True
