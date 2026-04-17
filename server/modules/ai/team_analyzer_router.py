"""
Team Skill Balance Analyzer Router.
Endpoints for analyzing company team vulnerabilities and skill gaps.
"""
from fastapi import APIRouter, Depends, Query, HTTPException
from typing import Dict, Any, Optional
from modules.auth.service import get_current_user
from modules.ai.services.team_analyzer_service import TeamAnalyzerService

router = APIRouter()
analyzer_service = TeamAnalyzerService()


@router.get("/analyze")
async def analyze_team_balance(
    company_id: str = Query(..., description="The ID of the company to analyze"),
    current_user=Depends(get_current_user)
):
    """
    Team Skill Balance Analyzer.
    Analyzes the combined skill graph of all company members to find 
    vulnerabilities (SPFs), overlaps, and hiring recommendations.
    """
    # Permission check: ideally only COMPANY role or OWNER of this company
    # For now, we allow authenticated access for the hackathon demo
    try:
        analysis = analyzer_service.analyze_team_balance(company_id)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/benchmarks/industry")
async def get_industry_team_benchmarks(
    industry: str = Query("Technology", description="Industry to benchmark against"),
    current_user=Depends(get_current_user)
):
    """Get standard team skill distributions for a specific industry."""
    # Simulated industry benchmarks
    benchmarks = {
        "Technology": {"Frontend": 80, "Backend": 85, "DevOps": 60, "Security": 50, "AI": 40},
        "Fintech": {"Frontend": 70, "Backend": 90, "DevOps": 80, "Security": 95, "AI": 30},
        "Web3": {"Frontend": 75, "Backend": 85, "DevOps": 50, "Security": 90, "AI": 20}
    }
    
    return {
        "industry": industry,
        "standard_distribution": benchmarks.get(industry, benchmarks["Technology"])
    }
