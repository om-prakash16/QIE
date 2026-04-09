from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any, Optional
from modules.notifications.service import NotificationService
from modules.auth.service import get_current_user
from core.supabase import get_supabase
from pydantic import BaseModel
import uuid

from .service import SyncService

router = APIRouter()
sync_service = SyncService()

class SyncConfirmReq(BaseModel):
    tx_hash: str
    entity_type: str

# API Endpoints

@router.post("/profile")
async def trigger_profile_sync(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Trigger the Supabase -> IPFS metadata generation workflow.
    """
    return await sync_service.trigger_metadata_sync(
        user_id=uuid.UUID(current_user["id"]),
        entity_type="profile"
    )

@router.get("/status")
async def get_sync_status(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Fetch current synchronization status for UI indicators.
    """
    db = get_supabase()
    response = db.table("sync_status") \
        .select("*") \
        .eq("user_id", str(current_user["id"])) \
        .execute()
    return response.data if response.data else []

@router.post("/confirm")
async def confirm_blockchain_sync(
    req: SyncConfirmReq,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Transition status to SYNCED after Solana transaction.
    """
    return await sync_service.finalize_blockchain_sync(
        user_id=uuid.UUID(current_user["id"]),
        entity_type=req.entity_type,
        tx_hash=req.tx_hash
    )

@router.post("/retry")
async def retry_failed_sync(
    entity_type: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Re-attempt a failed metadata sync.
    """
    return await sync_service.trigger_metadata_sync(
        user_id=uuid.UUID(current_user["id"]),
        entity_type=entity_type
    )
