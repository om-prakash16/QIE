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
        "url": f"https://this-best-hiring-tool.ai/storage/profiles/{current_user['id']}/{file.filename}"
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
