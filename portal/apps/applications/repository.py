from portal.core.supabase import get_supabase
from typing import List, Dict, Any

class ApplicationRepository:
    def __init__(self):
        self.db = get_supabase()

    def create(self, data: Dict[str, Any]):
        res = self.db.table("applications").insert(data).execute()
        return res.data[0] if res.data else {}

    def get_by_id(self, app_id: str):
        res = self.db.table("applications").select("*, jobs(title), users(full_name)").eq("id", app_id).single().execute()
        return res.data

    def get_by_candidate(self, candidate_id: str):
        res = self.db.table("applications").select("*, jobs(*)").eq("candidate_id", candidate_id).execute()
        return res.data

    def get_by_job(self, job_id: str):
        res = self.db.table("applications").select("*, users(*)").eq("job_id", job_id).execute()
        return res.data

    def update_status(self, app_id: str, status: str):
        res = self.db.table("applications").update({"status": status}).eq("id", app_id).execute()
        return res.data[0] if res.data else {}
