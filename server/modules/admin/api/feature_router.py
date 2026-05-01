from fastapi import APIRouter, Depends, Body
from typing import Dict, Any, List
from pydantic import BaseModel
import uuid

from core.response import success_response
from core.dependencies import get_current_user_id
from modules.auth.core.guards import require_admin
from modules.admin.core.feature_service import FeatureFlagService

router = APIRouter()
feature_service = FeatureFlagService()

class FeatureUpdateReq(BaseModel):
    feature_name: str
    is_enabled: bool

@router.get("/list")
async def get_all_features(admin=Depends(require_admin)):
    """Fetch all feature flags and their current status."""
    features = await feature_service.list_all_features()
    return success_response(data=features)

@router.post("/update")
async def update_feature_status(
    req: FeatureUpdateReq,
    admin=Depends(require_admin)
):
    """Securely update feature status for administrators."""
    await feature_service.update_feature(
        feature_name=req.feature_name,
        is_enabled=req.is_enabled,
        admin_id=uuid.UUID(admin["id"]),
    )
    return success_response(
        data={"feature": req.feature_name, "is_enabled": req.is_enabled},
        message=f"Feature '{req.feature_name}' status updated"
    )
