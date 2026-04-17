from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from core.supabase import get_supabase
from modules.auth.service import get_current_user
from modules.ai.services.fraud_service import AIFraudService

router = APIRouter()
fraud_service = AIFraudService()

class TelemetryPayload(BaseModel):
    assessment_id: str
    events: List[Dict[str, Any]]

# In-memory store for Hackathon dynamic simulation (since we don't have a trust_scores table yet)
_in_memory_fraud_logs = {}

@router.post("/telemetry")
async def ingest_fraud_telemetry(payload: TelemetryPayload, current_user = Depends(get_current_user)):
    """
    Ingest raw telemetry events from the candidate's browser during an assessment.
    Updates the candidate's active Trust Score based on anomalies.
    """
    user_id = current_user.get("sub") or current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    score, audit_log = fraud_service.analyze_telemetry(payload.events)
    
    # Save dynamically to memory for demo purposes
    if user_id not in _in_memory_fraud_logs:
        _in_memory_fraud_logs[user_id] = {
            "trust_score": 100,
            "audit_log": []
        }
        
    # Apply deductions incrementally
    deduction = 100 - score
    current_score = _in_memory_fraud_logs[user_id]["trust_score"]
    
    _in_memory_fraud_logs[user_id]["trust_score"] = max(0, current_score - deduction)
    if audit_log:
        _in_memory_fraud_logs[user_id]["audit_log"].extend(audit_log)

    return {
        "status": "success",
        "message": "Telemetry processed."
    }

@router.get("/report")
async def get_fraud_report(
    wallet_address: Optional[str] = Query(None, description="Candidate wallet"),
    current_user = Depends(get_current_user)
):
    """
    Called by the Recruiter Dashboard to fetch the candidate's Shield Status and Audit Log.
    """
    db = get_supabase()
    
    # Resolve the internal UUID based on the provided wallet
    user_id = None
    if wallet_address and db:
        resp = db.table("users").select("id").eq("wallet_address", wallet_address).single().execute()
        if resp.data:
            user_id = resp.data.get("id")
            
    # Default to current user if no wallet provided
    user_id = user_id or current_user.get("sub") or current_user.get("id")

    # Fetch from our dynamic simulation
    report = _in_memory_fraud_logs.get(user_id, {
        "trust_score": 100,
        "audit_log": []
    })

    score = report["trust_score"]
    shield_color = fraud_service.determine_shield_status(score)
    status_text = fraud_service.determine_trust_status(score)
    
    # For a perfect score, return a positive log
    if score == 100 and not report["audit_log"]:
        report["audit_log"].append({
            "timestamp": "N/A",
            "severity": "info",
            "message": "Clean telemetry. Verified authentic work.",
            "penalty": 0
        })

    return {
        "wallet_address": wallet_address,
        "trust_score": score,
        "shield": shield_color,
        "status": status_text,
        "audit_log": report["audit_log"]
    }
