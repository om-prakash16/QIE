from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, Optional
from core.supabase import get_supabase
from modules.auth.service import get_current_user
from modules.ai.services.career_risk_service import CareerRiskService

router = APIRouter()
career_service = CareerRiskService()

@router.get("/")
async def get_career_risk_report(current_user = Depends(get_current_user)):
    """
    Fetch the AI Career Risk Report for the authenticated user.
    """
    user_id = current_user.get("sub")
    wallet = current_user.get("wallet_address")
    
    if not user_id:
        raise HTTPException(status_code=400, detail="User identification failed")

    db = get_supabase()
    
    # 1. Gather context data for the model
    profile_data = {}
    proof_score = 600 # Default fallback
    
    if db:
        # Fetch profile data
        user_resp = db.table("users").select("profile_data, role").eq("id", user_id).single().execute()
        if user_resp.data:
            profile_data = user_resp.data.get("profile_data", {})
            profile_data["role"] = user_resp.data.get("role", "Software Engineer")
            
        # Fetch current Proof Score
        rep_resp = db.table("reputation_history") \
            .select("total_score") \
            .eq("user_id", user_id) \
            .order("recorded_at", desc=True) \
            .limit(1) \
            .execute()
            
        if rep_resp.data:
            proof_score = rep_resp.data[0].get("total_score", 600)
            
    # 2. Run AI Analysis
    try:
        analysis = await career_service.get_career_risk_analysis(
            user_id=user_id,
            profile_data=profile_data,
            proof_score=proof_score
        )
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Analysis failed: {str(e)}")

@router.post("/analyze")
async def trigger_manual_recalculation(current_user = Depends(get_current_user)):
    """
    Force a refresh of the AI Career Risk metrics.
    """
    # In a real app, this might trigger a background task
    return await get_career_risk_report(current_user)
