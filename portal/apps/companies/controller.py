from portal.apps.companies.service import CompanyService
from portal.apps.companies.schema import CompanyCreate, CompanyInvite
from fastapi import HTTPException

class CompanyController:
    def __init__(self):
        self.service = CompanyService()

    async def create_new_company(self, req: CompanyCreate, user_id: str):
        try:
            company = await self.service.setup_company(req.name, user_id)
            return {"status": "success", "company_id": company["id"]}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def invite_team_member(self, req: CompanyInvite, inviter_id: str):
        try:
            await self.service.invite_member(req.company_id, inviter_id, req.wallet_address, req.role)
            return {"status": "success"}
        except Exception as e:
            # Simple error handling; in a real app we'd map these to specific 400/403/404s
            if "Only company owners" in str(e):
                raise HTTPException(status_code=403, detail=str(e))
            if "User not found" in str(e):
                raise HTTPException(status_code=404, detail=str(e))
            raise HTTPException(status_code=500, detail=str(e))

    async def list_team(self, company_id: str):
        return await self.service.get_company_team(company_id)
