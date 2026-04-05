import os
import httpx
from typing import Dict, Any, Optional

class ColosseumService:
    def __init__(self):
        self.api_base = os.getenv("COLOSSEUM_COPILOT_API_BASE", "https://copilot.colosseum.com/api/v1")
        self.pat = os.getenv("COLOSSEUM_COPILOT_PAT", "").strip('"')
        self.headers = {
            "Authorization": f"Bearer {self.pat}",
            "Content-Type": "application/json"
        }

    async def get_status(self) -> Dict[str, Any]:
        """Verify connection to Colosseum Copilot."""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{self.api_base}/status", headers=self.headers)
                return response.json()
            except Exception as e:
                return {"authenticated": False, "error": str(e)}

    async def analyze_project(self, query: str) -> Dict[str, Any]:
        """
        Run a conversational query against the Colosseum database.
        Searches 5,400+ hackathon submissions.
        """
        async with httpx.AsyncClient() as client:
            try:
                payload = {"query": query}
                response = await client.post(
                    f"{self.api_base}/query", 
                    headers=self.headers,
                    json=payload,
                    timeout=30.0
                )
                return response.json()
            except Exception as e:
                return {"error": str(e)}

    async def start_deep_dive(self, project_context: str) -> Dict[str, Any]:
        """
        Trigger an 8-step deep dive research workflow.
        """
        async with httpx.AsyncClient() as client:
            try:
                payload = {"context": project_context}
                response = await client.post(
                    f"{self.api_base}/research", 
                    headers=self.headers,
                    json=payload,
                    timeout=60.0
                )
                return response.json()
            except Exception as e:
                return {"error": str(e)}

colosseum_service = ColosseumService()
