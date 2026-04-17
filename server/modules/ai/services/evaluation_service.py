import os
import json
from typing import List, Dict, Any, Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from modules.ai.models import AIAnalysisResponse, SkillGapResponse, AIScoreResponse
from core.supabase import get_supabase

class EvaluationService:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        self.llm = ChatGoogleGenerativeAI(
            temperature=0.2, 
            google_api_key=self.api_key, 
            model="gemini-1.5-flash"
        ) if self.api_key else None

    async def analyze_resume(self, profile_data: Dict[str, Any]) -> AIAnalysisResponse:
        """
        Resume Analysis.
        Extracts strengths, gaps, and recommendations from structured profile data.
        """
        if not self.llm:
            return AIAnalysisResponse(
                strengths=["Python", "SQL"],
                missing_skills=["Docker", "Kubernetes"],
                recommendations=["Build a containerized project", "Learn cloud orchestration"]
            )

        prompt = PromptTemplate(
            template="""Analyze the following candidate profile and provide strategic career insights.
            
            Profile:
            Skills: {skills}
            Experience: {experience}
            Projects: {projects}
            Education: {education}
            
            Return a JSON object only with exactly these keys:
            - strengths (list of strings)
            - missing_skills (list of strings)
            - recommendations (list of strings)
            """,
            input_variables=["skills", "experience", "projects", "education"]
        )

        try:
            formatted_prompt = prompt.format(
                skills=", ".join(profile_data.get("skills", [])),
                experience=json.dumps(profile_data.get("experience", [])),
                projects=json.dumps(profile_data.get("projects", [])),
                education=json.dumps(profile_data.get("education", []))
            )
            response = self.llm.invoke(formatted_prompt)
            # Remove markdown code blocks if any
            content = response.content.replace('```json', '').replace('```', '').strip()
            data = json.loads(content)
            return AIAnalysisResponse(**data)
        except Exception as e:
            print(f"AI Analysis Error: {e}")
            return AIAnalysisResponse(strengths=[], missing_skills=[], recommendations=[])

    async def calculate_skill_score(self, skills: List[str]) -> float:
        """
        Skill Score Calculation (0-100).
        """
        if not skills: return 0.0
        # Basic heuristic: breadth and known high-value skill presence
        score = min(len(skills) * 8, 100)
        return float(score)

    async def calculate_proof_score(self, user_id: str, profile_data: Dict[str, Any]) -> AIScoreResponse:
        """
        Proof Score (Important).
        Formula: 0.4 * skill_score + 0.3 * project_score + 0.3 * experience_score.
        """
        # Calculate individual components (0-100)
        skill_score = await self.calculate_skill_score(profile_data.get("skills", []))
        
        # Project complexity heuristic
        projects = profile_data.get("projects", [])
        project_score = min(len(projects) * 20, 100) if projects else 0.0
        
        # Experience level heuristic
        experience = profile_data.get("experience", [])
        experience_score = min(len(experience) * 15, 100) if experience else 0.0

        # Weighted calculation
        proof_score = (0.4 * skill_score) + (0.3 * project_score) + (0.3 * experience_score)
        proof_score = round(proof_score, 2)

        # Persistence (SECTION 7 & 9)
        db = get_supabase()
        if db:
            # 1. Update latest state
            db.table("ai_scores").upsert({
                "user_id": user_id,
                "skill_score": skill_score,
                "project_score": project_score,
                "experience_score": experience_score,
                "proof_score": proof_score,
                "updated_at": "now()"
            }).execute()
            
            # 2. Log History Snapshot for Growth Tracking
            db.table("ai_score_history").insert({
                "user_id": user_id,
                "skill_score": skill_score,
                "project_score": project_score,
                "experience_score": experience_score,
                "proof_score": proof_score
            }).execute()

        return AIScoreResponse(
            user_id=user_id,
            skill_score=skill_score,
            project_score=project_score,
            experience_score=experience_score,
            proof_score=proof_score
        )

    async def skill_gap_analysis(self, profile_data: Dict[str, Any], target_role: str) -> SkillGapResponse:
        """
        Skill Gap Analysis.
        """
        if not self.llm:
            return SkillGapResponse(missing_skills=["FastAPI", "Docker"], learning_roadmap=["Watch FastAPI tutorials", "Study Docker networking"])

        prompt = PromptTemplate(
            template="""Compare candidate skills against the standard for a {target_role}.
            Skills: {skills}
            
            Return JSON only:
            - missing_skills (list)
            - learning_roadmap (list)
            """,
            input_variables=["target_role", "skills"]
        )

        try:
            response = self.llm.invoke(prompt.format(
                target_role=target_role,
                skills=", ".join(profile_data.get("skills", []))
            ))
            content = response.content.replace('```json', '').replace('```', '').strip()
            data = json.loads(content)
            return SkillGapResponse(**data)
        except Exception as e:
            return SkillGapResponse(missing_skills=[], learning_roadmap=[])
