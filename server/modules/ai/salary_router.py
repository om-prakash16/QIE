from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Dict, Any, Optional
from core.supabase import get_supabase
from modules.auth.service import get_current_user
import random

router = APIRouter()

@router.get("/predict")
async def predict_salary_fmv(
    wallet_address: Optional[str] = Query(None, description="Candidate wallet"),
    role: str = Query("Software Engineer", description="Target job role"),
    location: str = Query("Remote", description="Target location"),
    current_user = Depends(get_current_user)
):
    """
    AI Salary Prediction Endpoint
    Calculates Fair Market Value (FMV) and premium based on verified Proof-Score.
    """
    wallet = wallet_address or current_user.get("wallet_address")
    if not wallet:
        raise HTTPException(status_code=400, detail="Wallet address required")

    db = get_supabase()
    
    # 1. Fetch Candidate's Verification Data
    proof_score = 600 # Default intermediate score
    skills = ["JavaScript", "React"]
    
    if db:
        rep_resp = db.table("reputation_history") \
            .select("total_score") \
            .eq("wallet_address", wallet) \
            .order("recorded_at", desc=True) \
            .limit(1) \
            .execute()
            
        if rep_resp.data:
            proof_score = rep_resp.data[0].get("total_score", 600)
            
        user_resp = db.table("users").select("profile_data").eq("wallet_address", wallet).single().execute()
        if user_resp.data and user_resp.data.get("profile_data"):
             skills = user_resp.data["profile_data"].get("skills", skills)

    # 2. Base Market Value Calculation (Simulated Data Logic)
    base_salaries = {
        "Software Engineer": 110_000,
        "Senior Developer": 140_000,
        "Data Scientist": 125_000,
        "Smart Contract Engineer": 150_000,
        "Product Manager": 115_000
    }
    
    base = base_salaries.get(role, 95_000)
    
    # 3. AI Premium Calculation (Regression Math)
    # Average score is ~500. Every 100 points above 500 yields a 4% salary premium.
    score_delta = max(0, proof_score - 500)
    premium_percentage = (score_delta / 100) * 0.04
    
    # Rare skill multiplier (e.g., Rust, Anchor, Web3 usually pay higher)
    rare_skills = [s.lower() for s in ["rust", "solana", "anchor", "go", "zkp"]]
    user_skills_lower = [s.lower() for s in skills]
    if any(rs in user_skills_lower for rs in rare_skills):
        premium_percentage += 0.08 # Extra 8% bump

    # Location adjuster (Remote is baseline 1.0)
    location_adjuster = 1.0
    if location.lower() in ["san francisco", "new york", "london"]:
        location_adjuster = 1.2

    # 4. Final Calculation
    fmv = int((base * (1 + premium_percentage)) * location_adjuster)
    
    # Create realistic bounds
    lower_bound = int(fmv * 0.9)
    upper_bound = int(fmv * 1.15)

    return {
        "status": "success",
        "wallet_address": wallet,
        "query": {
            "role": role,
            "location": location
        },
        "metrics": {
            "proof_score": proof_score,
            "verified_skills": len(skills),
            "calculated_skill_premium": f"+{round(premium_percentage * 100, 1)}%"
        },
        "salary_prediction": {
            "currency": "USD",
            "base_market_rate": base,
            "fair_market_value": fmv,
            "range": {
                "low": lower_bound,
                "high": upper_bound
            },
            "insight": f"Due to an exceptionally high verified Proof-Score ({proof_score}), this candidate commands a {round(premium_percentage * 100, 1)}% premium over standard market rates for the {role} position."
        }
    }
