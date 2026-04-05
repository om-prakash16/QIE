from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class MatchRequest(BaseModel):
    profile_skills: List[str]
    job_description: str

class ParsedResume(BaseModel):
    skills: List[str] = Field(description="List of technical skills extracted")
    experience_years: int = Field(description="Total years of professional experience")
    roles: List[str] = Field(description="Job titles previously held")
    education: List[str] = Field(description="Degrees and universities")

class MatchResult(BaseModel):
    match_score: int = Field(description="Match score out of 100 based on skill overlap")
    missing_skills: List[str] = Field(description="Skills required by the job that the candidate lacks")

class QuizRequest(BaseModel):
    skill: str
    difficulty: str = "intermediate"
    question_count: int = 10
    wallet_address: str

class QuizSubmission(BaseModel):
    quiz_id: str
    answers: Dict[str, str]
    wallet_address: str

class ProofScoreResponse(BaseModel):
    wallet_address: str
    total_score: int
    breakdown: Dict[str, float]
    level: str
