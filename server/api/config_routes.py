from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from db.supabase_client import get_supabase
from datetime import datetime

router = APIRouter()

# ─── Models ───────────────────────────────────────────────────────────
class AIConfigUpdate(BaseModel):
    weights: Dict[str, Any]
    description: Optional[str] = None
    is_active: Optional[bool] = None

class FeatureFlagUpdate(BaseModel):
    is_enabled: bool
    description: Optional[str] = None

# ─── AI Configuration Endpoints ───────────────────────────────────────

@router.get("/ai")
async def get_ai_config(key: str = "reputation_v1"):
    """Fetch the current AI weighting protocol."""
    db = get_supabase()
    if not db:
        return {
            "key": "reputation_v1",
            "weights": { "skill_weight": 0.4, "github_weight": 0.3, "project_weight": 0.3, "base_multiplier": 1.0 },
            "is_active": True,
            "description": "Mock AI config."
        }
    
    response = db.table("ai_configurations").select("*").eq("key", key).single().execute()
    return response.data

@router.put("/ai/{key}")
async def update_ai_config(key: str, config: AIConfigUpdate):
    """Modify the AI weighting protocol (e.g., reputation formula)."""
    db = get_supabase()
    if not db:
        return {"status": "mock", "message": "Updated (mock mode)"}
    
    update_data = {k: v for k, v in config.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now().isoformat()
    
    response = db.table("ai_configurations").update(update_data).eq("key", key).execute()
    return {"status": "success", "data": response.data}

# ─── Feature Toggle Endpoints ─────────────────────────────────────────

@router.get("/features")
async def list_all_feature_flags():
    """Fetch all dynamic platform feature toggles."""
    db = get_supabase()
    if not db:
        return []
    
    response = db.table("feature_flags").select("*").execute()
    return response.data

@router.patch("/features/{flag_id}")
async def update_feature_flag(flag_id: str, flag: FeatureFlagUpdate):
    """Enable or disable a specific platform feature."""
    db = get_supabase()
    if not db:
        return {"status": "mock", "message": "Flag updated (mock mode)"}
    
    update_data = {k: v for k, v in flag.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now().isoformat()
    
    response = db.table("feature_flags").update(update_data).eq("id", flag_id).execute()
    return {"status": "success", "data": response.data}
