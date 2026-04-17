import os
import json
from typing import Dict, Any, List
from datetime import datetime
from core.supabase import get_supabase
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate

class MarketIntelligenceService:
    """
    Market Intelligence Engine.
    Analyzes supply (Candidate Skills) vs. Demand (Job Requirements).
    """
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        self.llm = ChatGoogleGenerativeAI(
            temperature=0.3, 
            google_api_key=self.api_key, 
            model="gemini-1.5-flash"
        ) if self.api_key else None

    async def get_market_heatmap_data(self) -> Dict[str, Any]:
        """
        Aggregate live demand and supply data for the platform Heatmap.
        """
        db = get_supabase()
        if not db:
            raise Exception("Database unavailable")

        # 1. Aggregate Demand (Job Requirements)
        jobs_resp = db.table("jobs").select("skills_required").execute()
        demand_map = {}
        for job in (jobs_resp.data or []):
            for skill in job.get("skills_required", []):
                s_lower = skill.lower()
                demand_map[s_lower] = demand_map.get(s_lower, 0) + 1

        # 2. Aggregate Supply (User Skills)
        # Using a count from user_skills table directly
        supply_resp = db.table("user_skills").select("skill_name").execute()
        supply_map = {}
        for us in (supply_resp.data or []):
            s_lower = us["skill_name"].lower()
            supply_map[s_lower] = supply_map.get(s_lower, 0) + 1

        # 3. Calculate Opportunity Indices
        all_skills = set(demand_map.keys()) | set(supply_map.keys())
        heatmap_points = []
        
        for skill in all_skills:
            demand = demand_map.get(skill, 0)
            supply = supply_map.get(skill, 0)
            
            # Opportunity Index (Demand relative to supply)
            # A higher score means more opportunity (less competition for candidates)
            opportunity_index = round(demand / (supply + 0.1), 2)
            
            heatmap_points.append({
                "skill": skill,
                "demand": demand,
                "supply": supply,
                "opportunity_index": opportunity_index,
                "saturation": "High" if supply > demand * 2 else "Low" if demand > supply else "Balanced"
            })

        # Sort by opportunity most to least
        heatmap_points = sorted(heatmap_points, key=lambda x: x["opportunity_index"], reverse=True)

        return {
            "timestamp": datetime.now().isoformat(),
            "heatmap": heatmap_points[:20], # Top 20 skills for visualization
            "summary": {
                "total_unique_skills": len(all_skills),
                "hottest_skill": heatmap_points[0]["skill"] if heatmap_points else "N/A"
            }
        }

    async def get_future_predictions(self, current_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Use AI to predict future skill trends based on current platform heatmap.
        """
        if not self.llm:
            return {
                "predictions": ["ZK Proofs", "AI Agents", "Rust"],
                "confidence_radar": {"Web3": 85, "AI": 92, "Frontend": 45},
                "insight": "AI-driven predictions require a configured Gemini API Key."
            }

        prompt = PromptTemplate(
            template="""Analyze the following market demand/supply data from our hiring platform.
            
            Current Data Snapshot:
            {current_data}
            
            OBJECTIVE:
            Predict the 3 'Breakout Skills' for the next 6 months.
            Identify 1 'Saturated' domain where supply exceeds demand.
            Return a JSON object only with these keys:
            - breakout_skills (list of strings)
            - saturated_domain (string)
            - predictions_summary (string: 20-30 words)
            """,
            input_variables=["current_data"]
        )

        try:
            formatted_data = json.dumps(current_data["heatmap"])
            response = self.llm.invoke(prompt.format(current_data=formatted_data))
            content = response.content.replace('```json', '').replace('```', '').strip()
            return json.loads(content)
        except Exception as e:
            return {"error": f"AI Prediction failed: {str(e)}"}
