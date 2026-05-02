"""
Project Ledger Service — Business logic for projects and Proof-of-Work.
"""

from typing import List, Optional, Dict, Any
from uuid import UUID
from core.supabase import get_supabase
from modules.skill_graph.service import SkillGraphService

import os
import json
import logging
import google.generativeai as genai

class ProjectService:
    def __init__(self):
        self.db = get_supabase()
        self.skill_service = SkillGraphService()
        
        # Initialize AI for repo analysis
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel("gemini-1.5-flash-latest")
        else:
            self.model = None

    async def list_user_projects(self, user_id: UUID) -> List[Dict[str, Any]]:
        res = self.db.table("project_ledger").select("*").eq("user_id", str(user_id)).execute()
        return res.data

    async def create_project(self, user_id: UUID, data: Dict[str, Any]) -> Dict[str, Any]:
        data["user_id"] = str(user_id)
        res = self.db.table("project_ledger").insert(data).execute()
        return res.data[0]

    async def update_project(self, user_id: UUID, project_id: UUID, data: Dict[str, Any]) -> Dict[str, Any]:
        res = self.db.table("project_ledger").update(data).eq("id", str(project_id)).eq("user_id", str(user_id)).execute()
        return res.data[0]

    async def delete_project(self, user_id: UUID, project_id: UUID) -> bool:
        self.db.table("project_ledger").delete().eq("id", str(project_id)).eq("user_id", str(user_id)).execute()
        return True

    async def link_skills_to_project(self, user_id: UUID, project_id: UUID, skill_ids: List[UUID], usage_context: str = "", weight: float = 1.0):
        """
        Links skills to a project and triggers proof score events.
        """
        results = []
        for skill_id in skill_ids:
            # 1. Get the user_skill_node for this user/skill
            node_res = self.db.table("user_skill_nodes").select("id").eq("user_id", str(user_id)).eq("skill_id", str(skill_id)).execute()
            
            if not node_res.data:
                # If user doesn't have the skill, add it first
                node = await self.skill_service.add_user_skill(user_id, skill_id)
                node_id = node["id"]
            else:
                node_id = node_res.data[0]["id"]

            # 2. Create the link
            link_data = {
                "user_skill_node_id": node_id,
                "project_id": str(project_id),
                "usage_context": usage_context,
                "contribution_weight": weight
            }
            self.db.table("skill_project_links").upsert(link_data).execute()

            # 3. Trigger proof score event
            # Use the existing SkillGraphService event logger
            await self.skill_service.log_usage_event(
                user_id=user_id,
                skill_id=skill_id,
                event_type="project_linked",
                proof_delta=10.0 * weight, # Base boost for project evidence
                event_data={"project_id": str(project_id), "context": usage_context}
            )
            results.append(node_id)
        
        return results

    async def analyze_github_repo(self, github_url: str) -> Dict[str, Any]:
        """
        Extract metadata and suggested skills from a GitHub repo URL using Gemini.
        """
        if not self.model:
            return {
                "suggested_skills": ["Git", "GitHub"],
                "description": "Auto-extracted from GitHub (AI disabled)",
                "repo_metadata": {"url": github_url}
            }

        prompt = f"""Analyze this GitHub repository URL: {github_url}
Extract:
1. A concise, professional project description.
2. A list of 5-8 primary technical skills or technologies used.

Return ONLY a JSON object:
{{
  "description": "string",
  "suggested_skills": ["string"]
}}
"""
        try:
            response = self.model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            analysis = json.loads(response.text)
            analysis["repo_metadata"] = {"url": github_url}
            return analysis
        except Exception as e:
            logging.error(f"GitHub analysis error: {e}")
            return {
                "suggested_skills": ["Git", "GitHub"],
                "description": f"Repository found at {github_url}",
                "repo_metadata": {"url": github_url}
            }
