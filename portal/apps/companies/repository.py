from portal.core.supabase import get_supabase
from typing import Dict, Any, List, Optional

class CompanyRepository:
    def __init__(self):
        self.db = get_supabase()

    def create_company(self, name: str, user_id: str) -> Dict[str, Any]:
        res = self.db.table("companies").insert({
            "name": name,
            "created_by_user_id": user_id
        }).execute()
        return res.data[0] if res.data else {}

    def add_member(self, company_id: str, user_id: str, role: str) -> Dict[str, Any]:
        res = self.db.table("company_members").insert({
            "company_id": company_id,
            "user_id": user_id,
            "company_role": role
        }).execute()
        return res.data[0] if res.data else {}

    def get_member(self, company_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        res = self.db.table("company_members").select("*").eq("company_id", company_id).eq("user_id", user_id).execute()
        return res.data[0] if res.data else None

    def get_user_by_wallet(self, wallet_address: str) -> Optional[Dict[str, Any]]:
        res = self.db.table("users").select("id").eq("wallet_address", wallet_address).execute()
        return res.data[0] if res.data else None

    def get_team(self, company_id: str) -> List[Dict[str, Any]]:
        res = self.db.table("company_members").select("*, users(wallet_address)").eq("company_id", company_id).execute()
        return res.data

    def elevate_user_role(self, user_id: str, role_name: str):
        role_row = self.db.table("roles").select("id").eq("role_name", role_name).single().execute()
        if role_row.data:
            self.db.table("user_roles").upsert({
                "user_id": user_id,
                "role_id": role_row.data["id"]
            }).execute()
