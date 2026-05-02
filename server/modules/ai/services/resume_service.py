import os
import json
from typing import List, Dict, Any
from core.supabase import get_supabase
import google.generativeai as genai
from modules.ai.models import ParsedResume, JDMatchResult


class ResumeService:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel("gemini-1.5-flash-latest")
        else:
            self.model = None
            
        self.db = get_supabase()

    async def analyze_resume(self, user_id: str, resume_text: str) -> Dict[str, Any]:
        """
        Processes resume text using LangChain, extracts skills,
        calculates proof score components, and stores in ai_scores.
        """
        if not self.model:
            return {"error": "AI service not configured"}

        prompt = f"""Analyze the following resume for a professional profile.
        
        Fields to extract:
        - skills: List of extracted technical skills
        - soft_skills: List of extracted soft skills (e.g. Leadership, Communication)
        - role: Primary professional role identified
        - experience_years: Total years of professional experience (integer)
        - education: List of educational degrees and institutions
        - skill_score: AI-calculated skill score from 0-100
        - forensic_confidence: AI confidence score for the verification (0-100)
        - missing_skills: Top 3 missing skills for the identified role
        - summary: Executive summary and career recommendations

        Return ONLY a JSON object.

        Resume Text:
        {resume_text}
        """

        try:
            response = self.model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            output_text = response.text
            parsed_data = json.loads(output_text)

            # Map ParsedResume fields to Best Hiring Tool score model
            analysis_results = {
                "user_id": user_id,
                "skill_score": parsed_data.get("skill_score", 75),
                "forensic_confidence": parsed_data.get("forensic_confidence", 80),
                "primary_role": parsed_data.get("role", "Developer"),
                "extracted_skills": parsed_data.get("skills", []),
                "soft_skills": parsed_data.get("soft_skills", []),
                "missing_skills": parsed_data.get("missing_skills", []),
                "ai_recommendations": parsed_data.get("summary", "Keep building projects."),
                "experience_years": parsed_data.get("experience_years", 0),
                "education": parsed_data.get("education", []),
            }

            # Store in ai_scores table (Supabase)
            try:
                if self.db:
                    self.db.table("ai_scores").upsert(
                        analysis_results, on_conflict="user_id"
                    ).execute()
            except Exception as db_err:
                print(f"Database Save Warning: {db_err}")
                # We continue because the user still wants to see their results in the UI

            return analysis_results
        except Exception as e:
            print(f"Resume Analysis Error: {e}")
            return {"error": str(e)}

    async def skill_gap_analysis(
        self, user_id: str, target_job_id: str
    ) -> Dict[str, Any]:
        """
        Compares user's AI-scored profile against a target job listing.
        """
        if not self.db:
            return {"error": "DB not found"}

        # Fetch user score and job requirements
        user_score = (
            self.db.table("ai_scores")
            .select("*")
            .eq("user_id", user_id)
            .single()
            .execute()
        )
        job_data = (
            self.db.table("jobs").select("*").eq("id", target_job_id).single().execute()
        )

        if not user_score.data or not job_data.data:
            return {"error": "Incomplete data for gap analysis"}

        # Perform semantic comparison (can be enhanced with LLM if needed)
        user_skills = set(user_score.data.get("extracted_skills", []))
        job_skills = set(job_data.data.get("required_skills", []))

        gaps = list(job_skills - user_skills)
        match_percentage = (
            len(user_skills.intersection(job_skills)) / len(job_skills) * 100
            if job_skills
            else 0
        )

        return {
            "match_percentage": round(match_percentage, 2),
            "missing_skills": gaps,
            "is_qualified": match_percentage >= 70,
        }

    async def parse_job_description(self, jd_text: str) -> Dict[str, Any]:
        """
        Extracts structured job details (title, skills, description) from raw text.
        """
        if not self.model:
            return {"error": "AI service not configured"}

        prompt = f"""
        Extract structured information from the following Job Description text.
        
        Fields to extract:
        - title: A professional job title (e.g. Senior Backend Engineer)
        - skills: A list of 5-10 specific technical skills (e.g. ["Python", "FastAPI"])
        - description: A clean, structured version of the JD text (remove redundant headers).
        - experience_level: One of: "Entry Level", "Mid Level", "Senior Level", "Director"
        - job_type: One of: "Full-time", "Part-time", "Contract", "Freelance"
        
        Return ONLY a JSON object.
        
        JD Text:
        {jd_text}
        """

        try:
            response = self.model.generate_content(prompt)
            output_text = response.text
            
            if "```json" in output_text:
                output_text = output_text.split("```json")[1].split("```")[0].strip()
            elif "```" in output_text:
                output_text = output_text.split("```")[1].split("```")[0].strip()
                
            import json
            return json.loads(output_text)
        except Exception as e:
            print(f"JD Parse Error: {e}")
            return {"error": str(e)}

    async def compare_jd_cv(self, jd_text: str, resume_text: str) -> Dict[str, Any]:
        """
        Deep semantic comparison between a Job Description and a Resume using Gemini 1.5.
        """
        if not self.model:
            return {"error": "AI service not configured"}

        prompt = f"""Analyze the following Job Description (JD) and Resume (CV) for a deep industry-level compatibility match.
        
        Fields to extract:
        - match_score: Overall match percentage (0-100)
        - matching_skills: Skills found in both documents
        - missing_skills: Required JD skills missing from resume
        - experience_match: Analysis of how experience aligns with JD
        - project_match: Analysis of relevant projects and their alignment
        - industry_readiness: Overall readiness assessment and recommendations

        Return ONLY a JSON object.

        Job Description:
        {jd_text}

        Resume:
        {resume_text}
        """

        try:
            response = self.model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            output_text = response.text
            return json.loads(output_text)
            
        except Exception as e:
            print(f"JD-CV Comparison Error: {e}")
            return {"error": str(e)}
    async def match_candidates_to_jd(self, jd_text: str, limit: int = 5) -> List[Dict[str, Any]]:
        """
        AI-driven candidate matching against a Job Description.
        """
        if not self.model or not self.db:
            return []

        # 1. Extract requirements from JD
        extract_prompt = f"""Identify the core requirements from this Job Description.
        Extract the top 5 technical skills and the primary job title.
        Return ONLY valid JSON with keys: "skills" (list of strings), "title" (string).
        JD: {jd_text[:2000]}"""
        
        try:
            extract_resp = self.model.generate_content(extract_prompt)
            clean_json = extract_resp.text.replace("```json", "").replace("```", "").strip()
            import json
            reqs = json.loads(clean_json)
            extracted_skills = reqs.get("skills", [])
        except Exception as e:
            print(f"JD Extraction Error: {e}")
            extracted_skills = []

        # 2. Query candidates from DB (initial pool)
        from modules.search.service import SearchService
        search_res = await SearchService.search(skills=extracted_skills)
        candidates = search_res.get("candidates", [])

        if not candidates:
            return []

        # 3. AI Re-Ranking (Score the top 10 candidates precisely)
        top_pool = candidates[:10]
        
        ranking_prompt = f"""Score these {len(top_pool)} candidates against the following Job Description requirements.
        Requirements: {extracted_skills}
        
        Candidates:
        {json.dumps([{ "id": c["user_id"], "name": c["full_name"], "skills": c["skills"], "score": c["proof_score"] } for c in top_pool])}
        
        Return a JSON list of objects with "user_id" and "match_score" (0-100).
        Return ONLY the JSON list.
        """
        
        try:
            rank_resp = self.model.generate_content(ranking_prompt)
            rank_json = rank_resp.text.replace("```json", "").replace("```", "").strip()
            scores = json.loads(rank_json)
            
            # Map scores back to candidate objects
            score_map = {s["user_id"]: s["match_score"] for s in scores}
            
            for c in candidates:
                c["match_score"] = score_map.get(c["user_id"], c["proof_score"]) # Fallback to proof score if AI missed it
            
            # Sort by match score
            candidates.sort(key=lambda x: x.get("match_score", 0), reverse=True)
            
            return candidates[:limit]
        except Exception as e:
            print(f"Ranking Error: {e}")
            return candidates[:limit]

# Singleton instance
resume_service = ResumeService()
