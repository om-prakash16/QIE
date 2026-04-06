from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from modules.auth.service import require_permission, get_current_user
from core.supabase import get_supabase
from pydantic import BaseModel

router = APIRouter()

class SchemaFieldCreate(BaseModel):
    id: Optional[str] = None
    field_name: str
    field_type: str # text, number, select, etc.
    section: str = "General"
    required: bool = False
    validation_rules: Optional[Dict[str, Any]] = None
    display_order: int = 0

class FeatureToggleRequest(BaseModel):
    feature_name: str
    is_enabled: bool
    description: Optional[str] = None

class PlatformSettingRequest(BaseModel):
    setting_key: str
    setting_value: str

class UserUpdate(BaseModel):
    role: Optional[str] = None
    is_active: Optional[bool] = None

# --- User Moderation Endpoints ---

@router.get("/users")
async def get_all_users(user = Depends(require_permission("user.promote"))):
    """
    SECTION 1: Fetch all platform users for moderation.
    """
    db = get_supabase()
    response = db.table("users").select("*").order("created_at", desc=True).execute()
    return response.data

@router.patch("/users/{wallet}")
async def update_user(wallet: str, update: UserUpdate, user = Depends(require_permission("user.promote"))):
    """
    SECTION 1: Admin capability to promote users to COMPANY or ADMIN.
    """
    db = get_supabase()
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    response = db.table("users").update(update_data).eq("wallet_address", wallet).execute()
    return {"status": "success", "data": response.data}

# --- Platform Schema Endpoints ---

@router.get("/schema")
async def get_admin_schema(user = Depends(require_permission("manage_schema"))):
    """
    SECTION 4: Fetch the complete dynamic profile schema.
    """
    db = get_supabase()
    response = db.table("profile_schema").select("*").order("display_order").execute()
    return response.data

@router.post("/schema")
async def create_schema_field(field: SchemaFieldCreate, user = Depends(require_permission("manage_schema"))):
    """
    SECTION 4: Add a new dynamic field to the profile schema.
    """
    db = get_supabase()
    response = db.table("profile_schema").insert(field.model_dump()).execute()
    return {"status": "success", "data": response.data}

@router.patch("/schema/{field_id}")
async def update_schema_field(field_id: str, field: Dict[str, Any], user = Depends(require_permission("manage_schema"))):
    """
    SECTION 4: Update a dynamic field's label or validation rules.
    """
    db = get_supabase()
    response = db.table("profile_schema").update(field).eq("id", field_id).execute()
    return {"status": "success", "data": response.data}

# --- Skill Taxonomy Endpoints ---

@router.get("/skills")
async def get_skill_taxonomy():
    """
    SECTION 10: Fetch the platform's standardized skill categories.
    """
    db = get_supabase()
    response = db.table("skill_categories").select("*").execute()
    return response.data

@router.post("/skills")
async def create_skill_category(category: Dict[str, Any], user = Depends(require_permission("manage_schema"))):
    """
    SECTION 10: Add a new skill category to the platform taxonomy.
    """
    db = get_supabase()
    response = db.table("skill_categories").insert(category).execute()
    return {"status": "success", "data": response.data}

# --- Feature Flag Endpoints ---

@router.get("/features")
async def get_feature_flags():
    """
    SECTION 11: Fetch all dynamic feature flags and their states.
    """
    db = get_supabase()
    response = db.table("feature_flags").select("*").execute()
    return response.data

@router.post("/features/update")
async def update_feature_flag(feature: FeatureToggleRequest, user = Depends(require_permission("manage_flags"))):
    """
    SECTION 11: Toggle AI, Web3, or Marketplace features in real-time.
    """
    db = get_supabase()
    response = db.table("feature_flags").update({
        "is_enabled": feature.is_enabled,
        "description": feature.description
    }).eq("feature_name", feature.feature_name).execute()
    return {"status": "success", "data": response.data}

# --- AI & Platform Settings ---

@router.get("/settings")
async def get_platform_settings():
    """
    SECTION 10: Fetch global AI configuration and tuning parameters.
    """
    db = get_supabase()
    response = db.table("platform_settings").select("*").execute()
    return response.data

@router.post("/settings")
async def update_settings(setting: PlatformSettingRequest, user = Depends(require_permission("manage_flags"))):
    """
    SECTION 10: Update AI resonance thresholds or platform-wide variables.
    """
    db = get_supabase()
    response = db.table("platform_settings").update({
        "setting_value": setting.setting_value
    }).eq("setting_key", setting.setting_key).execute()
    return {"status": "success", "data": response.data}

# --- UNIFIED CRUD ORCHESTRATION ('God Mode') ---

@router.get("/companies")
async def admin_get_companies(user = Depends(require_permission("admin.access"))):
    db = get_supabase()
    return db.table("companies").select("*").execute().data

@router.delete("/companies/{company_id}")
async def admin_delete_company(company_id: str, user = Depends(require_permission("admin.access"))):
    db = get_supabase()
    db.table("companies").delete().eq("id", company_id).execute()
    return {"status": "purged"}

@router.get("/all-jobs")
async def admin_get_all_jobs(user = Depends(require_permission("admin.access"))):
    db = get_supabase()
    return db.table("jobs").select("*, companies(name)").execute().data

@router.delete("/jobs/{job_id}")
async def admin_delete_job(job_id: str, user = Depends(require_permission("admin.access"))):
    db = get_supabase()
    db.table("jobs").delete().eq("id", job_id).execute()
    return {"status": "purged"}

@router.get("/all-applications")
async def admin_get_all_applications(user = Depends(require_permission("admin.access"))):
    db = get_supabase()
    return db.table("applications").select("*, jobs(title), users(wallet_address)").execute().data
