from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from app.auth.service import require_permission, get_current_user
from app.admin.service import AdminService
from app.admin.models import (
    UserUpdate, JobUpdate,
    SchemaFieldCreate, AIConfigRequest,
    FeatureToggleRequest, AnalyticsStatsResponse
)
from core.supabase import get_supabase

router = APIRouter()
admin_service = AdminService()

# --- Top Level Dash Analytics ---

@router.get("/analytics", response_model=AnalyticsStatsResponse)
async def get_admin_analytics(user = Depends(require_permission("view_analytics"))):
    """Aggregated platform metrics for the admin dashboard."""
    stats = await admin_service.get_global_stats()
    return AnalyticsStatsResponse(**stats)

# --- User & Job Moderation ---

@router.get("/users")
async def list_all_users(user = Depends(require_permission("user.promote"))):
    """Fetch all users on the platform."""
    db = get_supabase()
    if not db: return []
    response = db.table("users").select("*").order("created_at", desc=True).execute()
    return response.data

@router.patch("/users/{wallet}")
async def update_user(wallet: str, update: UserUpdate, user = Depends(require_permission("user.promote"))):
    """Admin: Update user roles or block users."""
    db = get_supabase()
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    response = db.table("users").update(update_data).eq("wallet_address", wallet).execute()
    return {"status": "success", "data": response.data}

# --- Dynamic Schema Builder ---

@router.get("/schema")
async def get_current_schema():
    """Fetch the active profile schema layout."""
    db = get_supabase()
    if not db: return []
    response = db.table("profile_schema").select("*").eq("is_active", True).order("display_order").execute()
    return response.data

@router.post("/schema/field")
async def add_schema_field(field: SchemaFieldCreate, user = Depends(require_permission("manage_schema"))):
    """Add a new dynamic field to profiles."""
    success = await admin_service.update_schema_field(field.model_dump())
    if not success:
        raise HTTPException(status_code=500, detail="Failed to update schema")
    return {"status": "field_added"}

# --- AI & Feature Flag Configuration ---

@router.patch("/ai-config")
async def update_ai_weights(config: AIConfigRequest, user = Depends(require_permission("manage_ai_config"))):
    """Adjust the global AI scoring formula weights."""
    wallet = user.get("user_metadata", {}).get("wallet_address", "admin")
    success = await admin_service.set_platform_config("ai", "proof_score_weights", config.weights, wallet)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to apply AI config")
    return {"status": "ai_config_updated"}

@router.post("/feature-toggle")
async def toggle_feature(req: FeatureToggleRequest, user = Depends(require_permission("manage_flags"))):
    """Enable or disable platform features in real-time."""
    wallet = user.get("user_metadata", {}).get("wallet_address", "admin")
    success = await admin_service.set_platform_config("flags", req.feature_key, req.is_enabled, wallet)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to toggle feature")
    return {"status": "feature_updated", "key": req.feature_key, "state": req.is_enabled}
