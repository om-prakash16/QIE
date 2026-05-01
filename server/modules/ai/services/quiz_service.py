import os
import json
import uuid
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from core.supabase import get_supabase
from core.exceptions import NotFoundError, ValidationError, ExternalServiceError

logger = logging.getLogger(__name__)

class QuizService:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        self.llm = (
            ChatGoogleGenerativeAI(
                temperature=0.7, google_api_key=self.api_key, model="gemini-1.5-flash"
            )
            if self.api_key
            else None
        )

    async def generate_quiz_session(
        self, wallet: str, skill: str, difficulty: str = "intermediate", count: int = 10
    ) -> Dict[str, Any]:
        """
        Generates a new AI quiz session and stores it in the database.
        Returns the quiz for the frontend (without correct answers).
        """
        if not self.llm:
            logger.warning("Gemini API not configured. Falling back to base questions.")
            questions = self._get_fallback_questions(skill, count)
        else:
            questions = await self._generate_ai_questions(skill, difficulty, count)

        db = get_supabase()
        if not db:
            raise ExternalServiceError("Database unavailable for quiz generation")

        quiz_id = str(uuid.uuid4())
        
        # Store quiz with correct answers
        try:
            db.table("skill_quizzes").insert({
                "id": quiz_id,
                "candidate_wallet": wallet,
                "skill_name": skill,
                "difficulty": difficulty,
                "questions": questions,
                "started_at": datetime.utcnow().isoformat(),
                "time_limit_minutes": 15
            }).execute()
        except Exception as e:
            logger.error(f"Failed to store quiz session: {e}")
            raise ExternalServiceError("Failed to initiate quiz session")

        # Strip correct answers before returning to client
        safe_questions = [
            {"id": q["id"], "text": q["text"], "options": q["options"]} 
            for q in questions
        ]

        return {
            "quiz_id": quiz_id,
            "skill": skill,
            "difficulty": difficulty,
            "questions": safe_questions,
            "time_limit_minutes": 15
        }

    async def _generate_ai_questions(self, skill: str, difficulty: str, count: int) -> List[Dict[str, Any]]:
        prompt = PromptTemplate(
            template="""Generate {count} unique multiple choice questions to assess {skill} at {difficulty} level.
            Return ONLY a valid JSON array of objects with exactly these keys:
            - id: "q1", "q2", etc.
            - text: The question text
            - options: List of 4 options like ["A) ...", "B) ...", "C) ...", "D) ..."]
            - correct: The letter of the correct option ("A", "B", "C", or "D")
            """,
            input_variables=["count", "skill", "difficulty"],
        )

        try:
            result = self.llm.invoke(prompt.format(count=count, skill=skill, difficulty=difficulty))
            content = result.content.strip()
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            return json.loads(content)
        except Exception as e:
            logger.error(f"AI Quiz Generation failed for {skill}: {e}")
            return self._get_fallback_questions(skill, count)

    def _get_fallback_questions(self, skill: str, count: int) -> List[Dict[str, Any]]:
        # Minimal set of hardcoded questions as extreme fallback
        return [
            {
                "id": f"q{i}",
                "text": f"Which of the following is a core principle of {skill} (Question {i})?",
                "options": ["A) Encapsulation", "B) Performance", "C) Security", "D) All of the above"],
                "correct": "D"
            } for i in range(1, count + 1)
        ]

    async def evaluate_submission(
        self, quiz_id: str, wallet: str, answers: Dict[str, str]
    ) -> Dict[str, Any]:
        """
        Evaluates a submitted quiz, checks time limits, and calculates score.
        """
        db = get_supabase()
        if not db:
            raise ExternalServiceError("Database unavailable for evaluation")

        res = db.table("skill_quizzes").select("*").eq("id", quiz_id).eq("candidate_wallet", wallet).single().execute()
        if not res.data:
            raise NotFoundError("Quiz session not found")

        quiz = res.data
        if quiz.get("completed_at"):
            raise ValidationError("Quiz already submitted")

        # Time check
        started_at = datetime.fromisoformat(quiz["started_at"].replace("Z", "+00:00"))
        time_limit = timedelta(minutes=quiz.get("time_limit_minutes", 15))
        now = datetime.utcnow().replace(tzinfo=started_at.tzinfo)
        
        # Buffer of 1 minute for network latency
        if now > (started_at + time_limit + timedelta(minutes=1)):
             logger.warning(f"Quiz {quiz_id} submitted after deadline by {wallet}")
             # We still evaluate but could mark as 'timed out' or penalize

        questions = quiz["questions"]
        correct = 0
        total = len(questions)
        
        for q in questions:
            user_ans = answers.get(q["id"], "").upper()
            if user_ans == q["correct"].upper() or user_ans == q["options"][ord(q["correct"]) - 65][0]:
                # Handles both "A" and "A) Option" formats
                correct += 1

        score = int((correct / total) * 100) if total > 0 else 0
        passed = score >= 75
        
        level = "Bronze"
        if score >= 95: level = "Platinum"
        elif score >= 85: level = "Gold"
        elif score >= 75: level = "Silver"

        # Update record
        try:
            db.table("skill_quizzes").update({
                "score": score,
                "passed": passed,
                "completed_at": datetime.utcnow().isoformat(),
                "answers": answers
            }).eq("id", quiz_id).execute()
        except Exception as e:
            logger.error(f"Failed to update quiz result: {e}")

        return {
            "quiz_id": quiz_id,
            "score": score,
            "passed": passed,
            "level": level,
            "correct_count": correct,
            "total_questions": total,
            "message": "Congratulations!" if passed else "Keep practicing."
        }

# Singleton
quiz_service = QuizService()
