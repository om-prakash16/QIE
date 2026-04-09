from uuid import UUID
from typing import Optional, Dict, Any, List
from modules.notifications.schemas import NotificationCreate, ActivityLogCreate
from core.supabase import get_supabase

class NotificationService:
    @staticmethod
    async def create_event_notification(
        user_id: UUID,
        type: str,
        title: str,
        message: str,
        metadata: Optional[Dict[str, Any]] = None
    ):
        """
        Create a new persistent notification in the database.
        """
        db = get_supabase()
        if not db: return None
        notification_data = {
            "user_id": str(user_id),
            "type": type,
            "title": title,
            "message": message,
            "metadata": metadata or {},
            "status": "unread"
        }
        
        response = db.table("notifications").insert(notification_data).execute()
        return response.data[0] if response.data else None

    @staticmethod
    async def log_activity(
        user_id: Optional[UUID],
        action_type: str,
        entity_type: Optional[str] = None,
        entity_id: Optional[UUID] = None,
        description: Optional[str] = None,
        tx_hash: Optional[str] = None
    ):
        """
        Record a system or user activity log.
        """
        db = get_supabase()
        if not db: return None
        log_data = {
            "user_id": str(user_id) if user_id else None,
            "action_type": action_type,
            "entity_type": entity_type,
            "entity_id": str(entity_id) if entity_id else None,
            "description": description,
            "tx_hash": tx_hash
        }
        
        response = db.table("activity_logs").insert(log_data).execute()
        return response.data[0] if response.data else None

    @staticmethod
    async def get_user_notifications(user_id: UUID, limit: int = 20) -> List[Dict[str, Any]]:
        """
        Fetch notifications for a specific user.
        """
        db = get_supabase()
        if not db: return []
        response = db.table("notifications") \
            .select("*") \
            .eq("user_id", str(user_id)) \
            .order("created_at", desc=True) \
            .limit(limit) \
            .execute()
        return response.data if response.data else []

    @staticmethod
    async def mark_as_read(notification_id: UUID, user_id: UUID):
        """
        Mark a notification as read.
        """
        db = get_supabase()
        if not db: return
        db.table("notifications") \
            .update({"status": "read"}) \
            .eq("id", str(notification_id)) \
            .eq("user_id", str(user_id)) \
            .execute()
