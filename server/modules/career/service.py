from typing import List, Dict, Any, Optional
from uuid import UUID
from core.supabase import get_supabase
import json

class CareerService:
    async def create_goal(self, data: Dict[str, Any]) -> Dict[str, Any]:
        sb = get_supabase()
        if not sb: raise Exception("DB unavailable")
        
        response = sb.table("career_goals").insert({
            "user_id": data.get("user_id"),
            "goal_title": data.get("goal_title"),
            "target_role": data.get("target_role"),
            "deadline": data.get("deadline"),
        }).execute()
        
        return response.data[0] if response.data else {}

    async def add_task(self, data: Dict[str, Any]) -> Dict[str, Any]:
        sb = get_supabase()
        if not sb: raise Exception("DB unavailable")
        
        response = sb.table("career_tasks").insert({
            "goal_id": data.get("goal_id"),
            "task_title": data.get("task_title"),
            "status": data.get("status", "TODO"),
            "priority": data.get("priority", "Medium"),
            "due_date": data.get("due_date"),
        }).execute()
        
        return response.data[0] if response.data else {}

    async def get_user_goals(self, user_id: str) -> List[Dict[str, Any]]:
        sb = get_supabase()
        if not sb: return []
        
        # Fetch goals
        goals_resp = sb.table("career_goals").select("*").eq("user_id", user_id).execute()
        goals = goals_resp.data if goals_resp.data else []
        
        if not goals: return []
        
        # Hydrate with tasks and calculate progress
        for goal in goals:
            tasks_resp = sb.table("career_tasks").select("*").eq("goal_id", goal["id"]).execute()
            tasks = tasks_resp.data if tasks_resp.data else []
            goal["tasks"] = tasks
            
            if tasks:
                completed = sum(1 for t in tasks if t["status"] == "COMPLETED")
                goal["progress_percentage"] = round((completed / len(tasks)) * 100, 2)
            else:
                goal["progress_percentage"] = 0.0
                
        return goals
