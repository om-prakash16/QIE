from fastapi import APIRouter, Depends, Query, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any

from core.response import success_response
from core.dependencies import get_db, get_current_user_id
from modules.ai.services.external_platform_service import external_platform_service

router = APIRouter()

class ConnectPlatformRequest(BaseModel):
    platform: str
    external_username: str

class VerifyPlatformRequest(BaseModel):
    platform: str
    external_username: str
    verification_code: str

@router.get("/supported")
async def list_supported_platforms():
    """List all supported external platforms."""
    platforms = [
        {"name": "GitHub", "key": "github", "impact": "20%"},
        {"name": "Kaggle", "key": "kaggle", "impact": "Bonus"},
        {"name": "StackOverflow", "key": "stackoverflow", "impact": "Bonus"},
        {"name": "LeetCode", "key": "leetcode", "impact": "Bonus"},
    ]
    return success_response(data=platforms)

@router.post("/connect")
async def connect_platform(
    req: ConnectPlatformRequest,
    user_id: str = Depends(get_current_user_id)
):
    """Initiate connection. Returns a verification code."""
    code = await external_platform_service.generate_verification_code(user_id, req.platform)
    return success_response(data={
        "status": "pending_verification",
        "platform": req.platform,
        "external_username": req.external_username,
        "verification_code": code,
        "instructions": f"Add '{code}' to your {req.platform} profile bio."
    })

@router.post("/verify")
async def verify_platform_ownership(
    req: VerifyPlatformRequest,
    user_id: str = Depends(get_current_user_id)
):
    """Verify ownership via bio challenge."""
    result = await external_platform_service.verify_bio_challenge(
        req.platform, req.external_username, req.verification_code
    )
    
    if result.get("verified"):
        db = await get_db()
        # Save connection to DB
        try:
            db.table("external_accounts").upsert({
                "user_id": user_id,
                "platform": req.platform,
                "external_username": req.external_username,
                "verified": True
            }).execute()
        except Exception as e:
            import logging
            logging.getLogger(__name__).error(f"Failed to save external account: {e}")

    return success_response(data=result)

@router.get("/sync")
async def sync_platform_data(
    platform: str = Query(...),
    username: str = Query(...),
    user_id: str = Depends(get_current_user_id)
):
    """Pull latest data and re-calculate scores."""
    data = await external_platform_service.sync_platform(platform, username)
    return success_response(data=data, meta={"synced_at": "now"})
