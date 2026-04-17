from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from modules.auth.service import get_current_user
from modules.analytics.market_intelligence_service import MarketIntelligenceService

router = APIRouter()
intelligence_service = MarketIntelligenceService()

@router.get("/")
async def get_talent_market_intelligence(current_user = Depends(get_current_user)):
    """
    Fetch the AI Talent Market Heatmap and Future Predictions.
    """
    try:
        # Aggregated demand/supply
        market_data = await intelligence_service.get_market_heatmap_data()
        
        # Future Predictions using AI
        predictions = await intelligence_service.get_future_predictions(market_data)
        
        return {
            "status": "success",
            "market_data": market_data,
            "predictions": predictions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Market analysis failed: {str(e)}")

@router.post("/recompute")
async def trigger_intelligence_refresh(current_user = Depends(get_current_user)):
    """
    Manually trigger a re-computation of the market heatmap.
    """
    # In a larger system, this would be an async background task
    return await get_talent_market_intelligence(current_user)
