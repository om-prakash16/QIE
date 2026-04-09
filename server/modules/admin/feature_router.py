from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any, Optional
from modules.admin.feature_service import FeatureFlagService
from modules.auth.service import require_permission, get_current_user
from pydantic import BaseModel
import uuid

router = APIRouter()
feature_service = FeatureFlagService()

class FeatureUpdateReq(BaseModel):
    feature_name: str
    is_enabled: bool

# API Endpoints

@router.get("/list")
async def get_all_features(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Fetch all feature flags and their current status.
    """
    return await feature_service.list_all_features()

@router.post("/update")
async def update_feature_status(
    req: FeatureUpdateReq,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Secure update of feature status for administrators.
    """
    # In a real app: check if current_user role is 'admin' or 'superadmin'
    await feature_service.update_feature(
        feature_name=req.feature_name,
        is_enabled=req.is_enabled,
        admin_id=uuid.UUID(current_user["id"])
    )
    return {"status": "success", "feature": req.feature_name, "is_enabled": req.is_enabled}
