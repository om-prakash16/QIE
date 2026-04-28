from portal.apps.companies.repository import CompanyRepository
from portal.apps.notifications.service import NotificationService
from typing import Dict, Any, List

class CompanyService:
    def __init__(self):
        self.repository = CompanyRepository()
        self.notifications = NotificationService()

    async def setup_company(self, name: str, user_id: str) -> Dict[str, Any]:
        company = self.repository.create_company(name, user_id)
        if not company:
            raise Exception("Failed to create company")

        # Owner membership
        self.repository.add_member(company["id"], user_id, "OWNER")

        # Elevate role
        self.repository.elevate_user_role(user_id, "COMPANY")

        # Log Activity
        await self.notifications.log_user_activity(
            user_id=user_id,
            action="created_company",
            description=f"Created company workspace: {name}"
        )

        return company

    async def invite_member(self, company_id: str, inviter_id: str, target_wallet: str, role: str):
        # 1. Verify Inviter is OWNER
        membership = self.repository.get_member(company_id, inviter_id)
        if not membership or membership.get("company_role") != "OWNER":
            raise Exception("Only company owners can invite members")

        # 2. Find Target User
        target = self.repository.get_user_by_wallet(target_wallet)
        if not target:
            raise Exception("User not found. They need to connect their wallet first.")

        # 3. Add Member
        self.repository.add_member(company_id, target["id"], role)

        # 4. Notify Target
        await self.notifications.send_notification(
            user_id=target["id"],
            title="Company Invitation",
            message=f"You have been added to a company workspace as {role}.",
            type="company_invite"
        )

        return True

    async def get_company_team(self, company_id: str) -> List[Dict[str, Any]]:
        return self.repository.get_team(company_id)
