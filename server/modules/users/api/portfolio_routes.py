"""
Portfolio & Project Ledger Routes.
Handles project submissions, AI scoring, and on-chain hash generation.
"""

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from typing import Optional, List
from core.supabase import get_supabase
from core.response import success_response
from core.dependencies import get_db, get_current_user_id
from datetime import datetime
import hashlib

router = APIRouter()


# ─── Models ───────────────────────────────────────────────────────────
class ProjectSubmission(BaseModel):
    project_name: str
    github_link: str
    description: str = ""
    tech_stack: List[str] = []
    live_url: Optional[str] = None


# ─── Endpoints ────────────────────────────────────────────────────────


@router.get("/projects")
async def get_projects(
    wallet: Optional[str] = Query(None),
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_db)
):
    """Fetch all projects for a user. If wallet is not provided, uses authenticated user's profile."""
    # If wallet is provided, we fetch by wallet (public view potentially)
    # Otherwise we fetch for the current user
    if wallet:
        response = (
            db.table("project_ledger")
            .select("*")
            .eq("candidate_wallet", wallet)
            .order("created_at", desc=True)
            .execute()
        )
    else:
        # We might need to map user_id to wallet if the table uses wallet
        user_res = db.table("users").select("wallet_address").eq("id", user_id).single().execute()
        wallet_address = user_res.data.get("wallet_address") if user_res.data else None
        
        if not wallet_address:
            return success_response(data=[])

        response = (
            db.table("project_ledger")
            .select("*")
            .eq("candidate_wallet", wallet_address)
            .order("created_at", desc=True)
            .execute()
        )
        
    return success_response(data=response.data)


@router.post("/projects")
async def add_project(
    data: ProjectSubmission,
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_db)
):
    """Submit a new project for AI evaluation and on-chain hashing."""
    
    # Get wallet address for the user
    user_res = db.table("users").select("wallet_address").eq("id", user_id).single().execute()
    wallet_address = user_res.data.get("wallet_address") if user_res.data else None
    
    if not wallet_address:
         from core.exceptions import ValidationError
         raise ValidationError(message="User has no linked wallet address")

    # Generate deterministic hash for on-chain storage
    hash_input = f"{data.project_name}|{data.github_link}|{'|'.join(data.tech_stack)}|{datetime.utcnow().isoformat()}"
    project_hash = "0x" + hashlib.sha256(hash_input.encode()).hexdigest()

    # AI project scoring (standard heuristic for now, future: service integration)
    ai_score = _calculate_project_score(data)

    project_data = {
        "candidate_wallet": wallet_address,
        "project_name": data.project_name,
        "github_link": data.github_link,
        "description": data.description,
        "tech_stack": data.tech_stack,
        "ai_score": ai_score,
        "on_chain_hash": project_hash,
    }

    response = db.table("project_ledger").insert(project_data).execute()
    
    return success_response(
        data=response.data[0] if response.data else project_data,
        meta={"on_chain_hash": project_hash, "ai_score": ai_score},
        message="Project successfully added to ledger"
    )


@router.delete("/projects/{project_id}")
async def delete_project(
    project_id: str,
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_db)
):
    """Remove a project from the portfolio."""
    # Security: check ownership via wallet
    user_res = db.table("users").select("wallet_address").eq("id", user_id).single().execute()
    wallet_address = user_res.data.get("wallet_address") if user_res.data else None

    if not wallet_address:
         from core.exceptions import AuthorizationError
         raise AuthorizationError(message="Unauthorized: No wallet linked to account")

    db.table("project_ledger").delete().eq("id", project_id).eq("candidate_wallet", wallet_address).execute()
    return success_response(message="Project removed from portfolio")


def _calculate_project_score(data: ProjectSubmission) -> int:
    """Calculate a project complexity score based on heuristics."""
    score = 50  # Base score

    # Tech stack diversity
    tech_count = len(data.tech_stack)
    if tech_count >= 4:
        score += 20
    elif tech_count >= 3:
        score += 15
    elif tech_count >= 2:
        score += 10

    # Description quality
    desc_len = len(data.description)
    if desc_len > 200:
        score += 15
    elif desc_len > 100:
        score += 10
    elif desc_len > 50:
        score += 5

    # Advanced tech detection
    advanced_tech = {"Rust", "Solana", "Cairo", "ZK", "Anchor", "Move", "Sui"}
    if any(t in advanced_tech for t in data.tech_stack):
        score += 10

    # GitHub link quality
    if data.github_link and "github.com" in data.github_link:
        score += 5

    # Live URL bonus
    if data.live_url:
        score += 5

    return min(score, 100)
