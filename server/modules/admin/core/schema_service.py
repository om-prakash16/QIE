from typing import List, Dict, Any
from core.supabase import get_supabase

class SchemaService:
    @staticmethod
    async def get_all_fields() -> List[Dict[str, Any]]:
        """Fetch all defined profile fields."""
        db = get_supabase()
        res = db.table("profile_schema").select("*").order("display_order").execute()
        return res.data

    @staticmethod
    async def upsert_field(field_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create or update a dynamic profile field."""
        db = get_supabase()
        res = db.table("profile_schema").upsert(field_data).execute()
        return res.data[0] if res.data else {}

    @staticmethod
    async def delete_field(field_id: str):
        """Remove a field from the profile schema."""
        db = get_supabase()
        db.table("profile_schema").delete().eq("id", field_id).execute()
        return {"status": "deleted"}

# Singleton
schema_service = SchemaService()
