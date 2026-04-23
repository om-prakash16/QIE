from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from modules.auth.service import get_current_user
from core.supabase import get_supabase
from modules.users.service import UserService
from modules.users.schemas import FullProfileResponse

router = APIRouter()
user_service = UserService()

@router.post("/create")
async def create_new_user(email: str, wallet_address: str):
    """
    Step 4: Create a new user identity. Trigger will handle BHT code.
    """
    db = get_supabase()
    res = db.table("users").insert({
        "email": email,
        "wallet_address": wallet_address
    }).execute()
    return res.data[0]

@router.post("/profile/update")
async def update_profile_full(data: Dict[str, Any], current_user=Depends(get_current_user)):
    """
    Step 4: Comprehensive data insertion flow across normalized tables.
    """
    user_id = current_user["id"]
    db = get_supabase()

    # 1. Update Core Profile
    if "profile" in data:
        p = data["profile"]
        db.table("profiles").upsert({
            "user_id": user_id,
            "full_name": p.get("full_name"),
            "headline": p.get("headline"),
            "bio": p.get("bio"),
            "location": p.get("location")
        }).execute()

    # 2. Update Experiences (Delete & Replace for simplicity in Step 4)
    if "experiences" in data:
        db.table("experiences").delete().eq("user_id", user_id).execute()
        for exp in data["experiences"]:
            exp["user_id"] = user_id
            db.table("experiences").insert(exp).execute()

    # 3. Update Projects
    if "projects" in data:
        db.table("projects").delete().eq("user_id", user_id).execute()
        for proj in data["projects"]:
            proj["user_id"] = user_id
            db.table("projects").insert(proj).execute()

    # 4. Update Education
    if "education" in data:
        db.table("education").delete().eq("user_id", user_id).execute()
        for edu in data["education"]:
            edu["user_id"] = user_id
            db.table("education").insert(edu).execute()

    # 5. Handle AI Scores update if provided (usually internal)
    if "ai_scores" in data:
        scores = data["ai_scores"]
        db.table("ai_scores").upsert({
            "user_id": user_id,
            "proof_score": scores.get("proof_score", 0),
            "technical_score": scores.get("technical_score", 0)
        }).execute()

    return {"status": "success", "message": "All relational tables synchronized."}

@router.get("/portfolio/{user_code}", response_model=FullProfileResponse)
async def get_public_portfolio(user_code: str):
    """
    Publicly accessible portfolio endpoint by user_code.
    """
    portfolio = await user_service.get_portfolio_by_code(user_code)
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found or private")
    return portfolio

@router.get("/search/{user_code}")
async def search_candidate_by_code(user_code: str):
    """
    Search candidate by unique BHT code.
    """
    db = get_supabase()
    response = db.table("users").select("id, user_code, full_name, visibility").eq("user_code", user_code).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    user = response.data[0]
    if user["visibility"] == "private":
         raise HTTPException(status_code=403, detail="Candidate profile is private")
         
    return user

@router.get("/cv")
async def generate_dynamic_cv(current_user=Depends(get_current_user)):
    """
    Step 7: Endpoint for real-time CV generation using aggregated data.
    """
    from modules.users.cv_service import CVService
    cv_data = await CVService.generate_cv_data(current_user["id"])
    return {
        "status": "success",
        "message": "Dynamic CV generated from database state",
        "cv_layout": cv_data,
        "download_url": "/api/v1/profile/cv/download"
    }
