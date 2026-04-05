import os
import io
from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from typing import List, Dict, Any
import PyPDF2

from app.ai_engine.models import (
    MatchRequest, 
    ParsedResume, 
    MatchResult, 
    QuizRequest, 
    QuizSubmission
)
from app.ai_engine.services.analyzer import ResumeAnalyzer
from app.ai_engine.services.matcher import JobMatcher
from app.ai_engine.services.gap_analyzer import SkillGapAnalyzer
from app.ai_engine.services.quiz_service import QuizService
from app.ai_engine.services.github_evaluator import GitHubEvaluator
from app.ai_engine.services.scoring_service import ProofScoreService
from app.ai_engine.services.recommender import CareerRecommender

router = APIRouter()

# Service Initializations
analyzer = ResumeAnalyzer()
matcher = JobMatcher()
gap_analyzer = SkillGapAnalyzer()
quiz_service = QuizService()
github_evaluator = GitHubEvaluator()
score_service = ProofScoreService()
recommender = CareerRecommender()

@router.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
    try:
        content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        resume_text = ""
        for page in pdf_reader.pages:
            resume_text += page.extract_text() + "\n"
        
        result = await analyzer.analyze(resume_text)
        return {"status": "success", "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/match-jobs")
async def match_jobs(data: MatchRequest):
    # Mock job list for demo
    mock_jobs = [
        {"id": "1", "title": "Senior Solana Developer", "description": "Build DeFi protocols", "requirements": "Rust, Solana, Anchor"},
        {"id": "2", "title": "Fullstack Next.js Engineer", "description": "Build high-performance UIs", "requirements": "Next.js, TypeScript, Tailwind"}
    ]
    results = await matcher.match({"skills": data.profile_skills}, mock_jobs)
    return {"status": "success", "matches": results}

@router.post("/skill-gap")
async def skill_gap(data: Dict[str, Any]):
    profile = data.get("profile", {})
    target_role = data.get("target_role", "Senior Developer")
    result = await gap_analyzer.analyze_gap(profile, target_role)
    return {"status": "success", "result": result}

@router.post("/generate-quiz")
async def generate_quiz(data: QuizRequest):
    questions = await quiz_service.generate_quiz(data.skill, data.difficulty, data.question_count)
    return {"status": "success", "questions": questions}

@router.post("/evaluate-quiz")
async def evaluate_quiz(data: QuizSubmission):
    # In a real app, you'd fetch the quiz_data from DB by quiz_id
    # Mocking quiz_data for evaluation demo
    mock_quiz_data = [
        {"id": "q1", "correct": "C"},
        {"id": "q2", "correct": "B"}
    ]
    result = await quiz_service.evaluate(data.answers, mock_quiz_data)
    return {"status": "success", "result": result}

@router.get("/github-score")
async def get_github_score(username: str):
    result = await github_evaluator.get_user_score(username)
    return {"status": "success", "result": result}

@router.get("/proof-score")
async def get_proof_score(wallet: str):
    # Mock sub-scores for calculation demo
    scores = {
        "skill_score": 85.0,
        "github_score": 72.0,
        "project_score": 90.0
    }
    result = await score_service.calculate_proof_score(scores)
    return {"status": "success", "result": result}

@router.post("/career-path")
async def career_path(data: Dict[str, Any]):
    profile = data.get("profile", {})
    result = await recommender.recommend(profile)
    return {"status": "success", "result": result}
