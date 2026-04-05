import os
from typing import Dict, Any, List
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate

class CareerRecommender:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.llm = ChatOpenAI(temperature=0.7, api_key=self.api_key, model="gpt-4o-mini") if self.api_key else None

    async def recommend(self, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Suggests long-term career paths and transition strategies.
        """
        if not self.llm:
            return {
                "suggested_paths": ["Backend Developer", "AI Engineer"],
                "justification": "Candidate has strong Python and SQL skills."
            }

        prompt = PromptTemplate(
            template="""Analyze the candidate's skills and suggest 3 possible long-term career paths.
            Skills: {skills}
            Background: {bio}
            
            Return a JSON object with:
            - suggested_paths (list)
            - justification (brief string)
            - top_priority_skill (single string)
            """,
            input_variables=["skills", "bio"]
        )

        try:
            result = self.llm.invoke(prompt.format(
                skills=", ".join(profile_data.get("skills", [])),
                bio=profile_data.get("bio", "")
            ))
            import json
            return json.loads(result.content)
        except Exception as e:
            return {"error": str(e)}
