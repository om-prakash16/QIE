import uuid
from typing import List, Dict, Any, Optional
from core.supabase import get_supabase

# In-memory cache for feature flags to reduce DB hits
_FEATURE_CACHE: Dict[str, bool] = {}

class FeatureFlagService:
    @staticmethod
    async def is_enabled(feature_name: str, force_refresh: bool = False) -> bool:
        """
        High-performance check for feature status.
        """
        global _FEATURE_CACHE
        if feature_name in _FEATURE_CACHE and not force_refresh:
            return _FEATURE_CACHE[feature_name]
            
        db = get_supabase()
        response = db.table("feature_flags").select("is_enabled").eq("feature_name", feature_name).maybe_single().execute()
        
        status = response.data.get("is_enabled", False) if response.data else False
        _FEATURE_CACHE[feature_name] = status
        return status

    @staticmethod
    async def list_all_features() -> List[Dict[str, Any]]:
        """
        Fetch all features for admin dashboard.
        """
        db = get_supabase()
        response = db.table("feature_flags").select("*").order("category", desc=False).execute()
        return response.data if response.data else []

    @staticmethod
    async def update_feature(feature_name: str, is_enabled: bool, admin_id: uuid.UUID):
        """
        Update feature status with audit logging.
        """
        global _FEATURE_CACHE
        db = get_supabase()
        
        db.table("feature_flags").update({
            "is_enabled": is_enabled,
            "updated_by": str(admin_id),
            "updated_at": "now()"
        }).eq("feature_name", feature_name).execute()
        
        # Invalidate cache
        _FEATURE_CACHE[feature_name] = is_enabled
