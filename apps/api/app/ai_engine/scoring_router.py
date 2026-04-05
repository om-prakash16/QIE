"""
Reputation Score Routes.
Calculates composite proof-score from skills, projects, GitHub, jobs, and Web3 activity.
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from db.supabase_client import get_supabase
from datetime import datetime

router = APIRouter()

# ─── Reputation Calculation ──────────────────────────────────────────

@router.get("/score")
async def get_reputation_score(wallet: str):
    """Calculate and return the composite reputation score."""
    db = get_supabase()

    if not db:
        return {
            "wallet_address": wallet,
            "total_score": 742,
            "max_score": 1000,
            "percentile": 88,
            "breakdown": {
                "skills_score": 82.0,
                "project_score": 78.5,
                "github_score": 71.0,
                "job_score": 65.0,
                "web3_score": 45.5
            },
            "weights": {
                "skills": 0.30,
                "projects": 0.25,
                "github": 0.20,
                "jobs": 0.15,
                "web3": 0.10
            },
            "level": "Expert",
            "badges": ["Rust Certified", "5+ Projects", "Active Web3 User"]
        }

    # Calculate each sub-score
    skills_score = await _calc_skills_score(db, wallet)
    project_score = await _calc_project_score(db, wallet)
    github_score = await _calc_github_score(db, wallet)
    job_score = await _calc_job_score(db, wallet)
    web3_score = 45.0  # Placeholder until Helius integration

    # Weighted composite
    total = (
        skills_score * 0.30 +
        project_score * 0.25 +
        github_score * 0.20 +
        job_score * 0.15 +
        web3_score * 0.10
    ) * 10  # Scale to 0-1000

    total = min(int(total), 1000)

    # Determine level
    level = "Beginner"
    if total >= 800: level = "Master"
    elif total >= 600: level = "Expert"
    elif total >= 400: level = "Intermediate"
    elif total >= 200: level = "Junior"

    # Store in history
    db.table("reputation_history").insert({
        "wallet_address": wallet,
        "total_score": total,
        "skills_score": skills_score,
        "project_score": project_score,
        "github_score": github_score,
        "job_score": job_score,
        "web3_score": web3_score
    }).execute()

    # Update user reputation
    db.table("users").update({"reputation_score": total}) \
        .eq("wallet_address", wallet).execute()

    return {
        "wallet_address": wallet,
        "total_score": total,
        "max_score": 1000,
        "breakdown": {
            "skills_score": skills_score,
            "project_score": project_score,
            "github_score": github_score,
            "job_score": job_score,
            "web3_score": web3_score
        },
        "weights": {
            "skills": 0.30,
            "projects": 0.25,
            "github": 0.20,
            "jobs": 0.15,
            "web3": 0.10
        },
        "level": level
    }


@router.get("/history")
async def get_reputation_history(wallet: str, limit: int = 30):
    """Get reputation score trend over time."""
    db = get_supabase()
    if not db:
        # Generate mock trend data
        import random
        base = 600
        return [
            {
                "total_score": min(base + i * 8 + random.randint(-5, 15), 1000),
                "recorded_at": f"2026-03-{str(5 + i).zfill(2)}T10:00:00"
            }
            for i in range(limit)
        ]

    response = db.table("reputation_history").select("total_score, recorded_at") \
        .eq("wallet_address", wallet) \
        .order("recorded_at", desc=True) \
        .limit(limit).execute()
    return response.data


# ─── Sub-Score Calculators ────────────────────────────────────────────

async def _calc_skills_score(db, wallet: str) -> float:
    """Score based on passed skill quizzes."""
    response = db.table("skill_quizzes").select("score, passed") \
        .eq("candidate_wallet", wallet).eq("passed", True).execute()
    if not response.data:
        return 0.0
    avg = sum(q["score"] for q in response.data) / len(response.data)
    return min(avg, 100.0)


async def _calc_project_score(db, wallet: str) -> float:
    """Score based on average AI project evaluation."""
    response = db.table("project_ledger").select("ai_score") \
        .eq("candidate_wallet", wallet).execute()
    if not response.data:
        return 0.0
    avg = sum(p["ai_score"] for p in response.data) / len(response.data)
    return min(avg, 100.0)


async def _calc_github_score(db, wallet: str) -> float:
    """Score based on GitHub activity (simplified)."""
    response = db.table("users").select("dynamic_fields") \
        .eq("wallet_address", wallet).single().execute()
    if response.data and response.data.get("dynamic_fields", {}).get("github_handle"):
        return 65.0  # Placeholder — would call GitHub API
    return 0.0


async def _calc_job_score(db, wallet: str) -> float:
    """Score based on job application success rate."""
    response = db.table("applications").select("status") \
        .eq("candidate_wallet", wallet).execute()
    if not response.data:
        return 0.0
    total = len(response.data)
    hired = len([a for a in response.data if a["status"] == "hired"])
    return min((hired / total) * 100, 100.0) if total > 0 else 0.0
