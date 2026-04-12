from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, Optional
from modules.auth.service import require_permission
from core.supabase import get_supabase
from pydantic import BaseModel
from modules.activity.service import record_event

router = APIRouter()


# -- Request models --

class SchemaFieldCreate(BaseModel):
    id: Optional[str] = None
    field_name: str
    field_label: Optional[str] = None
    field_type: str  # text | number | select | date | file_upload
    section: str = "General"
    required: bool = False
    placeholder: Optional[str] = None
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


# -- Users --

@router.get("/users")
async def get_all_users(user = Depends(require_permission("user.promote"))):
    """List all registered users, ordered by registration date."""
    db = get_supabase()
    return db.table("users").select("*").order("created_at", desc=True).execute().data


@router.patch("/users/{wallet}")
async def update_user(wallet: str, update: UserUpdate, user = Depends(require_permission("user.promote"))):
    """
    Update a user's role or active status by wallet address.

    Primarily used to promote users to COMPANY or revoke access.
    Only non-null fields in the request body are applied.
    """
    db = get_supabase()
    changes = {k: v for k, v in update.model_dump().items() if v is not None}
    result = db.table("users").update(changes).eq("wallet_address", wallet).execute()
    return {"status": "success", "data": result.data}


# -- Dynamic profile schema --

@router.get("/schema")
async def get_admin_schema(user = Depends(require_permission("manage_schema"))):
    """Return all profile schema fields in display order."""
    db = get_supabase()
    return db.table("profile_schema").select("*").order("display_order").execute().data


@router.post("/schema")
async def create_schema_field(field: SchemaFieldCreate, user = Depends(require_permission("manage_schema"))):
    """Add a new field to the dynamic profile schema."""
    db = get_supabase()
    result = db.table("profile_schema").insert(field.model_dump()).execute()
    return {"status": "success", "data": result.data}


@router.patch("/schema/{field_id}")
async def update_schema_field(field_id: str, field: Dict[str, Any], user = Depends(require_permission("manage_schema"))):
    """Patch a schema field — useful for renaming labels or tightening validation."""
    db = get_supabase()
    result = db.table("profile_schema").update(field).eq("id", field_id).execute()
    return {"status": "success", "data": result.data}


# -- Skill taxonomy --

@router.get("/skills")
async def get_skill_taxonomy():
    """Return the platform's canonical skill category list."""
    db = get_supabase()
    return db.table("skill_categories").select("*").execute().data


@router.post("/skills")
async def create_skill_category(category: Dict[str, Any], user = Depends(require_permission("manage_schema"))):
    """Append a new skill category to the taxonomy."""
    db = get_supabase()
    result = db.table("skill_categories").insert(category).execute()
    return {"status": "success", "data": result.data}


# -- Feature flags --

@router.get("/features")
async def get_feature_flags():
    """Return all feature flags and their current enabled state."""
    db = get_supabase()
    return db.table("feature_flags").select("*").execute().data


@router.post("/features/update")
async def update_feature_flag(feature: FeatureToggleRequest, user = Depends(require_permission("manage_flags"))):
    """Toggle a named feature flag. Takes effect immediately without a deploy."""
    db = get_supabase()
    result = db.table("feature_flags").update({
        "is_enabled": feature.is_enabled,
        "description": feature.description,
    }).eq("feature_name", feature.feature_name).execute()
    return {"status": "success", "data": result.data}


# -- Platform settings --

@router.get("/settings")
async def get_platform_settings():
    """Return all key/value platform configuration entries."""
    db = get_supabase()
    return db.table("platform_settings").select("*").execute().data


@router.post("/settings")
async def update_settings(setting: PlatformSettingRequest, user = Depends(require_permission("manage_flags"))):
    """Update a single platform setting by key."""
    db = get_supabase()
    result = db.table("platform_settings").update({
        "setting_value": setting.setting_value,
    }).eq("setting_key", setting.setting_key).execute()
    return {"status": "success", "data": result.data}


# -- Company moderation --

@router.get("/companies")
async def admin_get_companies(user = Depends(require_permission("admin.access"))):
    """List all companies on the platform."""
    db = get_supabase()
    return db.table("companies").select("*").execute().data


