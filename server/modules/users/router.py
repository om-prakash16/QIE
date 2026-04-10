from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from typing import List, Dict, Any, Optional
from modules.auth.service import get_current_user
from core.supabase import get_supabase
import uuid

router = APIRouter()

# Profile Endpoints

@router.get("/schema")
async def get_profile_schema():
    """
    Fetch dynamic schema fields for profile rendering.
    """
    db = get_supabase()
    response = db.table("profile_schema").select("*").order("display_order").execute()
    return response.data

@router.get("/")
async def get_user_profile(current_user = Depends(get_current_user)):
    """
    Fetch current logged-in user profile JSON.
    """
    db = get_supabase()
    response = db.table("dynamic_profile_data").select("*").eq("user_id", current_user["id"]).single().execute()
    return response.data

@router.post("/update")
async def update_profile(data: Dict[str, Any], current_user = Depends(get_current_user)):
    """
    Update dynamic profile JSON data.
    """
    db = get_supabase()
    response = db.table("dynamic_profile_data").upsert({
        "user_id": current_user["id"],
        "profile_data": data,
        "updated_at": "now()"
    }).execute()
    return {"status": "success", "data": response.data}

@router.post("/upload-file")
async def upload_profile_file(file: UploadFile = File(...), current_user = Depends(get_current_user)):
    """
    Upload resume or profile image to Supabase storage.
    """
    # In a real app: upload to bucket and return public URL
    return {
        "status": "success",
        "filename": file.filename,
        "url": f"https://best-hiring-tool.ai/storage/profiles/{current_user['id']}/{file.filename}"
    }

# Portfolio Endpoints

@router.get("/portfolio")
async def get_portfolio(user_id: Optional[str] = None, current_user = Depends(get_current_user)):
    """
    Fetch candidate portfolio (projects, external links).
    """
    target_id = user_id or current_user["id"]
    db = get_supabase()
    response = db.table("portfolios").select("*").eq("user_id", target_id).execute()
    return response.data
# Skill Endpoints

@router.get("/skills")
async def get_user_skills(user_id: Optional[str] = None, current_user = Depends(get_current_user)):
    """
    Fetch skills associated with a user.
    """
    target_id = user_id or current_user["id"]
    db = get_supabase()
    response = db.table("user_skills").select("*").eq("user_id", target_id).execute()
    return response.data

@router.post("/skills")
async def add_user_skill(skill_data: Dict[str, Any], current_user = Depends(get_current_user)):
    """
    Add a new skill to the user's profile.
    """
    db = get_supabase()
    new_skill = {
        "user_id": current_user["id"],
        "skill_name": skill_data["skill_name"],
        "proficiency_level": skill_data.get("proficiency_level", 1),
        "is_verified": False
    }
    response = db.table("user_skills").insert(new_skill).execute()
    
    # Log activity
    db.table("activity_events").insert({
        "user_id": current_user["id"],
        "event_type": "skill_added",
        "metadata": {"skill_name": skill_data["skill_name"]}
    }).execute()
    
    return response.data

@router.post("/skills/{skill_id}/verify")
async def request_skill_verification(skill_id: str, current_user = Depends(get_current_user)):
    """
    Submit a skill for moderation/verification.
    """
    db = get_supabase()
    
    # 1. Check if skill exists
    skill = db.table("user_skills").select("*").eq("id", skill_id).eq("user_id", current_user["id"]).single().execute()
    if not skill.data:
        raise HTTPException(status_code=404, detail="Skill not found")
        
    # 2. Add to moderation queue
    moderation_entry = {
        "entity_id": skill_id,
        "entity_type": "skill",
        "reason": f"Verification request for {skill.data['skill_name']}",
        "priority": "normal",
        "status": "pending"
    }
    response = db.table("moderation_queue").insert(moderation_entry).execute()
    
    return {"status": "pending", "message": "Verification request submitted to moderation queue"}
