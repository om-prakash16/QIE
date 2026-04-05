"""
Portfolio & Project Ledger Routes.
Handles project submissions, AI scoring, and on-chain hash generation.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from db.supabase_client import get_supabase
from datetime import datetime
import hashlib
import os

router = APIRouter()

# ─── Models ───────────────────────────────────────────────────────────
class ProjectSubmission(BaseModel):
    wallet_address: str
    project_name: str
    github_link: str
    description: str = ""
    tech_stack: List[str] = []
    live_url: Optional[str] = None

# ─── Endpoints ────────────────────────────────────────────────────────

@router.get("/projects")
async def get_projects(wallet: str):
    """Fetch all projects for a user."""
    db = get_supabase()
    if not db:
        return [
            {
                "id": "mock-1",
                "project_name": "DeFi Yield Aggregator",
                "github_link": "https://github.com/demo/defi-aggregator",
                "description": "A cross-chain yield optimization protocol that routes liquidity across multiple DeFi platforms.",
                "tech_stack": ["Rust", "Solana", "React", "TypeScript"],
                "ai_score": 94,
                "on_chain_hash": "0x7f8e2a1b3c4d5e6f...",
                "created_at": "2026-04-01T10:00:00"
            },
            {
                "id": "mock-2",
                "project_name": "ZK Voting dApp",
                "github_link": "https://github.com/demo/zk-voting",
                "description": "Privacy-preserving voting system using zero-knowledge proofs on Solana.",
                "tech_stack": ["Cairo", "Next.js", "Anchor"],
                "ai_score": 89,
                "on_chain_hash": "0x3a4b5c6d7e8f9a0b...",
                "created_at": "2026-03-28T14:00:00"
            },
            {
                "id": "mock-3",
                "project_name": "AI Resume Parser",
                "github_link": "https://github.com/demo/resume-parser",
                "description": "FastAPI service using LangChain to extract structured data from PDF resumes.",
                "tech_stack": ["Python", "FastAPI", "LangChain"],
                "ai_score": 82,
                "on_chain_hash": "0x9c0d1e2f3a4b5c6d...",
                "created_at": "2026-03-20T09:00:00"
            }
        ]

    response = db.table("project_ledger").select("*") \
        .eq("candidate_wallet", wallet) \
        .order("created_at", desc=True).execute()
    return response.data


@router.post("/projects")
async def add_project(data: ProjectSubmission):
    """Submit a new project for AI evaluation and on-chain hashing."""
    
    # Generate deterministic hash for on-chain storage
    hash_input = f"{data.project_name}|{data.github_link}|{'|'.join(data.tech_stack)}|{datetime.utcnow().isoformat()}"
    project_hash = "0x" + hashlib.sha256(hash_input.encode()).hexdigest()

    # AI project scoring (mock or real)
    ai_score = _calculate_project_score(data)

    db = get_supabase()
    project_data = {
        "candidate_wallet": data.wallet_address,
        "project_name": data.project_name,
        "github_link": data.github_link,
        "description": data.description,
        "tech_stack": data.tech_stack,
        "ai_score": ai_score,
        "on_chain_hash": project_hash,
    }

    if not db:
        return {
            "status": "success",
            "project": project_data,
            "message": "Project evaluated and hashed (mock mode)"
        }

    response = db.table("project_ledger").insert(project_data).execute()
    return {
        "status": "success",
        "project": response.data[0] if response.data else project_data,
        "on_chain_hash": project_hash,
        "ai_score": ai_score
    }


@router.delete("/projects/{project_id}")
async def delete_project(project_id: str):
    """Remove a project from the portfolio."""
    db = get_supabase()
    if not db:
        return {"status": "mock", "message": "Project removed (mock mode)"}

    db.table("project_ledger").delete().eq("id", project_id).execute()
    return {"status": "success", "message": "Project removed"}


def _calculate_project_score(data: ProjectSubmission) -> int:
    """Calculate a project complexity score based on heuristics."""
    score = 50  # Base score

    # Tech stack diversity
    tech_count = len(data.tech_stack)
    if tech_count >= 4: score += 20
    elif tech_count >= 3: score += 15
    elif tech_count >= 2: score += 10

    # Description quality
    desc_len = len(data.description)
    if desc_len > 200: score += 15
    elif desc_len > 100: score += 10
    elif desc_len > 50: score += 5

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
