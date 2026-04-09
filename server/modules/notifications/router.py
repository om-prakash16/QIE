from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID
from typing import List, Dict, Any
from modules.notifications.service import NotificationService
from modules.auth.service import require_permission, get_current_user
from core.supabase import get_supabase

router = APIRouter()
notification_service = NotificationService()

# API Endpoints

@router.get("/list")
async def get_notifications(
    current_user: Dict[str, Any] = Depends(get_current_user),
    limit: int = 50
):
    """
    Fetch notifications for the current authenticated user.
    """
    return await notification_service.get_user_notifications(current_user["id"], limit=limit)

@router.patch("/{notification_id}/read")
async def mark_notification_read(
    notification_id: UUID, 
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Mark a specific notification as read.
    """
    await notification_service.mark_as_read(notification_id, current_user["id"])
    return {"status": "success"}

@router.get("/activity-history")
async def get_activity_history(
    current_user: Dict[str, Any] = Depends(get_current_user),
    limit: int = 50
):
    """
    Fetch personal activity logs for the current user.
    """
    db = get_supabase()
    response = db.table("activity_logs") \
        .select("*") \
        .eq("user_id", str(current_user["id"])) \
        .order("timestamp", desc=True) \
        .limit(limit) \
        .execute()
    return response.data if response.data else []

@router.get("/admin/global-logs")
async def get_global_activity_logs(
    current_user: Dict[str, Any] = Depends(get_current_user),
    limit: int = 100
):
    """
    audit trail for administrators.
    """
    # In a real app: check if current_user has 'admin' permissions
    db = get_supabase()
    response = db.table("activity_logs") \
        .select("*, users(full_name)") \
        .order("timestamp", desc=True) \
        .limit(limit) \
        .execute()
    return response.data if response.data else []
