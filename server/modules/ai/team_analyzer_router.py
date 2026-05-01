from fastapi import APIRouter, Depends, Query, HTTPException
from typing import Dict, Any

from core.response import success_response
from core.dependencies import get_db, get_current_user_id
from modules.ai.services.team_analyzer_service import team_analyzer_service

router = APIRouter()

@router.get("/analyze")
async def analyze_team_balance(
    company_id: str = Query(..., description="The ID of the company to analyze"),
    user_id: str = Depends(get_current_user_id)
):
    """
    Team Skill Balance Analyzer.
    Analyzes team vulnerabilities and skill gaps.
    """
    # TODO: Add role check (COMPANY/OWNER)
    try:
        analysis = await team_analyzer_service.analyze_team_balance(company_id)
        return success_response(data=analysis)
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"Team analysis failed: {e}")
        return success_response(data={"error": "Analysis engine unavailable"}, status_code=500)

@router.get("/benchmarks/industry")
async def get_industry_team_benchmarks(
    industry: str = Query("Technology")
):
    """Get standard team skill distributions for a specific industry."""
    # These would ideally come from a database table
    benchmarks = {
        "Technology": {"Frontend": 80, "Backend": 85, "DevOps": 60, "Security": 50, "AI": 40},
        "Fintech": {"Frontend": 70, "Backend": 90, "DevOps": 80, "Security": 95, "AI": 30},
        "Web3": {"Frontend": 75, "Backend": 85, "DevOps": 50, "Security": 90, "AI": 20},
    }
    data = benchmarks.get(industry, benchmarks["Technology"])
    return success_response(data={"industry": industry, "benchmarks": data})
