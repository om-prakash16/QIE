from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from modules.auth.service import require_permission, get_current_user
from modules.admin.service import AdminService
from modules.admin.models import (
    UserUpdate, JobUpdate,
    SchemaFieldCreate, SchemaFieldUpdate,
    SkillCategoryCreate, FeatureToggleRequest,
    PlatformSettingRequest, AnalyticsStatsResponse
)
from core.supabase import get_supabase

router = APIRouter()
admin_service = AdminService()

# Top Level Dash Analytics

@router.get("/analytics", response_model=AnalyticsStatsResponse)
async def get_admin_analytics(user = Depends(require_permission("view_analytics"))):
    """Aggregated platform metrics for the admin dashboard."""
    stats = await admin_service.get_global_stats()
    return AnalyticsStatsResponse(**stats)

# User & Job Moderation

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


# SECTION 10 API Endpoints

# Profile Schema Endpoints
@router.get("/schema")
async def get_schema():
    db = get_supabase()
    if not db: return []
    response = db.table("profile_schema").select("*").order("display_order").execute()
    return response.data

@router.post("/schema")
async def create_schema(field: SchemaFieldCreate, user = Depends(require_permission("manage_schema"))):
    db = get_supabase()
    response = db.table("profile_schema").insert(field.model_dump()).execute()
    return {"status": "success", "data": response.data}

@router.patch("/schema/{field_id}")
async def update_schema(field_id: str, field: SchemaFieldUpdate, user = Depends(require_permission("manage_schema"))):
    db = get_supabase()
    update_data = {k: v for k, v in field.model_dump().items() if v is not None}
    response = db.table("profile_schema").update(update_data).eq("id", field_id).execute()
    return {"status": "success", "data": response.data}

# Skills Endpoints
@router.get("/skills")
async def get_skills():
    db = get_supabase()
    if not db: return []
    response = db.table("skill_categories").select("*").execute()
    return response.data

@router.post("/skills")
async def create_skill(skill: SkillCategoryCreate, user = Depends(require_permission("manage_schema"))):
    db = get_supabase()
    response = db.table("skill_categories").insert(skill.model_dump()).execute()
    return {"status": "success", "data": response.data}

# Features Endpoints
@router.get("/features")
async def get_features():
    db = get_supabase()
    if not db: return []
    response = db.table("feature_flags").select("*").execute()
    return response.data

@router.post("/features")
async def update_feature(feature: FeatureToggleRequest, user = Depends(require_permission("manage_flags"))):
    db = get_supabase()
    update_data = {
        "is_enabled": feature.is_enabled,
    }
    if feature.description is not None:
        update_data["description"] = feature.description

    response = db.table("feature_flags").update(update_data).eq("feature_name", feature.feature_name).execute()
    return {"status": "success", "data": response.data}

# Settings Endpoints
@router.get("/settings")
async def get_settings():
    db = get_supabase()
    if not db: return []
    response = db.table("platform_settings").select("*").execute()
    return response.data

@router.post("/settings")
async def update_settings(setting: PlatformSettingRequest, user = Depends(require_permission("manage_flags"))):
    db = get_supabase()
    response = db.table("platform_settings").update({"setting_value": setting.setting_value}).eq("setting_key", setting.setting_key).execute()
    return {"status": "success", "data": response.data}


# Subscriptions & SaaS Endpoints (Module 15)
@router.get("/subscriptions")
async def get_subscriptions():
    db = get_supabase()
    if not db: return []
    response = db.table("platform_subscriptions").select("*").execute()
    return response.data

@router.patch("/subscriptions/{sub_id}")
async def update_subscription(sub_id: str, payload: Dict[str, Any], user = Depends(require_permission("manage_flags"))):
    db = get_supabase()
    update_data = {k: v for k, v in payload.items() if v is not None}
    response = db.table("platform_subscriptions").update(update_data).eq("id", sub_id).execute()
    return {"status": "success", "data": response.data}
