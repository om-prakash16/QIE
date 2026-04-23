from fastapi import APIRouter, Depends, HTTPException, Body
from typing import Dict, Any, List
from modules.auth.guards import require_admin, require_moderator, require_ai_admin
from modules.admin.service import AdminService

router = APIRouter()
admin_service = AdminService()

@router.get("/dashboard")
async def get_admin_dashboard(admin=Depends(require_admin)):
    """
    Fetch unified platform metrics for Super Admins.
    """
    return await admin_service.get_dashboard_metrics()

@router.post("/features/toggle")
async def toggle_feature_flag(
    feature_name: str, 
    enabled: bool, 
    admin=Depends(require_admin)
):
    """
    Enable/Disable system features on the fly.
    """
    return await admin_service.toggle_feature(feature_name, enabled)

@router.patch("/ai-config")
async def update_ai_config(
    weights: Dict[str, float] = Body(...), 
    admin=Depends(require_ai_admin)
):
    """
    Adjust AI Proof Score logic and weights live.
    """
    return await admin_service.update_ai_weights(weights)

@router.post("/moderate")
async def moderate_entity(
    target_id: str, 
    target_type: str, 
    action: str, 
    reason: str, 
    moderator=Depends(require_moderator)
):
    """
    Execute moderation actions (Warn, Suspend, Ban).
    """
    return await admin_service.moderate_entity(
        admin_id=moderator["id"],
        target_id=target_id,
        target_type=target_type,
        action=action,
        reason=reason
    )

@router.get("/users")
async def list_users(admin=Depends(require_admin)):
    """
    Paginated list of all users for administration.
    """
    from core.supabase import get_supabase
    db = get_supabase()
    res = db.table("users").select("*, profiles(*)").limit(100).execute()
    return res.data

# --- Dynamic Schema Management ---
from modules.admin.schema_service import SchemaService
schema_service = SchemaService()

@router.get("/schema")
async def get_full_schema(admin=Depends(require_admin)):
    """Fetch all profile fields for the builder UI."""
    return await schema_service.get_all_fields()

@router.post("/schema")
async def save_schema_field(field: Dict[str, Any], admin=Depends(require_admin)):
    """Add or update a dynamic field."""
    return await schema_service.upsert_field(field)
