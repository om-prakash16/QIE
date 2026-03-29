"""
Database CRUD API Routes.
Provides REST endpoints for jobs, users, bounties, and project ledger 
backed by the live Supabase PostgreSQL database.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from db.supabase_client import get_supabase

router = APIRouter()

# ─── Models ───────────────────────────────────────────────────────────
class JobCreate(BaseModel):
    title: str
    company: str
    location: str
    salary_range: Optional[str] = None
    description: str
    requirements: Optional[str] = None
    job_type: str = "full-time"

class UserProfile(BaseModel):
    wallet_address: str
    full_name: str
    bio: Optional[str] = None
    github_handle: Optional[str] = None

class ProjectEntry(BaseModel):
    user_wallet: str
    project_name: str
    tech_stack: str
    github_link: str
    ai_score: int

# ─── Job Endpoints ────────────────────────────────────────────────────
@router.get("/jobs")
async def list_jobs():
    """Fetch all active jobs from Supabase."""
    db = get_supabase()
    if not db:
        # Mock data fallback for hackathon demo
        return [
            {"id": "1", "title": "Senior Solana Developer", "company": "DeFi Labs", "location": "Remote", "salary_range": "$120k-$180k", "job_type": "full-time"},
            {"id": "2", "title": "Next.js Frontend Engineer", "company": "Web3 Studio", "location": "New York", "salary_range": "$100k-$150k", "job_type": "full-time"},
            {"id": "3", "title": "Rust Smart Contract Auditor", "company": "SecureChain", "location": "Remote", "salary_range": "$140k-$200k", "job_type": "contract"},
        ]
    
    response = db.table("jobs").select("*").eq("status", "active").execute()
    return response.data

@router.post("/jobs")
async def create_job(job: JobCreate):
    """Post a new job listing to the database."""
    db = get_supabase()
    if not db:
        return {"status": "mock", "message": "Job created (mock mode)", "data": job.model_dump()}
    
    response = db.table("jobs").insert(job.model_dump()).execute()
    return {"status": "success", "data": response.data}

@router.get("/jobs/{job_id}")
async def get_job(job_id: str):
    """Fetch a single job by ID."""
    db = get_supabase()
    if not db:
        return {"id": job_id, "title": "Mock Job", "company": "Mock Co", "location": "Remote"}
    
    response = db.table("jobs").select("*").eq("id", job_id).single().execute()
    return response.data

# ─── User Profile Endpoints ──────────────────────────────────────────
@router.get("/users/{wallet}")
async def get_user_profile(wallet: str):
    """Fetch a user profile by wallet address."""
    db = get_supabase()
    if not db:
        return {"wallet_address": wallet, "full_name": "Demo User", "reputation_score": 85, "bio": "Solana Developer"}
    
    response = db.table("users").select("*").eq("wallet_address", wallet).single().execute()
    return response.data

@router.post("/users")
async def upsert_user(profile: UserProfile):
    """Create or update a user profile."""
    db = get_supabase()
    if not db:
        return {"status": "mock", "data": profile.model_dump()}
    
    response = db.table("users").upsert(profile.model_dump()).execute()
    return {"status": "success", "data": response.data}

# ─── Project Ledger Endpoints ────────────────────────────────────────
@router.get("/ledger/{wallet}")
async def get_project_ledger(wallet: str):
    """Fetch all verified projects for a candidate."""
    db = get_supabase()
    if not db:
        return [
            {"project_name": "DeFi Aggregator", "tech_stack": "Solana, Rust", "ai_score": 98, "verification_hash": "0x89ab...cd45"},
            {"project_name": "ZK Voting dApp", "tech_stack": "Cairo, Next.js", "ai_score": 92, "verification_hash": "0x12ef...89ab"},
        ]
    
    response = db.table("project_ledger").select("*").eq("user_wallet", wallet).execute()
    return response.data

@router.post("/ledger")
async def add_project_entry(entry: ProjectEntry):
    """Add a new verified project to the ledger."""
    db = get_supabase()
    if not db:
        return {"status": "mock", "data": entry.model_dump()}
    
    response = db.table("project_ledger").insert(entry.model_dump()).execute()
    return {"status": "success", "data": response.data}
