from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from db.supabase_client import get_supabase
from datetime import datetime

router = APIRouter()

# ─── Models ───────────────────────────────────────────────────────────
class UserUpdate(BaseModel):
    role: Optional[str] = None
    status: Optional[str] = None
    email: Optional[str] = None

class JobUpdate(BaseModel):
    status: Optional[str] = None
    is_active: Optional[bool] = None

class SettingsUpdate(BaseModel):
    key: str
    value: Any

# ─── Admin Stats ──────────────────────────────────────────────────────
@router.get("/stats")
async def get_admin_stats():
    """Aggregate platform metrics for the dashboard."""
    db = get_supabase()
    if not db:
        return {
            "total_users": 1280,
            "active_jobs": 432,
            "platform_health": "98.2%",
            "recent_activity": []
        }
    
    try:
        # Get counts using head=True to avoid fetching all data
        user_response = db.table("users").select("*", count="exact").head(True).execute()
        job_response = db.table("jobs").select("*", count="exact").eq("status", "active").head(True).execute()
        
        return {
            "total_users": user_response.count if user_response.count is not None else 0,
            "active_jobs": job_response.count if job_response.count is not None else 0,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ─── User Management ──────────────────────────────────────────────────
@router.get("/users")
async def list_all_users():
    """Fetch all users on the platform."""
    db = get_supabase()
    if not db:
        return []
    
    response = db.table("users").select("*").order("created_at", desc=True).execute()
    return response.data

@router.patch("/users/{wallet}")
async def update_user_identity(wallet: str, update: UserUpdate):
    """Update user role, status, or email mapping."""
    db = get_supabase()
    if not db:
        return {"status": "mock", "message": "Updated (mock mode)"}
    
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    response = db.table("users").update(update_data).eq("wallet_address", wallet).execute()
    return {"status": "success", "data": response.data}

# ─── Job Moderation ───────────────────────────────────────────────────
@router.get("/jobs")
async def list_all_jobs():
    """Fetch all jobs regardless of status."""
    db = get_supabase()
    if not db:
        return []
    
    response = db.table("jobs").select("*").order("created_at", desc=True).execute()
    return response.data

@router.patch("/jobs/{job_id}")
async def moderate_job(job_id: str, update: JobUpdate):
    """Toggle job operational status."""
    db = get_supabase()
    if not db:
        return {"status": "mock", "message": "Updated (mock mode)"}
    
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    response = db.table("jobs").update(update_data).eq("id", job_id).execute()
    return {"status": "success", "data": response.data}

# ─── Configuration Matrix ─────────────────────────────────────────────
@router.get("/settings")
async def get_platform_settings():
    """Fetch all configuration protocols."""
    db = get_supabase()
    if not db:
        return {}
    
    response = db.table("platform_settings").select("*").execute()
    return {item['key']: item['value'] for item in response.data}

@router.post("/settings")
async def update_platform_setting(update: SettingsUpdate):
    """Update a specific platform configuration."""
    db = get_supabase()
    if not db:
        return {"status": "mock", "message": "Setting saved (mock mode)"}
    
    response = db.table("platform_settings").upsert({
        "key": update.key,
        "value": update.value,
        "updated_at": datetime.now().isoformat()
    }).execute()
    return {"status": "success", "data": response.data}
