from portal.core.supabase import get_supabase
from typing import Dict, Any, Optional

class IdentityRepository:
    def __init__(self):
        self.db = get_supabase()

    def upsert_identity(self, data: Dict[str, Any]):
        res = self.db.table("user_identities").upsert(data).execute()
        return res.data[0] if res.data else {}

    def get_by_user(self, user_id: str):
        res = self.db.table("user_identities").select("*").eq("user_id", user_id).single().execute()
        return res.data

    def update_verification(self, user_id: str, data: Dict[str, Any]):
        res = self.db.table("user_identities").update(data).eq("user_id", user_id).execute()
        return res.data[0] if res.data else {}
