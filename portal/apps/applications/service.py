from portal.apps.applications.repository import ApplicationRepository
from portal.apps.notifications.service import NotificationService
from typing import Dict, Any

class ApplicationService:
    def __init__(self):
        self.repository = ApplicationRepository()
        self.notifications = NotificationService()

    async def apply(self, job_id: str, user_id: str, match_score: float = 0):
        # 1. Create Application
        app = self.repository.create({
            "job_id": job_id,
            "candidate_id": user_id,
            "status": "applied",
            "ai_match_score": match_score
        })
        
        # 2. Trigger Assessment Generation (Mock for now)
        # In a real app, this would be an AI worker task
        print(f"Application Service: Triggering AI Assessment for App {app['id']}")
        
        # 3. Notify Candidate
        await self.notifications.send_notification(
            user_id=user_id,
            title="Application Sent",
            message="Your application has been received. Check your dashboard for next steps.",
            type="job_application"
        )
        
        return app

    async def update_status(self, app_id: str, status: str, actor_id: str):
        app = self.repository.update_status(app_id, status)
        
        # Notify Candidate
        await self.notifications.send_notification(
            user_id=app["candidate_id"],
            title="Application Update",
            message=f"Your application status has been updated to: {status}",
            type="app_status"
        )
        
        return app
