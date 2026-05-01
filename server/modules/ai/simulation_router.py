from fastapi import APIRouter, Depends, Query, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from core.response import success_response
from core.dependencies import get_db, get_validated_wallet
from modules.ai.services.simulation_engine_service import simulation_service

router = APIRouter()

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
    wallet: str = Depends(get_validated_wallet)
):
    """
    Generate an AI-driven real work simulation based on a job description.
    """
    task = await simulation_service.generate_simulation(
        wallet=wallet,
        job_title=req.job_title,
        job_description=req.job_description,
        required_skills=req.required_skills,
    )
    return success_response(data=task)

@router.post("/submit")
async def submit_simulation(
    req: SubmitSimulationRequest,
    wallet: str = Depends(get_validated_wallet)
):
    """
    Submit completed code for deep AI evaluation.
    """
    if len(req.submitted_code.strip()) < 10:
        raise HTTPException(status_code=400, detail="Submission too short")

    result = await simulation_service.evaluate_submission(
        wallet=wallet,
        simulation_id=req.simulation_id,
        submitted_code=req.submitted_code
    )
    return success_response(data=result)

@router.get("/templates")
async def list_simulation_templates():
    """List available simulation templates."""
    templates = []
    for role, template in simulation_service.TASK_TEMPLATES.items():
        templates.append({
            "role": role,
            "title": template["title"],
            "time_limit": template["time_limit_minutes"]
        })
    return success_response(data=templates)
