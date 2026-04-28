from portal.apps.identities.repository import IdentityRepository
from portal.events.producer import dispatch_event
from portal.apps.notifications.service import NotificationService
from typing import Dict, Any, Optional

class IdentityService:
    def __init__(self):
        self.repository = IdentityRepository()
        self.notifications = NotificationService()

    async def submit(self, user_id: str, id_type: str, document_url: str):
        identity = self.repository.upsert_identity({
            "user_id": user_id,
            "id_type": id_type,
            "id_document_url": document_url,
            "id_status": "pending",
            "updated_at": "now()"
        })
        
        await self.notifications.log_user_activity(user_id, "identity_submission", f"Submitted {id_type} for verification.")
        return identity

    async def verify(self, user_id: str, admin_id: str, status: str, reason: Optional[str] = None):
        identity = self.repository.update_verification(user_id, {
            "id_status": status,
            "verified_by": admin_id,
            "verified_at": "now()" if status == "verified" else None,
            "rejection_reason": reason if status == "rejected" else None,
            "updated_at": "now()"
        })
        
        # Emit event for other domains to handle
        event_type = "IDENTITY_VERIFIED" if status == "verified" else "IDENTITY_REJECTED"
        await dispatch_event(event_type, {
            "user_id": user_id,
            "status": status,
            "reason": reason
        })
        
        return identity
