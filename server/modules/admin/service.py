import json
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from core.postgres import get_db_connection
from core.supabase import get_supabase

class AdminService:
    def __init__(self):
        pass

    # Dynamic Schema Management

    async def update_schema_field(self, field_data: Dict[str, Any]) -> bool:
        """
        Adds or updates a dynamic profile field.
        This immediately affects the DynamicValidationService.
        """
        db = get_supabase()
        if not db:
            return False
            
        # Ensure field_key is safe
        field_key = field_data.get("field_key", "").lower().replace(" ", "_")
        
        db.table("profile_schema").upsert({
            "field_name": field_key,
            "label": field_data.get("label"),
            "field_type": field_data.get("field_type", "text"),
            "required": field_data.get("required", False),
            "display_order": field_data.get("display_order", 0),
            "validation_rules": field_data.get("validation_rules", {}),
            "is_active": True,
            "updated_at": datetime.utcnow().isoformat()
        }).execute()
        
        return True

    async def delete_schema_field(self, field_id: str) -> bool:
        """
        Deactivates a schema field (Soft Delete).
        """
        db = get_supabase()
        if not db:
            return False
        
        db.table("profile_schema").update({"is_active": False}).eq("id", field_id).execute()
        return True

    # AI & Platform Configuration

    async def set_platform_config(self, key: str, value: Any, staff_wallet: str) -> bool:
        """
        Updates a platform-wide setting (AI weights, Feature Flags).
        """
        db = get_supabase()
        if not db:
            return False
            
        db.table("platform_settings").upsert({
            "setting_key": key,
            "setting_value": value,
            "updated_at": datetime.utcnow().isoformat()
        }).execute()
        
        # Log action for audit trail
        await self.log_admin_action(staff_wallet, "update_config", "setting", key, {"new_value": value})
        return True

    async def get_config(self, key: str) -> Optional[Any]:
        """
        Fetches a specific setting by key.
        """
        db = get_supabase()
        if not db:
            return None
            
        response = db.table("platform_settings").select("setting_value").eq("setting_key", key).single().execute()
        return response.data['setting_value'] if response.data else None

    async def get_config_group(self, group: str) -> Dict[str, Any]:
        """
        Fetches all settings for a specific group (e.g., 'flags').
        """
        db = get_supabase()
        if not db:
            return {}
            
        response = db.table("platform_settings").select("*").eq("config_group", group).execute()
        return {item['key']: item['value'] for item in response.data}

    # Analytics & Audit

    async def get_global_stats(self) -> Dict[str, Any]:
        """
        Aggregates platform metrics for the admin dashboard.
        """
        db = get_supabase()
        if not db:
            return {"users": 0, "mints": 0, "jobs": 0}
            
        # Parallel counts for high efficiency
        users = db.table("users").select("*", count="exact").head(True).execute().count
        jobs = db.table("jobs").select("*", count="exact").head(True).execute().count
        mints = db.table("nft_records").select("*", count="exact").head(True).execute().count
        
        return {
            "total_users": users or 0,
            "total_jobs": jobs or 0,
            "total_nfts_minted": mints or 0,
            "platform_health": "Optimized",
            "last_calc_at": datetime.utcnow().isoformat()
        }

    async def log_admin_action(self, staff_wallet: str, action: str, target_type: str, target_id: str, metadata: Dict[str, Any] = {}):
        """
        Appends an entry to the staff audit logs.
        """
        db = get_supabase()
        if db:
            db.table("staff_audit_logs").insert({
                "staff_wallet": staff_wallet,
                "action": action,
                "target_type": target_type,
                "target_id": target_id,
                "metadata": metadata
            }).execute()