@router.delete("/companies/{company_id}")
async def admin_delete_company(company_id: str, user = Depends(require_permission("admin.access"))):
    """Hard-delete a company. This cascades to jobs and applications."""
    db = get_supabase()
    db.table("companies").delete().eq("id", company_id).execute()
    return {"status": "deleted"}


@router.patch("/companies/{company_id}/verify")
async def admin_verify_company(company_id: str, user = Depends(require_permission("admin.access"))):
    """
    Mark a company as verified.

    Verified companies get a badge on their listings and unlock higher job
    visibility in search results. Requires manual admin review before approval.
    """
    db = get_supabase()
    result = db.table("companies").update({"verified": True}).eq("id", company_id).execute()

    await record_event(
        actor_id=user.get("sub", ""),
        actor_role="admin",
        event_type="verified_company",
        description="Verified a company entity",
        entity_type="company",
        entity_id=company_id,
    )

    return {"status": "verified", "data": result.data}


# -- Job & application oversight --

@router.get("/all-jobs")
async def admin_get_all_jobs(user = Depends(require_permission("admin.access"))):
    """Return every job listing across all companies with engagement telemetry."""
    db = get_supabase()
    jobs = db.table("jobs").select("*, companies(name)").execute().data
    
    if not jobs:
        return []
        
    # Enrich with application and save counts
    # In a production app, this should be done via a view or an aggregation query
    for job in jobs:
        apps = db.table("applications").select("id", count="exact").eq("job_id", job["id"]).execute()
        saves = db.table("saved_jobs").select("id", count="exact").eq("job_id", job["id"]).execute()
        job["application_count"] = apps.count or 0
        job["save_count"] = saves.count or 0
        
    return jobs


@router.delete("/jobs/{job_id}")
async def admin_delete_job(job_id: str, user = Depends(require_permission("admin.access"))):
    """Remove a job listing."""
    db = get_supabase()
    db.table("jobs").delete().eq("id", job_id).execute()
    return {"status": "deleted"}


@router.get("/all-applications")
async def admin_get_all_applications(user = Depends(require_permission("admin.access"))):
    """Return all applications platform-wide with job title and applicant wallet."""
    db = get_supabase()
    return db.table("applications").select("*, jobs(title), users(wallet_address)").execute().data
# -- Skill Verification Moderation --

@router.get("/verification-queue")
async def get_verification_queue(user = Depends(require_permission("admin.access"))):
    """List all pending verification requests."""
    db = get_supabase()
    return db.table("moderation_queue").select("*").eq("status", "pending").execute().data

@router.patch("/verification/{entry_id}/approve")
async def approve_verification(entry_id: str, user = Depends(require_permission("admin.access"))):
    """
    Approve a verification request from the moderation queue.
    Updates the target entity (e.g., skill) as verified.
    """
    db = get_supabase()
    
    # 1. Fetch moderation entry
    entry = db.table("moderation_queue").select("*").eq("id", entry_id).single().execute()
    if not entry.data:
        raise HTTPException(status_code=404, detail="Moderation entry not found")
        
    entity_id = entry.data["entity_id"]
    entity_type = entry.data["entity_type"]
    
    # 2. Update the target entity
    if entity_type == "skill":
        db.table("user_skills").update({"is_verified": True}).eq("id", entity_id).execute()
        
        # Add to skill_verification_flags for audit
        db.table("skill_verification_flags").insert({
            "user_id": db.table("user_skills").select("user_id").eq("id", entity_id).single().execute().data["user_id"],
            "skill_key": db.table("user_skills").select("skill_name").eq("id", entity_id).single().execute().data["skill_name"],
            "verified_by": user.get("sub", ""),
            "verification_method": "manual_review",
            "is_verified": True
        }).execute()
    
    # 3. Mark moderation entry as resolved
    db.table("moderation_queue").update({"status": "approved"}).eq("id", entry_id).execute()
    
    await record_event(
        actor_id=user.get("sub", ""),
        actor_role="admin",
        event_type="approved_verification",
        description=f"Approved {entity_type} verification",
        entity_type=entity_type,
        entity_id=entity_id,
    )
    
    return {"status": "success", "message": "Verification approved"}
