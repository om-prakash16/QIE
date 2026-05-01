from fastapi import APIRouter, Depends, Query
from uuid import UUID
from typing import Dict, Any

from core.response import success_response
from core.dependencies import get_db, get_current_user_id
from modules.notifications.core.service import NotificationService

router = APIRouter()
notification_service = NotificationService()

@router.get("/list")
async def get_notifications(
    user_id: str = Depends(get_current_user_id),
    limit: int = Query(50)
):
    """Fetch notifications for the authenticated user."""
    notifications = await notification_service.get_user_notifications(user_id, limit=limit)
    return success_response(data=notifications)

@router.patch("/{notification_id}/read")
async def mark_notification_read(
    notification_id: UUID,
    user_id: str = Depends(get_current_user_id)
):
    """Mark a specific notification as read."""
    await notification_service.mark_as_read(notification_id, user_id)
    return success_response(data=None, message="Notification marked as read")

@router.get("/activity-history")
async def get_activity_history(
    user_id: str = Depends(get_current_user_id),
    limit: int = Query(50)
):
    """Fetch personal activity logs for the current user."""
    db = await get_db()
    response = db.table("activity_logs").select("*").eq("user_id", user_id).order("timestamp", desc=True).limit(limit).execute()
    return success_response(data=response.data)

@router.get("/admin/global-logs")
async def get_global_activity_logs(
    limit: int = Query(100)
):
    """Audit trail for administrators."""
    # TODO: Add require_admin guard
    db = await get_db()
    response = db.table("activity_logs").select("*, users(full_name)").order("timestamp", desc=True).limit(limit).execute()
    return success_response(data=response.data)
