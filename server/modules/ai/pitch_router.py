from fastapi import APIRouter, Depends
from typing import Dict, Optional
from pydantic import BaseModel

from core.response import success_response
from core.dependencies import get_current_user_id
from modules.ai.pitch_engine import pitch_engine

router = APIRouter()

class PitchRequest(BaseModel):
    existing_sections: Optional[Dict[str, str]] = None

@router.post("/generate")
async def generate_pitch(
    request: PitchRequest,
    user_id: str = Depends(get_current_user_id)
):
    """
    Generate or refine the full Pitch Deck copy.
    """
    existing = request.existing_sections if request.existing_sections else {}
    result = await pitch_engine.generate_full_pitch(existing)
    return success_response(data=result)

@router.get("/generate")
async def get_pitch(
    user_id: str = Depends(get_current_user_id)
):
    """
    Fetches the base pitch deck copy.
    """
    result = await pitch_engine.generate_full_pitch()
    return success_response(data=result)
