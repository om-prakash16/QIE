"""
Skill Graph Intelligence Router.
Exposes endpoints for graph-based skill matching and job-to-candidate evaluation.
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import List, Optional
from modules.auth.service import get_current_user
from modules.ai.services.skill_graph_service import SkillGraphService
from core.supabase import get_supabase

router = APIRouter()
graph_service = SkillGraphService()


class SkillMatchRequest(BaseModel):
    candidate_skills: List[str]
    required_skills: List[str]
    proof_score: Optional[int] = 500


@router.get("/related")
async def get_related_skills(
    skill: str = Query(..., description="The skill to find relationships for"),
    depth: int = Query(2, description="How many hops to traverse"),
    current_user=Depends(get_current_user)
):
    """
    Given a single skill, return all semantically related skills
    from the knowledge graph with proximity weights.
    """
    related = graph_service.get_related_skills(skill, depth=depth)
    if not related:
        return {
            "skill": skill,
            "message": "Skill not found in the graph. It may be valid but not yet mapped.",
            "related_skills": {}
        }

    return {
        "skill": skill,
        "depth": depth,
        "related_skills": related,
        "total_connections": len(related)
    }


@router.get("/expand-job")
async def expand_job_skills(
    job_id: Optional[str] = Query(None, description="Job ID to expand"),
    skills: Optional[str] = Query(None, description="Comma-separated skills if no job_id"),
    current_user=Depends(get_current_user)
):
    """
    Expand a job's required skills into a full semantic graph.
    Recruiters use this to understand what related skills are acceptable for a role.
    """
    required_skills = []

    if job_id:
        db = get_supabase()
        if db:
            resp = db.table("jobs").select("skills_required, title").eq("id", job_id).single().execute()
            if resp.data:
                required_skills = resp.data.get("skills_required", [])

    if not required_skills and skills:
        required_skills = [s.strip() for s in skills.split(",")]

    if not required_skills:
        raise HTTPException(status_code=400, detail="Provide job_id or skills parameter")

    expanded = graph_service.parse_job_to_skill_graph("", required_skills)

    return {
        "job_id": job_id,
        "explicit_skills": expanded["explicit_skills"],
        "expanded_skill_graph": expanded["expanded_skill_graph"],
        "total_skills_in_graph": expanded["total_skills_in_graph"]
    }


@router.post("/match")
async def match_candidate_to_job(
    payload: SkillMatchRequest,
    current_user=Depends(get_current_user)
):
    """
    Intelligent candidate-job matching using the Skill Graph.
    A candidate with FastAPI experience will match highly against a Django job
    because both share deep semantic proximity through Python.
    """
    result = graph_service.match_candidate_to_job(
        candidate_skills=payload.candidate_skills,
        required_skills=payload.required_skills,
        proof_score=payload.proof_score
    )

    return {
        "status": "success",
        "match_result": result
    }
