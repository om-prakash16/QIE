import os
import json
import uuid
from typing import List, Dict, Any, Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from core.supabase import get_supabase
from modules.ai.models import InterviewQuestionBase, InterviewQuestionCreate

class InterviewService:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        self.llm = ChatGoogleGenerativeAI(
            temperature=0.7, 
            google_api_key=self.api_key, 
            model="gemini-1.5-flash"
        ) if self.api_key else None

    async def generate_questions(self, user_id: str, job_id: str, count: int = 10) -> List[Dict[str, Any]]:
        """
        Generate personalized MCQ interview questions based on candidate profile and job requirements.
        """
        db = get_supabase()
        if not db:
            raise Exception("Database service unavailable")

        # 1. Fetch Candidate Profile
        user_resp = db.table("users").select("profile_data").eq("id", user_id).single().execute()
        user_data = user_resp.data if user_resp.data else {}
        profile = user_data.get("profile_data", {})

        # 2. Fetch Job Requirements
        job_resp = db.table("jobs").select("title, description, skills_required").eq("id", job_id).single().execute()
        job = job_resp.data if job_resp.data else {}

        if not profile or not job:
            raise Exception("Candidate profile or Job not found")

        # 3. Fetch Reputation & Weak Skills
        proof_score = 600
        weak_skills = []
        
        # Get Global Proof Score
        score_resp = db.table("ai_scores").select("proof_score").eq("user_id", user_id).single().execute()
        if score_resp.data:
            proof_score = score_resp.data.get("proof_score", 600)
            
        # Identify Weak Skills (Failed or low score quizzes)
        quiz_resp = db.table("ai_quizzes").select("skill_name, score").eq("user_id", user_id).lt("score", 60).execute()
        if quiz_resp.data:
            weak_skills = list(set([q["skill_name"] for q in quiz_resp.data]))

        # 4. Gap Analysis & Prompt Construction
        skills_candidate = profile.get("skills", [])
        projects_candidate = profile.get("projects", [])
        skills_required = job.get("skills_required", [])
        experience_level = profile.get("experience_years", "Intermediate")
        
        # Scaling difficulty based on Proof Score
        target_difficulty = "Intermediate"
        if proof_score > 750: target_difficulty = "Advanced"
        elif proof_score < 400: target_difficulty = "Beginner"

        # Determine skill gaps
        gaps = [s for s in skills_required if s not in skills_candidate]

        if not self.llm:
            # Mock fallback if Gemini is not available
            return await self._get_mock_questions(user_id, job_id, count)

        prompt = PromptTemplate(
            template="""You are a senior AI technical interviewer for a high-stakes hiring platform.
            
Candidate Profile:
- Skills: {skills_candidate}
- Experience Level: {experience_level}
- Verified Proof Score: {proof_score}/1000

Contextual signals:
- Identified Skill Gaps (Missing): {gaps}
- Identified Weak Skill Areas (Prior low performance): {weak_skills}

Job Requirements:
- Job Title: {job_title}
- Required Skills: {skills_required}

OBJECTIVE:
Generate {count} personalized MCQ interview questions targeting a {target_difficulty} depth.

Distribution Strategy:
- 40% on Weak Skill Areas (to verify improvement).
- 40% on Identified Gaps (to explore potential).
- 20% on verifying high-confidence core skills in the context of {job_title}.

Return ONLY a JSON array of objects with exactly these keys:
- question (string)
- options (array of 4 strings)
- correct_answer (string from the options)
- difficulty (Beginner, Intermediate, Advanced)
""",
            input_variables=["count", "skills_candidate", "proof_score", "job_title", "skills_required", "gaps", "weak_skills", "experience_level", "target_difficulty"]
        )

        try:
            formatted_prompt = prompt.format(
                count=count,
                skills_candidate=", ".join(skills_candidate),
                proof_score=proof_score,
                job_title=job.get("title", "Software Engineer"),
                skills_required=", ".join(skills_required),
                gaps=", ".join(gaps) if gaps else "None",
                weak_skills=", ".join(weak_skills) if weak_skills else "None",
                experience_level=experience_level,
                target_difficulty=target_difficulty
            )
            
            response = self.llm.invoke(formatted_prompt)
            content = response.content.replace('```json', '').replace('```', '').strip()
            questions_data = json.loads(content)

            # 4. Store in Database
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
            print(f"Error generating interview questions: {e}")
            return await self._get_mock_questions(user_id, job_id, count)

    async def save_hr_questions(self, user_id: str, job_id: str, questions: List[InterviewQuestionBase]) -> List[Dict[str, Any]]:
        """
        Manually store questions set by HR.
        """
        db = get_supabase()
        if not db: return []
        
        saved = []
        for q in questions:
            resp = db.table("ai_interview_questions").insert({
                "user_id": user_id,
                "job_id": job_id,
                "question": q.question,
                "options": q.options,
                "correct_answer": q.correct_answer,
                "difficulty": q.difficulty,
                "source": "HR"
            }).execute()
            if resp.data:
                saved.append(resp.data[0])
        return saved

    async def get_questions(self, user_id: str, job_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Retrieve questions for a user and job.
        """
        db = get_supabase()
        if not db: return []
        
        query = db.table("ai_interview_questions").select("*").eq("user_id", user_id)
        if job_id:
            query = query.eq("job_id", job_id)
            
        resp = query.order("created_at", desc=True).execute()
        return resp.data

    async def _get_mock_questions(self, user_id: str, job_id: str, count: int) -> List[Dict[str, Any]]:
        """Fallback mock questions."""
        return [
            {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "job_id": job_id,
                "question": f"Sample Mock Question {i}",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_answer": "Option A",
                "difficulty": "Intermediate",
                "source": "Mock"
            } for i in range(1, count + 1)
        ]
