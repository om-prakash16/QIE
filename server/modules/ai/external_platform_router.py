"""
External Platform Integration Router.
Handles connecting, verifying, and syncing external developer platforms.
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import Optional
from modules.auth.service import get_current_user
from modules.ai.services.external_platform_service import ExternalPlatformService
from core.supabase import get_supabase

router = APIRouter()
platform_service = ExternalPlatformService()


class ConnectPlatformRequest(BaseModel):
    platform: str  # github, kaggle, leetcode, stackoverflow, hackerrank
    external_username: str


class VerifyPlatformRequest(BaseModel):
    platform: str
    external_username: str
    verification_code: str


@router.get("/supported")
async def list_supported_platforms():
    """List all supported external platforms with their scoring weights."""
    return {
        "platforms": [
            {"name": "GitHub", "key": "github", "impacts": "github_score (20% of Proof-Score)", "status": "available"},
            {"name": "Kaggle", "key": "kaggle", "impacts": "project_score boost", "status": "available"},
            {"name": "StackOverflow", "key": "stackoverflow", "impacts": "skills_score boost", "status": "available"},
            {"name": "LeetCode", "key": "leetcode", "impacts": "skills_score boost", "status": "available"},
            {"name": "HackerRank", "key": "hackerrank", "impacts": "skills_score boost", "status": "available"},
        ]
    }


@router.post("/connect")
async def connect_platform(
    req: ConnectPlatformRequest,
    current_user=Depends(get_current_user)
):
    """
    Step 1: Initiate connection. Returns a verification code
    the user must add to their external profile bio.
    """
    if req.platform not in platform_service.PLATFORMS:
        raise HTTPException(status_code=400, detail=f"Unsupported platform: {req.platform}")

    user_id = current_user.get("sub") or current_user.get("id")
    code = platform_service.generate_verification_code(user_id, req.platform)

    return {
        "status": "pending_verification",
        "platform": req.platform,
        "external_username": req.external_username,
        "verification_code": code,
        "instructions": f"Add '{code}' to your {req.platform} profile bio, then call /verify."
    }


@router.post("/verify")
async def verify_platform_ownership(
    req: VerifyPlatformRequest,
    current_user=Depends(get_current_user)
):
    """
    Step 2: Verify that the user owns the external account
    by checking for the verification code in their bio.
    """
    result = platform_service.verify_bio_challenge(
        req.platform, req.external_username, req.verification_code
    )

    if result["verified"]:
        # Store the connection
        db = get_supabase()
        user_id = current_user.get("sub") or current_user.get("id")
        if db and user_id:
            try:
                db.table("activity_events").insert({
                    "actor_id": user_id,
                    "actor_type": "candidate",
                    "action": "platform_connected",
                    "entity_type": "external_platform",
                    "description": f"Verified and connected {req.platform} account: @{req.external_username}"
                }).execute()
            except Exception:
                pass

    return result


@router.get("/sync")
async def sync_platform_data(
    platform: str = Query(..., description="Platform to sync"),
    username: str = Query(..., description="Username on that platform"),
    current_user=Depends(get_current_user)
):
    """
    Step 3: Pull latest data from the connected platform
    and compute the scoring contribution.
    """
    if platform not in platform_service.PLATFORMS:
        raise HTTPException(status_code=400, detail=f"Unsupported platform: {platform}")

    data = platform_service.sync_platform(platform, username)
    return {
        "status": "synced",
        "data": data
    }
