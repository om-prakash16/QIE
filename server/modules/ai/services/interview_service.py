import os
import json
import uuid
import logging
from typing import List, Dict, Any, Optional
import google.generativeai as genai
from core.supabase import get_supabase
from modules.ai.models import InterviewQuestionBase

logger = logging.getLogger(__name__)

class InterviewService:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel("gemini-1.5-flash-latest")
        else:
            self.model = None

    async def generate_questions(
        self, user_id: str, job_id: str, count: int = 10
    ) -> List[Dict[str, Any]]:
        """Generate personalized MCQ interview questions based on candidate profile and job requirements."""
        db = get_supabase()
        if not db:
            raise Exception("Database service unavailable")

        # 1. Fetch Candidate Profile
        user_resp = db.table("users").select("profile_data").eq("id", user_id).single().execute()
        profile = user_resp.data.get("profile_data", {}) if user_resp.data else {}

        # 2. Fetch Job Requirements
        job_resp = db.table("jobs").select("title, description, skills_required").eq("id", job_id).single().execute()
        job = job_resp.data if job_resp.data else {}

        if not profile or not job:
            raise Exception("Candidate profile or Job details not found. Cannot generate questions.")

        # 3. Fetch Proof Score
        score_resp = db.table("ai_scores").select("proof_score").eq("user_id", user_id).single().execute()
        proof_score = score_resp.data.get("proof_score", 600) if score_resp.data else 600

        # Identify Weak Skills
        quiz_resp = db.table("skill_quizzes").select("skill_name").eq("candidate_wallet", profile.get("wallet_address", "")).lt("score", 70).execute()
        weak_skills = list(set([q["skill_name"] for q in quiz_resp.data])) if quiz_resp.data else []

        # 4. Prompt Construction
        skills_candidate = profile.get("skills", [])
        skills_required = job.get("skills_required", [])
        experience_level = profile.get("experience_years", "Intermediate")
        
        target_difficulty = "Intermediate"
        if proof_score > 750: target_difficulty = "Advanced"
        elif proof_score < 400: target_difficulty = "Beginner"

        gaps = [s for s in skills_required if s not in skills_candidate]

        if not self.model:
            raise Exception("AI model not initialized (missing API key)")

        prompt = f"""You are a senior AI technical interviewer.
Candidate Profile:
- Skills: {skills_candidate}
- Experience Level: {experience_level}
- Proof Score: {proof_score}/1000

Context:
- Gaps: {gaps}
- Weak Skills: {weak_skills}

Job: {job.get('title')} - {job.get('skills_required')}

Generate {count} personalized MCQ questions targeting {target_difficulty} depth.
Return ONLY a JSON array of objects:
- question (string)
- options (array of 4 strings)
- correct_answer (string from options)
- difficulty (Beginner, Intermediate, Advanced)
"""

        try:
            response = self.model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            questions_data = json.loads(response.text)

            # Store in DB
            saved_questions = []
            for q_data in questions_data:
                db_resp = db.table("ai_interview_questions").insert({
                    "user_id": user_id,
                    "job_id": job_id,
                    "question": q_data["question"],
                    "options": q_data["options"],
                    "correct_answer": q_data["correct_answer"],
                    "difficulty": q_data["difficulty"],
                    "source": "AI"
                }).execute()
                if db_resp.data:
                    saved_questions.append(db_resp.data[0])

            return saved_questions
        except Exception as e:
            logger.error(f"Interview Question Generation error: {e}")
            raise Exception(f"AI Interview Generation failed: {str(e)}")

    async def get_questions(self, user_id: str, job_id: Optional[str] = None) -> List[Dict[str, Any]]:
        db = get_supabase()
        if not db: return []
        query = db.table("ai_interview_questions").select("*").eq("user_id", user_id)
        if job_id: query = query.eq("job_id", job_id)
        resp = query.order("created_at", desc=True).execute()
        return resp.data

# Singleton instance
interview_service = InterviewService()
