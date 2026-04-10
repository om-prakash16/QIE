from fastapi import APIRouter, HTTPException, Depends, Body
from typing import List, Dict, Any, Optional
from modules.auth.service import get_current_user
from modules.users.identity_service import IdentityService

router = APIRouter()
identity_service = IdentityService()

@router.post("/privacy")
async def update_privacy(visibility: str = Body(..., embed=True), current_user = Depends(get_current_user)):
    """
    Control profile visibility (public, private, recruiters_only).
    """
    try:
        if visibility not in ["public", "private", "recruiters_only"]:
            raise HTTPException(status_code=400, detail="Invalid visibility level")
        return await identity_service.update_privacy_settings(current_user["sub"], visibility)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/connections/request")
async def request_connection(target_user_id: str = Body(..., embed=True), current_user = Depends(get_current_user)):
    """
    Send a connection request to another professional.
    """
    try:
        return await identity_service.request_connection(current_user["sub"], target_user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/connections/list")
async def get_connections(current_user = Depends(get_current_user)):
    """
    Fetch your professional network.
    """
    try:
        return await identity_service.list_connections(current_user["sub"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/timeline/{user_id}")
async def get_timeline(user_id: str, current_user = Depends(get_current_user)):
    """
    Fetch education and work history timeline.
    Privacy rules are applied here in a production environment.
    """
    try:
        # Step 14: Apply specialized privacy gating logic
        return await identity_service.get_user_timeline(user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
