from portal.apps.users.repository import UserRepository
from typing import Dict, Any, Optional

class UserService:
    def __init__(self):
        self.repository = UserRepository()

    async def get_profile(self, user_id: str) -> Dict[str, Any]:
        data = self.repository.get_full_profile(user_id)
        
        # Format the aggregated data for the API
        user_data = data["user"]
        profiles_raw = user_data.get("profiles", {})
        profiles_cleaned = profiles_raw[0] if isinstance(profiles_raw, list) and profiles_raw else (profiles_raw or {})
        
        return {
            "profile": {
                "user_id": user_id,
                "user_code": user_data.get("user_code"),
                "username": user_data.get("username"),
                "visibility": user_data.get("visibility"),
                **profiles_cleaned
            },
            "skills": [
                {"name": s["skills"]["name"], "category": s["skills"]["category"], "proficiency": s["proficiency_level"], "verified": s["is_verified"]}
                for s in data["skills"] if s.get("skills")
            ],
            "experiences": data["experiences"],
            "projects": data["projects"],
            "education": data["education"],
            "ai_scores": data["ai_scores"]
        }

    async def update_profile(self, user_id: str, data: Dict[str, Any]):
        # Sanitize data to prevent role escalation or identity theft
        protected_fields = {"roles", "role", "id", "sub", "wallet_address"}
        sanitized_data = {k: v for k, v in data.items() if k not in protected_fields}
        
        return self.repository.update(user_id, sanitized_data)

    async def get_public_portfolio(self, user_code: str) -> Optional[Dict[str, Any]]:
        user = self.repository.get_by_user_code(user_code)
        if not user or user["visibility"] == "private":
            return None
        return await self.get_profile(user["id"])
