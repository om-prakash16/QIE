from fastapi import APIRouter, Depends, Query, Body
from typing import Dict, Any

from core.response import success_response
from core.dependencies import get_db, get_current_user_id
from modules.users.core.service import UserService
from modules.users.schemas.schemas import FullProfileResponse

router = APIRouter()
user_service = UserService()

@router.get("/")
async def get_my_profile(
    user_id: str = Depends(get_current_user_id)
):
    """Fetch the complete profile for the authenticated user."""
    profile = await user_service.get_full_profile(user_id)
    return success_response(data=profile)

@router.post("/create")
async def create_new_user(
    email: str = Body(..., embed=True),
    wallet_address: str = Body(..., embed=True)
):
    """Create a new user identity."""
    db = await get_db()
    res = db.table("users").insert({
        "email": email,
        "wallet_address": wallet_address
    }).execute()
    return success_response(data=res.data[0])

@router.post("/profile/update")
async def update_profile_full(
    data: Dict[str, Any],
    user_id: str = Depends(get_current_user_id)
):
    """Update profile data across all normalized tables."""
    result = await user_service.update_profile(user_id, data)
    return success_response(data=result, message="Profile synchronized successfully")

@router.get("/portfolio/{user_code}")
async def get_public_portfolio(user_code: str):
    """Publicly accessible portfolio endpoint by user_code."""
    portfolio = await user_service.get_portfolio_by_code(user_code)
    return success_response(data=portfolio)

@router.get("/search/{user_code}")
async def search_candidate_by_code(user_code: str):
    """Search candidate by unique Best Hiring code."""
    db = await get_db()
    response = db.table("users").select("id, user_code, full_name, visibility").eq("user_code", user_code).execute()
    if not response.data:
        return success_response(data=None, message="Candidate not found", status_code=404)
    
    user = response.data[0]
    if user["visibility"] == "private":
         return success_response(data=None, message="Candidate profile is private", status_code=403)
         
    return success_response(data=user)

@router.get("/cv")
async def generate_dynamic_cv(
    user_id: str = Depends(get_current_user_id)
):
    """Generate dynamic CV data from database state."""
    from modules.users.core.cv_service import CVService
    cv_data = await CVService.generate_cv_data(user_id)
    return success_response(data={
        "cv_layout": cv_data,
        "download_url": "/api/v1/profile/cv/download"
    })
