import os
import json
from typing import Dict, Any, List
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from modules.ai.models import ParsedResume
from modules.notifications.service import NotificationService
from core.supabase import get_supabase

class ResumeService:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        self.llm = ChatGoogleGenerativeAI(
            temperature=0, 
            google_api_key=self.api_key, 
            model="gemini-1.5-flash"
        ) if self.api_key else None
        self.parser = PydanticOutputParser(pydantic_object=ParsedResume)
        self.db = get_supabase()

    async def analyze_resume(self, user_id: str, resume_text: str) -> Dict[str, Any]:
        """
        Processes resume text using LangChain, extracts skills, 
        calculates proof score components, and stores in ai_scores.
        """
        if not self.llm:
            return {"error": "AI service not configured"}

        prompt = PromptTemplate(
            template="""Analyze the following resume for a professional profile.
            1. Extract all technical and soft skills.
            2. Identify the primary role (e.g. Frontend Engineer, Rust Dev).
            3. Calculate a Skill Score (0-100) based on deep knowledge evidence.
            4. Identify 3 critical missing skills for the primary role.
            
            {format_instructions}
            
            Resume Text:
            {resume}
            """,
            input_variables=["resume"],
            partial_variables={"format_instructions": self.parser.get_format_instructions()}
        )

        try:
            _input = prompt.format_prompt(resume=resume_text)
            output = self.llm.invoke(_input.to_messages())
            parsed_data = self.parser.parse(output.content)
            
            # Map ParsedResume fields to Best Hiring Tool score model
            analysis_results = {
                "user_id": user_id,
                "skill_score": parsed_data.skill_score if hasattr(parsed_data, 'skill_score') else 75,
                "primary_role": parsed_data.role if hasattr(parsed_data, 'role') else "Developer",
                "extracted_skills": parsed_data.skills,
                "missing_skills": parsed_data.missing_skills if hasattr(parsed_data, 'missing_skills') else [],
                "ai_recommendations": parsed_data.summary if hasattr(parsed_data, 'summary') else "Keep building projects."
            }

            # Store in ai_scores table (Supabase)
            if self.db:
                self.db.table("ai_scores").upsert(analysis_results, on_conflict="user_id").execute()

            return analysis_results
        except Exception as e:
            print(f"Resume Analysis Error: {e}")
            return {"error": str(e)}

    async def skill_gap_analysis(self, user_id: str, target_job_id: str) -> Dict[str, Any]:
        """
        Compares user's AI-scored profile against a target job listing.
        """
        if not self.db:
            return {"error": "DB not found"}

        # Fetch user score and job requirements
        user_score = self.db.table("ai_scores").select("*").eq("user_id", user_id).single().execute()
        job_data = self.db.table("jobs").select("*").eq("id", target_job_id).single().execute()

        if not user_score.data or not job_data.data:
            return {"error": "Incomplete data for gap analysis"}

        # Perform semantic comparison (can be enhanced with LLM if needed)
        user_skills = set(user_score.data.get("extracted_skills", []))
        job_skills = set(job_data.data.get("required_skills", []))
        
        gaps = list(job_skills - user_skills)
        match_percentage = len(user_skills.intersection(job_skills)) / len(job_skills) * 100 if job_skills else 0

        return {
            "match_percentage": round(match_percentage, 2),
            "missing_skills": gaps,
            "is_qualified": match_percentage >= 70
        }
