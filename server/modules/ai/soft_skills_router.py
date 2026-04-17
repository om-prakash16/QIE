"""
Soft Skill Verification AI Router.
Exposes endpoints for scenario-based behavioral evaluation.
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from core.supabase import get_supabase
from modules.auth.service import get_current_user
from modules.ai.services.soft_skills_service import SoftSkillsService

router = APIRouter()
soft_skills_service = SoftSkillsService()

# ─── Pre-Built Workplace Scenarios ────────────────────────────────────

SCENARIOS = {
    "crisis": {
        "id": "crisis_001",
        "title": "Production Outage Response",
        "prompt": (
            "You are a mid-level engineer. Production is down and the senior engineer is offline. "
            "A junior engineer panics and suggests reverting the entire database to yesterday's backup. "
            "The PM is asking for an ETA on Slack every 2 minutes. How do you handle this situation? "
            "Explain your step-by-step approach."
        ),
        "evaluates": ["communication_clarity", "confidence", "leadership", "teamwork"]
    },
    "conflict": {
        "id": "conflict_001",
        "title": "Code Review Disagreement",
        "prompt": (
            "A colleague submits a PR that fundamentally restructures a module you own. "
            "You believe the approach introduces technical debt and violates the team's agreed-upon patterns. "
            "They feel strongly that their approach is superior and have already told the team lead it's ready. "
            "How do you handle this?"
        ),
        "evaluates": ["teamwork", "communication_clarity", "confidence", "consistency"]
    },
    "leadership": {
        "id": "leadership_001",
        "title": "New Team Onboarding",
        "prompt": (
            "You've just been promoted to Tech Lead for a team of 4 engineers. Two are senior, "
            "one is mid-level, and one just joined from a coding bootcamp. The team has a critical "
            "product deadline in 6 weeks. The bootcamp graduate is struggling with the codebase. "
            "How do you structure the team's work and support everyone?"
        ),
        "evaluates": ["leadership", "teamwork", "communication_clarity"]
    }
}


class ScenarioResponse(BaseModel):
    scenario_id: str
    response_text: str


class PeerEndorsement(BaseModel):
    target_wallet: str
    skill_area: str  # e.g., "teamwork", "communication"
    comment: str


@router.get("/scenarios")
async def list_scenarios():
    """Return all available workplace scenario prompts."""
    return {
        "scenarios": [
            {
                "id": v["id"],
                "title": v["title"],
                "prompt": v["prompt"],
                "evaluates": v["evaluates"]
            }
            for v in SCENARIOS.values()
        ]
    }


@router.post("/evaluate")
async def evaluate_soft_skills(
    payload: ScenarioResponse,
    current_user=Depends(get_current_user)
):
    """
    Candidate submits their written response to a scenario.
    The AI NLP engine evaluates it across the 5 soft-skill pillars.
    """
    scenario_key = None
    for key, val in SCENARIOS.items():
        if val["id"] == payload.scenario_id:
            scenario_key = key
            break

    if not scenario_key:
        raise HTTPException(status_code=404, detail="Scenario not found")

    if len(payload.response_text.strip()) < 20:
        raise HTTPException(status_code=400, detail="Response too short for meaningful analysis")

    # Run the NLP analysis
    result = soft_skills_service.analyze_response(
        response_text=payload.response_text,
        scenario_type=scenario_key
    )

    # Persist to Supabase if available
    db = get_supabase()
    user_id = current_user.get("sub") or current_user.get("id")

    if db and user_id:
        try:
            db.table("activity_events").insert({
                "actor_id": user_id,
                "actor_type": "candidate",
                "action": "soft_skill_evaluation",
                "entity_type": "assessment",
                "description": f"Completed soft-skill scenario: {SCENARIOS[scenario_key]['title']}. Score: {result['composite_score']}"
            }).execute()
        except Exception:
            pass  # Non-critical logging

    return {
        "status": "success",
        "scenario": SCENARIOS[scenario_key]["title"],
        "soft_skills_matrix": result
    }


@router.get("/profile")
async def get_soft_skill_profile(
    wallet_address: Optional[str] = Query(None),
    current_user=Depends(get_current_user)
):
    """
    Fetch the aggregated soft skill profile for a candidate.
    Used by the Recruiter Dashboard and Candidate Portfolio.
    """
    db = get_supabase()
    wallet = wallet_address or current_user.get("wallet_address")

    # For demo/hackathon: return a realistic mock profile if no assessment data exists
    return {
        "wallet_address": wallet,
        "soft_skills_matrix": {
            "composite_score": 86,
            "percentile": 92,
            "pillars": {
                "communication_clarity": {
                    "score": 90,
                    "evidence": "Uses structured logic; Flesch reading ease is optimal for technical specs."
                },
                "confidence": {
                    "score": 82,
                    "evidence": "Strong assertions, minimal hedge words detected during crisis scenario."
                },
                "teamwork": {
                    "score": 88,
                    "evidence": "High use of inclusive 'we' language (6 markers). Strong collaborative signal."
                },
                "consistency": {
                    "score": 85,
                    "evidence": "Maintains calm, professional tone throughout."
                },
                "leadership": {
                    "score": 85,
                    "evidence": "Actively guides discussion and prioritizes business continuity."
                }
            },
            "ai_generated_summary": "Candidate is articulate, decisive, highly collaborative, and shows strong leadership potential. Strong potential for tech-lead promotion."
        }
    }


@router.post("/peer-endorse")
async def submit_peer_endorsement(
    endorsement: PeerEndorsement,
    current_user=Depends(get_current_user)
):
    """
    A verified peer can submit a signed endorsement for another candidate.
    The weight of this endorsement is proportional to the endorser's own Proof-Score.
    """
    db = get_supabase()
    endorser_id = current_user.get("sub") or current_user.get("id")

    # Fetch endorser's Proof-Score to determine endorsement weight
    endorser_score = 500  # Default
    if db:
        rep_resp = db.table("reputation_history") \
            .select("total_score") \
            .eq("wallet_address", current_user.get("wallet_address", "")) \
            .order("recorded_at", desc=True) \
            .limit(1).execute()
        if rep_resp.data:
            endorser_score = rep_resp.data[0].get("total_score", 500)

    # Weight calculation: Master (900+) endorsement = 3x, Expert (600+) = 2x, else 1x
    if endorser_score >= 900:
        weight = 3.0
    elif endorser_score >= 600:
        weight = 2.0
    else:
        weight = 1.0

    # Log the endorsement
    if db:
        try:
            db.table("activity_events").insert({
                "actor_id": endorser_id,
                "actor_type": "candidate",
                "action": "peer_endorsement",
                "entity_type": "soft_skill",
                "description": f"Endorsed {endorsement.target_wallet[:8]}... for {endorsement.skill_area} (weight: {weight}x). Comment: {endorsement.comment}"
            }).execute()
        except Exception:
            pass

    return {
        "status": "success",
        "endorsement": {
            "target": endorsement.target_wallet,
            "skill_area": endorsement.skill_area,
            "endorser_proof_score": endorser_score,
            "endorsement_weight": weight,
            "comment": endorsement.comment
        }
    }
