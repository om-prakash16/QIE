from fastapi import APIRouter
from typing import Dict, Optional
from pydantic import BaseModel
from modules.ai.pitch_engine import PitchEngine

router = APIRouter()
pitch_engine = PitchEngine()

class PitchRequest(BaseModel):
    existing_sections: Optional[Dict[str, str]] = None

@router.post("/generate")
async def generate_pitch(request: PitchRequest):
    """
    Generate or refine the full Pitch Deck copy for the Career Operating System.
    """
    existing = request.existing_sections if request.existing_sections else {}
    return await pitch_engine.generate_full_pitch(existing)

@router.get("/generate")
async def get_pitch():
    """
    Fetches the base pitch deck copy from scratch without input overrides.
    """
    return await pitch_engine.generate_full_pitch()
