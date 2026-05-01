import asyncio
import logging
from typing import Dict, Any, List
from core.supabase import get_supabase
from core.exceptions import ExternalServiceError, NotFoundError

logger = logging.getLogger(__name__)

class AdminService:
    @staticmethod
    async def get_dashboard_metrics() -> Dict[str, Any]:
        """Aggregates real-time metrics for the Super Admin dashboard."""
        db = get_supabase()
        if not db: raise ExternalServiceError("Database unavailable")
        
        # Parallel queries for performance
        tasks = [
            db.table("users").select("id", count="exact").execute(),
            db.table("companies").select("id", count="exact").execute(),
            db.table("jobs").select("id", count="exact").execute(),
            db.table("applications").select("id", count="exact").execute(),
            db.table("activity_logs").select("*").order("timestamp", desc=True).limit(10).execute()
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        def get_count(res):
            return res.count if hasattr(res, "count") else 0

        return {
            "metrics": {
                "total_users": get_count(results[0]),
                "total_companies": get_count(results[1]),
                "total_jobs": get_count(results[2]),
                "total_applications": get_count(results[3]),
            },
            "recent_activity": results[4].data if hasattr(results[4], "data") else [],
            "system_health": "operational"
        }

    @staticmethod
    async def toggle_feature(feature_name: str, enabled: bool, admin_id: str) -> Dict[str, Any]:
        db = get_supabase()
        res = db.table("feature_flags").update({
            "is_enabled": enabled,
            "updated_by": admin_id
        }).eq("feature_name", feature_name).execute()
        
        if not res.data:
            raise NotFoundError(f"Feature '{feature_name}' not found")
        return res.data[0]

    @staticmethod
    async def update_ai_weights(weights: Dict[str, float]) -> Dict[str, Any]:
        db = get_supabase()
        res = db.table("platform_settings").update({"setting_value": weights}).eq("setting_key", "ai_score_weights").execute()
        if not res.data:
             # Try insert if not exists
             res = db.table("platform_settings").insert({"setting_key": "ai_score_weights", "setting_value": weights}).execute()
        return res.data[0]

    @staticmethod
    async def moderate_entity(admin_id: str, target_id: str, target_type: str, action: str, reason: str):
        db = get_supabase()
        # 1. Log Action
        db.table("moderation_logs").insert({
            "admin_id": admin_id,
            "target_id": target_id,
            "target_type": target_type,
            "action": action,
            "reason": reason
        }).execute()
        
        # 2. Apply Action
        if target_type == "user":
            status = "suspended" if action == "suspend" else "banned" if action == "ban" else "active"
            db.table("users").update({"status": status}).eq("id", target_id).execute()
        elif target_type == "company":
            db.table("companies").update({"is_verified": False if action == "suspend" else True}).eq("id", target_id).execute()
        
        return {"action": action, "target_id": target_id}

    @staticmethod
    async def bootstrap_platform() -> Dict[str, Any]:
        """Initial platform setup and core data seeding (Production safe)."""
        db = get_supabase()
        # Logic for creating base roles, core skills, and initial schemas
        # This replaces the 'dummy' seeder with a idempotent bootstrap.
        try:
            # Check for existing roles
            roles = db.table("roles").select("role_name").execute()
            if not roles.data:
                db.table("roles").insert([
                    {"role_name": "USER"},
                    {"role_name": "COMPANY"},
                    {"role_name": "ADMIN"}
                ]).execute()
            return {"status": "Platform bootstrapped successfully"}
        except Exception as e:
            logger.error(f"Bootstrap failed: {e}")
            raise ExternalServiceError("Bootstrap sequence failed")

    @staticmethod
    async def get_all_settings() -> List[Dict[str, Any]]:
        db = get_supabase()
        res = db.table("platform_settings").select("*").execute()
        return res.data or []

    @staticmethod
    async def update_setting(key: str, value: Any) -> Dict[str, Any]:
        db = get_supabase()
        res = db.table("platform_settings").upsert({"setting_key": key, "setting_value": value}).execute()
        return res.data[0] if res.data else {}

# Singleton
admin_service = AdminService()
