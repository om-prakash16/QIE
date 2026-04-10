from typing import List, Dict, Any, Optional
from uuid import UUID
from core.supabase import get_supabase

class IdentityService:
    # --- Privacy & Visibility ---
    async def update_privacy_settings(self, user_id: str, visibility: str) -> Dict[str, Any]:
        sb = get_supabase()
        if not sb: raise Exception("DB unavailable")
        
        response = sb.table("user_settings").update({
            "profile_visibility": visibility,
            "updated_at": "now()"
        }).eq("user_id", user_id).execute()
        
        return response.data[0] if response.data else {}

    # --- Connections ---
    async def request_connection(self, user_id: str, target_user_id: str) -> Dict[str, Any]:
        sb = get_supabase()
        if not sb: raise Exception("DB unavailable")
        
        response = sb.table("connections").insert({
            "user_id": user_id,
            "connected_user_id": target_user_id,
            "status": "PENDING"
        }).execute()
        
        return response.data[0] if response.data else {}

    async def list_connections(self, user_id: str) -> List[Dict[str, Any]]:
        sb = get_supabase()
        if not sb: return []
        
        # Unified list of accepted connections (both ways)
        resp1 = sb.table("connections").select("connected_user_id, users!connections_connected_user_id_fkey(full_name, wallet_address)") \
            .eq("user_id", user_id).eq("status", "ACCEPTED").execute()
        
        resp2 = sb.table("connections").select("user_id, users!connections_user_id_fkey(full_name, wallet_address)") \
            .eq("connected_user_id", user_id).eq("status", "ACCEPTED").execute()
            
        return (resp1.data or []) + (resp2.data or [])

    # --- History (Work & Education) ---
    async def get_user_timeline(self, user_id: str) -> Dict[str, Any]:
        sb = get_supabase()
        if not sb: return {"work": [], "education": []}
        
        work = sb.table("work_history").select("*").eq("user_id", user_id).order("start_date", desc=True).execute()
        education = sb.table("education_history_refined").select("*").eq("user_id", user_id).order("start_year", desc=True).execute()
        
        return {
            "work": work.data or [],
            "education": education.data or []
        }

    async def add_work_history(self, user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        sb = get_supabase()
        if not sb: raise Exception("DB unavailable")
        
        response = sb.table("work_history").insert({
            "user_id": user_id,
            "company": data.get("company"),
            "role": data.get("role"),
            "start_date": data.get("start_date"),
            "end_date": data.get("end_date"),
            "description": data.get("description"),
            "is_current": data.get("is_current", False)
        }).execute()
        
        return response.data[0] if response.data else {}
