from fastapi import APIRouter, Depends, Query, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from core.response import success_response
from core.dependencies import get_db, get_current_user_id
from modules.ai.services.skill_graph_service import skill_graph_service

router = APIRouter()

class SkillMatchRequest(BaseModel):
    candidate_skills: List[str]
    required_skills: List[str]
    proof_score: Optional[int] = 500

@router.get("/related")
async def get_related_skills(
    skill: str = Query(..., description="The skill to find relationships for"),
    depth: int = Query(2, description="How many hops to traverse")
):
    """
    Given a single skill, return all semantically related skills.
    """
    related = await skill_graph_service.get_related_skills(skill, depth=depth)
    return success_response(data={
        "skill": skill,
        "related_skills": related,
        "depth": depth
    })

@router.get("/expand-job")
async def expand_job_skills(
    job_id: Optional[str] = Query(None),
    skills: Optional[str] = Query(None)
):
    """
    Expand a job's required skills into a full semantic graph.
    """
    required_skills = []
    if job_id:
        db = await get_db()
        resp = db.table("jobs").select("skills_required").eq("id", job_id).single().execute()
        if resp.data:
            required_skills = resp.data.get("skills_required", [])
    
    if not required_skills and skills:
        required_skills = [s.strip() for s in skills.split(",")]

    if not required_skills:
        raise HTTPException(status_code=400, detail="Provide job_id or skills parameter")

    expanded = await skill_graph_service.parse_job_to_skill_graph("", required_skills)
    return success_response(data=expanded)

@router.post("/match")
async def match_candidate_to_job(
    payload: SkillMatchRequest
):
    """
    Intelligent candidate-job matching using the Skill Graph.
    """
    result = await skill_graph_service.match_candidate_to_job(
        candidate_skills=payload.candidate_skills,
        required_skills=payload.required_skills,
        proof_score=payload.proof_score,
    )
    return success_response(data=result)
