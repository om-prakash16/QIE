from fastapi import APIRouter, Depends, Query, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from core.response import success_response
from core.dependencies import get_db, get_validated_wallet
from modules.ai.services.soft_skills_service import soft_skills_service

router = APIRouter()

# Scenarios kept as they are useful for frontend
SCENARIOS = {
    "crisis": {
        "id": "crisis_001",
        "title": "Production Outage Response",
        "evaluates": ["communication_clarity", "confidence", "leadership", "teamwork"],
    },
    "conflict": {
        "id": "conflict_001",
        "title": "Code Review Disagreement",
        "evaluates": ["teamwork", "communication_clarity", "confidence", "consistency"],
    },
    "leadership": {
        "id": "leadership_001",
        "title": "New Team Onboarding",
        "evaluates": ["leadership", "teamwork", "communication_clarity"],
    },
}

class ScenarioResponse(BaseModel):
    scenario_id: str
    response_text: str

@router.get("/scenarios")
async def list_scenarios():
    """Return all available workplace scenario prompts."""
    # In production: fetch from a 'scenarios' table
    return success_response(data=list(SCENARIOS.values()))

@router.post("/evaluate")
async def evaluate_soft_skills(
    payload: ScenarioResponse,
    wallet: str = Depends(get_validated_wallet)
):
    """
    Candidate submits their written response to a scenario.
    The AI NLP engine evaluates it across the 5 soft-skill pillars.
    """
    if len(payload.response_text.strip()) < 20:
        raise HTTPException(status_code=400, detail="Response too short")

    # Run the NLP analysis (Service is already AI-powered or heuristic)
    result = soft_skills_service.analyze_response(
        response_text=payload.response_text,
        scenario_type=payload.scenario_id
    )

    # Persist to Supabase
    db = await get_db()
    try:
        db.table("soft_skill_assessments").upsert({
            "candidate_wallet": wallet,
            "scenario_id": payload.scenario_id,
            "evaluation_data": result,
            "composite_score": result.get("composite_score", 0)
        }).execute()
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"Failed to persist soft skill evaluation: {e}")

    return success_response(data=result)

@router.get("/profile")
async def get_soft_skill_profile(
    wallet: str = Depends(get_validated_wallet)
):
    """
    Fetch the aggregated soft skill profile for a candidate.
    """
    db = await get_db()
    
    # Query all assessments for this candidate
    res = db.table("soft_skill_assessments").select("*").eq("candidate_wallet", wallet).execute()
    
    if not res.data:
        # Initial baseline if no assessments yet
        return success_response(data={
            "wallet_address": wallet,
            "soft_skills_matrix": {
                "composite_score": 0,
                "pillars": {},
                "summary": "No assessments completed yet."
            }
        })

    # Aggregation logic
    assessments = res.data
    avg_score = sum(a["composite_score"] for a in assessments) / len(assessments)
    
    return success_response(data={
        "wallet_address": wallet,
        "soft_skills_matrix": {
            "composite_score": int(avg_score),
            "assessment_count": len(assessments),
            "latest_evaluation": assessments[0]["evaluation_data"]
        }
    })
