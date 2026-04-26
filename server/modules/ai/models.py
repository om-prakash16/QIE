from pydantic import BaseModel, Field
from typing import List


class AIAnalysisRequest(BaseModel):
    user_id: str


class SkillGapRequest(BaseModel):
    user_id: str
    target_role: str


class AIAnalysisResponse(BaseModel):
    strengths: List[str]
    missing_skills: List[str]
    recommendations: List[str]


class AIScoreResponse(BaseModel):
    user_id: str
    skill_score: float
    project_score: float
    experience_score: float
    proof_score: float


class SkillGapResponse(BaseModel):
    missing_skills: List[str]
    learning_roadmap: List[str]


class ParsedResume(BaseModel):
    skills: List[str] = Field(description="List of extracted technical skills")
    soft_skills: List[str] = Field(description="List of extracted soft skills (e.g. Leadership, Communication)")
    role: str = Field(description="Primary professional role identified")
    experience_years: int = Field(description="Total years of professional experience", default=0)
    education: List[str] = Field(description="List of educational degrees and institutions", default=[])
    skill_score: float = Field(description="AI-calculated skill score from 0-100")
    forensic_confidence: float = Field(description="AI confidence score for the verification (0-100)")
    missing_skills: List[str] = Field(
        description="Top 3 missing skills for the identified role"
    )
    summary: str = Field(description="Executive summary and career recommendations")


# --- Interview Prep System Models ---


class InterviewQuestionBase(BaseModel):
    question: str
    options: List[str]
    correct_answer: str
    difficulty: str = "Intermediate"
    source: str = "AI"


class InterviewQuestionCreate(InterviewQuestionBase):
    user_id: str
    job_id: str


class InterviewQuestionResponse(InterviewQuestionBase):
    id: str
    user_id: str
    job_id: str
    created_at: str


class InterviewGenerationRequest(BaseModel):
    user_id: str
    job_id: str
    count: int = 10

class JDMatchResult(BaseModel):
    match_score: float = Field(description="Match percentage between 0 and 100")
    matching_skills: List[str] = Field(description="Skills found in both resume and JD")
    missing_skills: List[str] = Field(description="Required JD skills missing from resume")
    experience_match: str = Field(description="Analysis of how experience aligns with JD")
    project_match: str = Field(description="Analysis of relevant projects and their alignment")
    industry_readiness: str = Field(description="Overall industry-level readiness assessment and recommendations")
