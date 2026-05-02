from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from core.supabase import get_supabase
from core.response import success_response
from core.dependencies import get_db, get_current_user_id

router = APIRouter()


# ─── Models ───────────────────────────────────────────────────────────
class ProfileFieldCreate(BaseModel):
    label: str
    key: str
    type: str  # 'text', 'number', 'select', 'multiselect', 'date', 'file', 'url'
    required: bool = False
    placeholder: Optional[str] = None
    validation_rules: Optional[Dict[str, Any]] = None
    default_value: Optional[str] = None
    section_name: Optional[str] = "Professional Info"
    display_order: Optional[int] = 0


class ProfileFieldUpdate(BaseModel):
    label: Optional[str] = None
    type: Optional[str] = None
    required: Optional[bool] = None
    placeholder: Optional[str] = None
    validation_rules: Optional[Dict[str, Any]] = None
    default_value: Optional[str] = None
    section_name: Optional[str] = None
    display_order: Optional[int] = None


# ─── Profile Schema Endpoints ─────────────────────────────────────────


@router.get("/profile")
async def get_profile_schema(db = Depends(get_db)):
    """Retrieve the dynamic profile schema fields."""
    response = (
        db.table("profile_schema_fields").select("*").order("display_order").execute()
    )
    return success_response(data=response.data)


@router.post("/profile")
async def create_profile_field(
    field: ProfileFieldCreate,
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_db)
):
    """Add a new dynamic field to the profile schema. (Admin Only)"""
    # TODO: Add explicit admin check
    response = db.table("profile_schema_fields").insert(field.model_dump()).execute()
    return success_response(data=response.data, message="Profile field created")


@router.patch("/profile/{field_id}")
async def update_profile_field(
    field_id: str,
    field: ProfileFieldUpdate,
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_db)
):
    """Modify an existing dynamic profile field. (Admin Only)"""
    update_data = {k: v for k, v in field.model_dump().items() if v is not None}
    response = (
        db.table("profile_schema_fields")
        .update(update_data)
        .eq("id", field_id)
        .execute()
    )
    return success_response(data=response.data, message="Profile field updated")


@router.delete("/profile/{field_id}")
async def delete_profile_field(
    field_id: str,
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_db)
):
    """Remove a dynamic field from the profile schema. (Admin Only)"""
    db.table("profile_schema_fields").delete().eq("id", field_id).execute()
    return success_response(message="Field removed")


@router.post("/profile/reorder")
async def reorder_profile_fields(
    orders: List[Dict[str, Any]],
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_db)
):
    """Update the display order of multiple fields. (Admin Only)"""
    for item in orders:
        db.table("profile_schema_fields").update(
            {"display_order": item["display_order"]}
        ).eq("id", item["id"]).execute()

    return success_response(message="Schema reordered")
