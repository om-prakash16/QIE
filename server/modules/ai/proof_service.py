from typing import Dict, Any
from core.supabase import get_supabase
from modules.users.service import UserService

class ProofScoreService:
    @staticmethod
    async def calculate_proof_score(user_id: str) -> float:
        """
        Dynamically calculates the Proof Score using weights from the Admin CMS.
        """
        db = get_supabase()
        user_service = UserService()
        
        # 1. Fetch Admin Weights from platform_settings
        settings_res = db.table("platform_settings").select("config_value").eq("config_key", "ai_score_weights").single().execute()
        weights = settings_res.data["config_value"] if settings_res.data else {"resume": 0.4, "github": 0.3, "skills": 0.3}
        
        # 2. Fetch User Data
        profile = await user_service.get_full_profile(user_id)
        
        # 3. Calculate Component Scores (Simulated based on counts)
        # In a real app, these would come from actual parsing/verification results.
        skills_score = min(100, len(profile["skills"]) * 10)
        exp_score = min(100, len(profile["experiences"]) * 15)
        proj_score = min(100, len(profile["projects"]) * 20)
        
        # 4. Apply Weights
        final_score = (
            (skills_score * weights.get("skills", 0.3)) +
            (exp_score * weights.get("resume", 0.4)) +
            (proj_score * weights.get("github", 0.3))
        )
        
        # 5. Save to database
        db.table("ai_scores").upsert({
            "user_id": user_id,
            "proof_score": round(final_score, 1),
            "technical_score": skills_score,
            "updated_at": "now()"
        }).execute()
        
        return round(final_score, 1)
