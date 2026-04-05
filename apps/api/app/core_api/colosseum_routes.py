from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, Optional
from services.colosseum_service import colosseum_service

router = APIRouter()

class AnalysisQuery(BaseModel):
    query: str

class ResearchContext(BaseModel):
    context: str

@router.get("/status")
async def check_colosseum_status():
    """Verify that the Colosseum PAT is valid and the API is reachable."""
    result = await colosseum_service.get_status()
    if not result.get("authenticated", False):
        raise HTTPException(status_code=401, detail="Colosseum authentication failed.")
    return result

@router.post("/query")
async def query_copilot(payload: AnalysisQuery):
    """Run a conversational query to check for competition/ecosystem data."""
    result = await colosseum_service.analyze_project(payload.query)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result

@router.post("/research")
async def start_research(payload: ResearchContext):
    """Trigger the 8-step deep dive research workflow."""
    result = await colosseum_service.start_deep_dive(payload.context)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result
