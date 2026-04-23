from typing import Dict, Any, List
from core.supabase import get_supabase
import asyncio

class AdminService:
    @staticmethod
    async def get_dashboard_metrics() -> Dict[str, Any]:
        """
        Aggregates real-time metrics for the Super Admin dashboard.
        """
        db = get_supabase()
        
        # Parallelize analytic queries
        tasks = [
            db.table("users").select("id", count="exact").execute(),
            db.table("companies").select("id", count="exact").execute(),
            db.table("jobs").select("id", count="exact").execute(),
            db.table("applications").select("id", count="exact").execute(),
            db.table("activity_events").select("*").order("created_at", desc=True).limit(20).execute()
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        return {
            "total_users": results[0].count if not isinstance(results[0], Exception) else 0,
            "total_companies": results[1].count if not isinstance(results[1], Exception) else 0,
            "total_jobs": results[2].count if not isinstance(results[2], Exception) else 0,
            "total_applications": results[3].count if not isinstance(results[3], Exception) else 0,
            "recent_activity": results[4].data if not isinstance(results[4], Exception) else [],
            "status": "Healthy"
        }

    @staticmethod
    async def toggle_feature(feature_name: str, enabled: bool) -> Dict[str, Any]:
        """
        Dynamically enable or disable platform features.
        """
        db = get_supabase()
        res = db.table("feature_flags").update({"is_enabled": enabled}).eq("feature_name", feature_name).execute()
        return res.data[0] if res.data else {}

    @staticmethod
    async def update_ai_weights(weights: Dict[str, float]) -> Dict[str, Any]:
        """
        Update AI Proof Score weightings live.
        """
        db = get_supabase()
        res = db.table("platform_settings").update({"config_value": weights}).eq("config_key", "ai_score_weights").execute()
        return res.data[0] if res.data else {}

    @staticmethod
    async def moderate_entity(admin_id: str, target_id: str, target_type: str, action: str, reason: str):
        """
        Ban, warn, or suspend a user/company.
        """
        db = get_supabase()
        # 1. Log Moderation Action
        db.table("moderation_logs").insert({
            "admin_id": admin_id,
            "target_id": target_id,
            "target_type": target_type,
            "action": action,
            "reason": reason
        }).execute()
        
        # 2. Apply action to the entity (e.g. deactivate user)
        if target_type == "user":
            db.table("users").update({"status": "suspended" if action == "suspend" else "banned" if action == "ban" else "active"}).eq("id", target_id).execute()
        
        return {"status": "success", "action": action}
