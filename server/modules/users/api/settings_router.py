"""
User Settings Router.
Manages notification preferences, privacy rules, and job preferences.
"""

from fastapi import APIRouter, Depends, HTTPException, Body
from typing import Dict, Any
from modules.auth.core.service import get_current_user
from core.supabase import get_supabase

router = APIRouter()

@router.get("/")
async def get_my_settings(current_user=Depends(get_current_user)):
    """Fetch the settings for the currently authenticated user."""
    user_id = current_user["sub"]
    db = get_supabase()
    if not db:
        raise HTTPException(status_code=500, detail="Database unavailable")

    response = db.table("user_settings").select("*").eq("user_id", user_id).single().execute()
    
    if not response.data:
        # If settings don't exist, they should have been created by the trigger.
        # But we'll handle it gracefully.
        return {
            "notification_prefs": {
                "application_updates": True,
                "ai_recommendations": True,
                "skill_verification": True,
                "interview_requests": True
            },
            "privacy_rules": {
                "email": "private",
                "phone": "private",
                "resume": "recruiters_only"
            }
        }
    
    return response.data

@router.patch("/update")
async def update_settings(
    data: Dict[str, Any], 
    current_user=Depends(get_current_user)
):
    """Update user-specific preferences or privacy rules."""
    user_id = current_user["sub"]
    db = get_supabase()
    if not db:
        raise HTTPException(status_code=500, detail="Database unavailable")

    # Allow updating specific keys within notification_prefs, job_prefs, or privacy_rules
    # We use a simple upsert/update pattern.
    
    # Filter allowed keys to prevent arbitrary DB writes if using JSONB
    allowed_fields = ["notification_prefs", "job_prefs", "privacy_rules", "profile_visibility"]
    update_data = {k: v for k, v in data.items() if k in allowed_fields}
    update_data["updated_at"] = "now()"

    response = (
        db.table("user_settings")
        .update(update_data)
        .eq("user_id", user_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to update settings")

    return response.data[0]
