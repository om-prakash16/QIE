from fastapi import APIRouter, Depends, Query
from typing import Optional

from core.response import success_response
from core.dependencies import get_db, get_validated_wallet

router = APIRouter()

@router.get("/predict")
async def predict_salary_fmv(
    role: str = Query("Software Engineer", description="Target job role"),
    location: str = Query("Remote", description="Target location"),
    wallet: str = Depends(get_validated_wallet)
):
    """
    AI Salary Prediction Endpoint.
    Calculates Fair Market Value (FMV) and premium based on verified Proof-Score.
    """
    db = await get_db()

    # 1. Fetch Candidate's Verification Data
    proof_score = 500
    skills = []

    rep_resp = (
        db.table("users")
        .select("reputation_score, profile_data")
        .eq("wallet_address", wallet)
        .single()
        .execute()
    )

    if rep_resp.data:
        proof_score = rep_resp.data.get("reputation_score", 500)
        skills = rep_resp.data.get("profile_data", {}).get("skills", [])

    # 2. Base Market Value (Production: fetch from market_data table)
    # For now, keeping the logic but cleaning the response
    base_salaries = {
        "Software Engineer": 110_000,
        "Senior Developer": 140_000,
        "Data Scientist": 125_000,
        "Smart Contract Engineer": 150_000,
        "Product Manager": 115_000,
    }
    base = base_salaries.get(role, 95_000)

    # 3. Premium Calculation
    score_delta = max(0, proof_score - 500)
    premium_percentage = (score_delta / 100) * 0.04

    rare_skills = [s.lower() for s in ["rust", "solana", "anchor", "go", "zkp"]]
    user_skills_lower = [s.lower() for s in skills]
    if any(rs in user_skills_lower for rs in rare_skills):
        premium_percentage += 0.08

    location_adjuster = 1.2 if location.lower() in ["san francisco", "new york", "london"] else 1.0

    fmv = int((base * (1 + premium_percentage)) * location_adjuster)
    
    return success_response(data={
        "wallet_address": wallet,
        "role": role,
        "location": location,
        "metrics": {
            "proof_score": proof_score,
            "skill_premium": f"+{round(premium_percentage * 100, 1)}%",
        },
        "salary_prediction": {
            "currency": "USD",
            "fair_market_value": fmv,
            "range": {"low": int(fmv * 0.9), "high": int(fmv * 1.15)},
            "insight": f"Based on verified Proof-Score ({proof_score}), this candidate commands a premium of {round(premium_percentage * 100, 1)}%."
        }
    })
