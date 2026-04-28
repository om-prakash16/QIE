from portal.core.supabase import get_supabase
from typing import List, Dict, Any, Optional

class JobRepository:
    def __init__(self):
        self.db = get_supabase()

    def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        res = self.db.table("jobs").insert(data).execute()
        return res.data[0] if res.data else {}

    def get_by_id(self, job_id: str) -> Optional[Dict[str, Any]]:
        res = self.db.table("jobs").select("*, companies(name)").eq("id", job_id).single().execute()
        return res.data

    def list_active(self) -> List[Dict[str, Any]]:
        res = self.db.table("jobs").select("*, companies(name)").eq("is_active", True).execute()
        return res.data

    def get_by_company(self, company_id: str) -> List[Dict[str, Any]]:
        res = self.db.table("jobs").select("*").eq("company_id", company_id).order("created_at", desc=True).execute()
        return res.data

    def update(self, job_id: str, data: Dict[str, Any]):
        res = self.db.table("jobs").update(data).eq("id", job_id).execute()
        return res.data[0] if res.data else {}

    def save_job(self, job_id: str, candidate_id: str):
        res = self.db.table("saved_jobs").insert({"job_id": job_id, "candidate_id": candidate_id}).execute()
        return res.data[0] if res.data else {}

    def get_saved_jobs(self, candidate_id: str):
        res = self.db.table("saved_jobs").select("*, jobs(*, companies(name))").eq("candidate_id", candidate_id).execute()
        return res.data
