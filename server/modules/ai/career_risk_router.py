from fastapi import APIRouter, Depends, HTTPException
from core.response import success_response
from core.dependencies import get_db, get_current_user_id
from modules.ai.services.career_risk_service import career_service

router = APIRouter()

@router.get("/")
async def get_career_risk_report(user_id: str = Depends(get_current_user_id)):
    """
    Fetch the AI Career Risk Report for the authenticated user.
    """
    db = await get_db()

    # 1. Gather context data for the model
    profile_data = {}
    proof_score = 500

    user_resp = db.table("users").select("profile_data, reputation_score").eq("id", user_id).single().execute()
    if user_resp.data:
        profile_data = user_resp.data.get("profile_data", {})
        proof_score = user_resp.data.get("reputation_score", 500)

    # 2. Run AI Analysis
    try:
        analysis = await career_service.get_career_risk_analysis(
            user_id=user_id, 
            profile_data=profile_data, 
            proof_score=proof_score
        )
        return success_response(data=analysis)
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"Career risk analysis failed: {e}")
        return success_response(data={"error": "Analysis temporarily unavailable"}, status_code=500)

@router.post("/analyze")
async def trigger_manual_recalculation(user_id: str = Depends(get_current_user_id)):
    """
    Force a refresh of the AI Career Risk metrics.
    """
    return await get_career_risk_report(user_id)
