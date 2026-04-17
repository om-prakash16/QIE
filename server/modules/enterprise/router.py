from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List
from modules.auth.enterprise_auth import require_enterprise_key
from core.supabase import get_supabase

router = APIRouter()

@router.get("/candidates/{wallet_or_id}")
async def get_candidate_summary(
    wallet_or_id: str,
    enterprise_ctx: Dict[str, Any] = Depends(require_enterprise_key)
):
    """
    Enterprise-only candidate verification lookup.
    """
    db = get_supabase()
    if not db: return {"error": "DB Unavailable"}

    # 1. Resolve User
    user_q = db.table("users").select("id, wallet_address, full_name, profile_picture")
    if "-" in wallet_or_id: # UUID check (crude)
        user_q = user_q.eq("id", wallet_or_id)
    else:
        user_q = user_q.eq("wallet_address", wallet_or_id)
        
    user_res = user_q.single().execute()
    if not user_res.data:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    user_id = user_res.data["id"]

    # 2. Fetch Proof Score
    score_res = db.table("ai_scores").select("proof_score").eq("user_id", user_id).single().execute()
    proof_score = score_res.data["proof_score"] if score_res.data else 0

    # 3. Fetch Verified Skills
    skills_res = db.table("user_skills").select("skill_name, is_verified, verification_metadata")\
        .eq("user_id", user_id).eq("is_verified", True).execute()
    
    verified_skills = skills_res.data or []

    # 4. Fetch Achievements
    achievements_res = db.table("user_achievements").select("achievement_type, issued_at")\
        .eq("user_id", user_id).execute()

    return {
        "status": "success",
        "integration": enterprise_ctx.get("company_id"),
        "candidate": {
            "name": user_res.data["full_name"],
            "wallet": user_res.data["wallet_address"],
            "proof_score": proof_score,
            "verified_skills": verified_skills,
            "total_achievements": len(achievements_res.data or [])
        }
    }

@router.get("/verify-proof/{skill_id}")
async def get_verification_proof(
    skill_id: str,
    enterprise_ctx: Dict[str, Any] = Depends(require_enterprise_key)
):
    """
    Detailed verification artifact for a specific skill.
    """
    db = get_supabase()
    if not db: return {"error": "DB Unavailable"}
    
    skill_res = db.table("user_skills").select("*").eq("id", skill_id).single().execute()
    if not skill_res.data:
        raise HTTPException(status_code=404, detail="Proof artifact not found")
        
    return {
        "status": "success",
        "skill_name": skill_res.data["skill_name"],
        "verification_metadata": skill_res.data["verification_metadata"],
        "is_verified": skill_res.data["is_verified"]
    }
