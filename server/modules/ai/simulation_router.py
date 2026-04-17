"""
Real Work Simulation Engine Router.
Generates role-specific tasks and evaluates candidate submissions.
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import List, Optional
from modules.auth.service import get_current_user
from modules.ai.services.simulation_engine_service import SimulationEngineService
from core.supabase import get_supabase

router = APIRouter()
simulation_service = SimulationEngineService()


class GenerateSimulationRequest(BaseModel):
    job_title: str
    job_description: str
    required_skills: List[str]


class SubmitSimulationRequest(BaseModel):
    simulation_id: str
    submitted_code: str


@router.post("/generate")
async def generate_simulation_task(
    req: GenerateSimulationRequest,
    current_user=Depends(get_current_user)
):
    """
    Generate an AI-driven real work simulation based on a job description.
    Detects the role category and returns a scoped micro-project.
    """
    task = simulation_service.generate_simulation(
        job_title=req.job_title,
        job_description=req.job_description,
        required_skills=req.required_skills
    )
    return {"status": "success", "simulation": task}


@router.get("/generate-from-job")
async def generate_from_existing_job(
    job_id: str = Query(..., description="Existing job ID to generate simulation for"),
    current_user=Depends(get_current_user)
):
    """Generate a simulation directly from an existing job listing."""
    db = get_supabase()
    if not db:
        # Fallback demo task
        return {"status": "success", "simulation": simulation_service.generate_simulation(
            "Backend Developer", "Build scalable APIs", ["Python", "FastAPI"]
        )}

    job_resp = db.table("jobs").select("title, description, skills_required").eq("id", job_id).single().execute()
    if not job_resp.data:
        raise HTTPException(status_code=404, detail="Job not found")

    job = job_resp.data
    task = simulation_service.generate_simulation(
        job_title=job.get("title", "Software Engineer"),
        job_description=job.get("description", ""),
        required_skills=job.get("skills_required", [])
    )
    return {"status": "success", "simulation": task}


@router.post("/submit")
async def submit_simulation(
    req: SubmitSimulationRequest,
    current_user=Depends(get_current_user)
):
    """
    Submit completed code for AI evaluation.
    Returns scores across 5 dimensions: Code Quality, Problem Solving,
    Performance, Logic Structure, and Documentation.
    """
    if len(req.submitted_code.strip()) < 10:
        raise HTTPException(status_code=400, detail="Submission too short for meaningful evaluation")

    result = simulation_service.evaluate_submission(
        simulation_id=req.simulation_id,
        submitted_code=req.submitted_code
    )

    # Log the activity
    db = get_supabase()
    user_id = current_user.get("sub") or current_user.get("id")
    if db and user_id:
        try:
            db.table("activity_events").insert({
                "actor_id": user_id,
                "actor_type": "candidate",
                "action": "simulation_completed",
                "entity_type": "assessment",
                "description": f"Completed work simulation {req.simulation_id}. Score: {result['composite_score']}/100. Passed: {result['passed']}"
            }).execute()
        except Exception:
            pass

    return {"status": "evaluated", "result": result}


@router.get("/templates")
async def list_simulation_templates(current_user=Depends(get_current_user)):
    """List all available simulation task templates."""
    templates = []
    for role, template in simulation_service.TASK_TEMPLATES.items():
        templates.append({
            "role": role,
            "title": template["title"],
            "time_limit_minutes": template["time_limit_minutes"],
            "criteria_count": len(template["acceptance_criteria"])
        })
    return {"templates": templates}
