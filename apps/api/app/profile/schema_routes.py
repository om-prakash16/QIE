from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from db.supabase_client import get_supabase
from datetime import datetime
import uuid

router = APIRouter()

# ─── Models ───────────────────────────────────────────────────────────
class ProfileFieldCreate(BaseModel):
    label: str
    key: str
    type: str # 'text', 'number', 'select', 'multiselect', 'date', 'file', 'url'
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
async def get_profile_schema():
    """Retrieve the dynamic profile schema fields."""
    db = get_supabase()
    if not db:
        return []
    
    response = db.table("profile_schema_fields").select("*").order("display_order").execute()
    return response.data

@router.post("/profile")
async def create_profile_field(field: ProfileFieldCreate):
    """Add a new dynamic field to the profile schema."""
    db = get_supabase()
    if not db:
        return {"status": "mock", "message": "Field created (mock mode)"}
    
    response = db.table("profile_schema_fields").insert(field.model_dump()).execute()
    return {"status": "success", "data": response.data}

@router.patch("/profile/{field_id}")
async def update_profile_field(field_id: str, field: ProfileFieldUpdate):
    """Modify an existing dynamic profile field."""
    db = get_supabase()
    if not db:
        return {"status": "mock", "message": "Field updated (mock mode)"}
    
    update_data = {k: v for k, v in field.model_dump().items() if v is not None}
    response = db.table("profile_schema_fields").update(update_data).eq("id", field_id).execute()
    return {"status": "success", "data": response.data}

@router.delete("/profile/{field_id}")
async def delete_profile_field(field_id: str):
    """Remove a dynamic field from the profile schema."""
    db = get_supabase()
    if not db:
        return {"status": "mock", "message": "Field deleted (mock mode)"}
    
    response = db.table("profile_schema_fields").delete().eq("id", field_id).execute()
    return {"status": "success", "message": "Field removed"}

@router.post("/profile/reorder")
async def reorder_profile_fields(orders: List[Dict[str, Any]]):
    """Update the display order of multiple fields."""
    db = get_supabase()
    if not db:
        return {"status": "mock", "message": "Reordered (mock mode)"}
    
    for item in orders:
        db.table("profile_schema_fields").update({"display_order": item['display_order']}).eq("id", item['id']).execute()
    
    return {"status": "success", "message": "Schema reordered"}
