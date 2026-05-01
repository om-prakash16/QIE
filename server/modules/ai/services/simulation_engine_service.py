import os
import json
import logging
import hashlib
from typing import Dict, Any, List, Optional
from datetime import datetime

from core.supabase import get_supabase
from core.exceptions import ExternalServiceError, NotFoundError
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate

logger = logging.getLogger(__name__)

class SimulationEngineService:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        self.llm = (
            ChatGoogleGenerativeAI(
                temperature=0.2, google_api_key=self.api_key, model="gemini-1.5-flash"
            )
            if self.api_key
            else None
        )

    # ... (Keep TASK_TEMPLATES and detect_role_from_job as useful defaults)
    TASK_TEMPLATES = {
        "backend": {
            "title": "Build a REST API Endpoint",
            "description": "Create a FastAPI/Express endpoint that accepts a JSON payload of user registration data, validates all fields (name, email, password strength), hashes the password, and returns a mocked JWT token. Include proper error handling and rate-limiting middleware.",
            "boilerplate": "A starter project with FastAPI installed, a blank `main.py`, and `requirements.txt`.",
            "time_limit_minutes": 60,
            "acceptance_criteria": ["POST /register endpoint accepts JSON body", "Validates email format", "Returns JWT", "Includes middleware"]
        },
        # ... (Other templates)
    }

    def detect_role_from_job(self, job_title: str, job_description: str, required_skills: List[str]) -> str:
        combined = f"{job_title} {job_description} {' '.join(required_skills)}".lower()
        if any(kw in combined for kw in ["solana", "anchor", "smart contract"]): return "smart_contract"
        if any(kw in combined for kw in ["data scien", "machine learning"]): return "data_science"
        if any(kw in combined for kw in ["react", "frontend", "ui"]): return "frontend"
        if any(kw in combined for kw in ["docker", "kubernetes", "devops"]): return "devops"
        return "backend"

    async def generate_simulation(self, wallet: str, job_title: str, job_description: str, required_skills: List[str]) -> Dict[str, Any]:
        """Generate a simulation task and store session in DB."""
        role = self.detect_role_from_job(job_title, job_description, required_skills)
        template = self.TASK_TEMPLATES.get(role, self.TASK_TEMPLATES["backend"])
        
        sim_id = f"sim_{hashlib.md5(f'{wallet}{job_title}{datetime.utcnow()}'.encode()).hexdigest()[:12]}"
        
        db = get_supabase()
        if db:
            try:
                db.table("simulation_sessions").insert({
                    "id": sim_id,
                    "candidate_wallet": wallet,
                    "role": role,
                    "task_title": template["title"],
                    "started_at": datetime.utcnow().isoformat(),
                    "time_limit_minutes": template["time_limit_minutes"]
                }).execute()
            except Exception as e:
                logger.error(f"Failed to store simulation session: {e}")

        return {
            "simulation_id": sim_id,
            "detected_role": role,
            "task": template,
            "started_at": datetime.utcnow().isoformat()
        }

    async def evaluate_submission(self, wallet: str, simulation_id: str, submitted_code: str) -> Dict[str, Any]:
        """Evaluate submission using AI for deep code analysis."""
        if not self.llm:
            logger.warning("AI evaluator not configured. Falling back to heuristic scoring.")
            return self._heuristic_evaluate(simulation_id, submitted_code)

        prompt = PromptTemplate(
            template="""Evaluate the following technical submission for a {role} simulation.
            
            Task Description: {description}
            Acceptance Criteria: {criteria}
            
            Submitted Code:
            {code}
            
            Return ONLY a valid JSON object with:
            - composite_score: 0-100
            - dimensions: {{ "code_quality": 0-100, "problem_solving": 0-100, "performance": 0-100, "security": 0-100 }}
            - feedback: {{ "strengths": [], "improvements": [] }}
            - passed: boolean (threshold 65)
            """,
            input_variables=["role", "description", "criteria", "code"],
        )

        db = get_supabase()
        role = "backend"
        desc = "General Backend Task"
        crit = "Functionality and Clean Code"

        if db:
            res = db.table("simulation_sessions").select("*").eq("id", simulation_id).single().execute()
            if res.data:
                role = res.data.get("role", "backend")
                template = self.TASK_TEMPLATES.get(role, {})
                desc = template.get("description", desc)
                crit = ", ".join(template.get("acceptance_criteria", []))

        try:
            result = self.llm.invoke(prompt.format(role=role, description=desc, criteria=crit, code=submitted_code[:10000]))
            content = result.content.strip()
            if "```json" in content: content = content.split("```json")[1].split("```")[0].strip()
            
            eval_data = json.loads(content)
            
            # Persist evaluation
            if db:
                db.table("simulation_sessions").update({
                    "submitted_code": submitted_code,
                    "completed_at": datetime.utcnow().isoformat(),
                    "score": eval_data["composite_score"],
                    "passed": eval_data["passed"],
                    "evaluation_data": eval_data
                }).eq("id", simulation_id).execute()

            return eval_data
        except Exception as e:
            logger.error(f"AI Evaluation failed: {e}")
            return self._heuristic_evaluate(simulation_id, submitted_code)

    def _heuristic_evaluate(self, simulation_id: str, code: str) -> Dict[str, Any]:
        # Fallback to the original logic if LLM fails
        lines = code.split("\n")
        score = min(100, 40 + len(lines) // 2 + (10 if "async" in code else 0))
        return {
            "composite_score": score,
            "passed": score >= 65,
            "dimensions": {"code_quality": score, "problem_solving": score},
            "feedback": {"strengths": ["Code submitted"], "improvements": ["AI evaluator was offline"]},
            "heuristic": True
        }

# Singleton
simulation_service = SimulationEngineService()
