from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from core.response import success_response
from core.dependencies import get_db, get_validated_wallet
from modules.ai.services.fraud_service import fraud_service

router = APIRouter()

class TelemetrySubmission(BaseModel):
    assessment_id: str
    events: List[Dict[str, Any]]

@router.post("/telemetry")
async def ingest_telemetry(
    data: TelemetrySubmission,
    wallet: str = Depends(get_validated_wallet)
):
    """
    Ingest real-time browser telemetry during an assessment.
    Runs forensic AI analysis and updates the trust score in the database.
    """
    report = await fraud_service.process_telemetry(
        wallet=wallet,
        assessment_id=data.assessment_id,
        telemetry_events=data.events
    )
    return success_response(data=report)

@router.get("/status/{assessment_id}")
async def get_fraud_status(
    assessment_id: str,
    wallet: str = Depends(get_validated_wallet)
):
    """
    Get the fraud analysis report for a specific assessment.
    """
    report = await fraud_service.get_assessment_trust_report(assessment_id)
    if not report:
        # If not found, return a default clean state
        return success_response(data={
            "assessment_id": assessment_id,
            "trust_score": 100,
            "status": "No data",
            "shield": "Gray"
        })
    
    return success_response(data=report)

@router.get("/candidate-trust")
async def get_candidate_trust(
    wallet: str = Depends(get_validated_wallet)
):
    """
    Get the aggregate trust score for the authenticated candidate.
    """
    db = await get_db()
    res = db.table("users").select("trust_score").eq("wallet_address", wallet).single().execute()
    
    return success_response(data={
        "wallet_address": wallet,
        "trust_score": res.data.get("trust_score", 100) if res.data else 100
    })
