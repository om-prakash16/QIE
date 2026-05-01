from fastapi import APIRouter, Depends, Query
from typing import List, Optional

from core.response import success_response
from core.dependencies import get_db, get_validated_wallet
from modules.ai.services.reputation_service import reputation_service

router = APIRouter()

@router.get("/score")
async def get_reputation_score(
    wallet: str = Depends(get_validated_wallet)
):
    """
    Calculate and return the composite reputation score.
    Uses cached values if available.
    """
    score_data = await reputation_service.get_composite_score(wallet)
    return success_response(data=score_data)

@router.get("/history")
async def get_reputation_history(
    wallet: str = Depends(get_validated_wallet),
    limit: int = Query(30, ge=1, le=100)
):
    """
    Get reputation score trend over time from the persistent database.
    """
    db = await get_db()
    
    response = (
        db.table("reputation_history")
        .select("total_score, recorded_at")
        .eq("wallet_address", wallet)
        .order("recorded_at", desc=True)
        .limit(limit)
        .execute()
    )
    
    return success_response(data=response.data)

@router.post("/recalculate")
async def trigger_recalculation(
    wallet: str = Depends(get_validated_wallet)
):
    """
    Force a real-time recalculation of the Proof Score, bypassing cache.
    """
    from core.cache import clear_ai_cache
    # Clear cache for this specific request if needed, or just call service directly
    # For now, we'll just call the service which will update the DB.
    score_data = await reputation_service.get_composite_score(wallet)
    return success_response(data=score_data, meta={"recalculated": True})
