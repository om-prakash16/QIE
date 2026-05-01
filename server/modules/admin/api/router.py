from fastapi import APIRouter, Depends, Query, Body
from typing import Dict, Any, List

from core.response import success_response
from core.dependencies import get_current_user_id
from modules.auth.core.guards import require_admin, require_moderator, require_ai_admin
from modules.admin.core.service import admin_service
from modules.admin.core.schema_service import schema_service

router = APIRouter()

@router.post("/bootstrap")
async def bootstrap_platform(admin=Depends(require_admin)):
    """Production Bootstrap: Setup core roles and initial system data."""
    result = await admin_service.bootstrap_platform()
    return success_response(data=result, message="Bootstrap sequence completed")

@router.get("/dashboard")
async def get_admin_dashboard(admin=Depends(require_admin)):
    """Unified platform metrics for Super Admins."""
    metrics = await admin_service.get_dashboard_metrics()
    return success_response(data=metrics)

@router.get("/settings")
async def get_system_settings(admin=Depends(require_admin)):
    """Fetch platform-wide configuration settings."""
    settings = await admin_service.get_all_settings()
    return success_response(data=settings)

@router.patch("/settings")
async def update_system_setting(
    payload: Dict[str, Any] = Body(...),
    admin=Depends(require_admin)
):
    """Update a specific platform configuration."""
    key = payload.get("setting_key")
    val = payload.get("setting_value")
    result = await admin_service.update_setting(key, val)
    return success_response(data=result, message=f"Setting '{key}' updated")

@router.post("/moderate")
async def moderate_entity(
    target_id: str = Body(...),
    target_type: str = Body(...),
    action: str = Body(...),
    reason: str = Body(...),
    moderator=Depends(require_moderator)
):
    """Execute moderation actions (Warn, Suspend, Ban)."""
    result = await admin_service.moderate_entity(
        admin_id=moderator["id"],
        target_id=target_id,
        target_type=target_type,
        action=action,
        reason=reason
    )
    return success_response(data=result, message=f"Moderation action '{action}' executed")

@router.get("/users")
async def list_users(
    limit: int = Query(100),
    admin=Depends(require_admin)
):
    """List all registered users."""
    from core.supabase import get_supabase
    db = get_supabase()
    res = db.table("users").select("*, profiles(*)").limit(limit).execute()
    return success_response(data=res.data)

@router.get("/schema")
async def get_full_schema(admin=Depends(require_admin)):
    """Fetch all dynamic profile fields."""
    fields = await schema_service.get_all_fields()
    return success_response(data=fields)

@router.post("/schema")
async def save_schema_field(
    field: Dict[str, Any],
    admin=Depends(require_admin)
):
    """Add or update a dynamic profile field."""
    result = await schema_service.upsert_field(field)
    return success_response(data=result)
