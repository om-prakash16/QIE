import os
import json
import uuid
from typing import List, Dict, Any, Optional
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from datetime import datetime

class QuizService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.llm = ChatOpenAI(temperature=0.7, api_key=self.api_key, model="gpt-4o-mini") if self.api_key else None

    async def generate_quiz(self, skill: str, difficulty: str = "intermediate", count: int = 5) -> List[Dict[str, Any]]:
        """
        Generates dynamic multiple-choice questions for the quiz.
        """
        if not self.llm:
            # Mock questions fallback
            return [
                {"id": "q1", "text": f"What is a key concept in {skill}?", "options": ["A) X", "B) Y", "C) Z", "D) W"], "correct": "C"},
                {"id": "q2", "text": f"How do you handle error in {skill}?", "options": ["A) A", "B) B", "C) C", "D) D"], "correct": "B"}
            ]

        prompt = PromptTemplate(
            template="""Generate {count} multiple choice questions to assess {skill} at {difficulty} level.
Return ONLY a JSON array with this format:
[{{"id": "q1", "text": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": "C"}}]""",
            input_variables=["count", "skill", "difficulty"]
        )

        try:
            result = self.llm.invoke(prompt.format(count=count, skill=skill, difficulty=difficulty))
            return json.loads(result.content)
        except Exception:
            return []

    async def evaluate(self, user_answers: Dict[str, str], quiz_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Evaluates quiz results and determines passing status.
        """
        correct = 0
        total = len(quiz_data)
        
        for q in quiz_data:
            if user_answers.get(q["id"]) == q["correct"]:
                correct += 1
                
        score = int((correct / total) * 100) if total > 0 else 0
        passed = score >= 75
        
        return {
            "score": score,
            "passed": passed,
            "correct_count": correct,
            "total_questions": total,
            "nft_mint_ready": passed
        }
