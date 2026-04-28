from fastapi import APIRouter, Depends
from portal.apps.companies.controller import CompanyController
from portal.apps.companies.schema import CompanyCreate, CompanyInvite
from portal.core.security import get_current_user, require_role

router = APIRouter()
controller = CompanyController()

@router.post("/create")
async def create_company(req: CompanyCreate, user=Depends(get_current_user)):
    return await controller.create_new_company(req, user["sub"])

@router.post("/invite")
async def invite_member(req: CompanyInvite, user=Depends(require_role("COMPANY_OWNER"))):
    # Enforcing that only someone with at least COMPANY_OWNER role can access this route
    return await controller.invite_team_member(req, user["sub"])

@router.get("/{company_id}/team")
async def get_team(company_id: str, user=Depends(get_current_user)):
    # Note: RLS handles the security to ensure only members can see this
    return await controller.list_team(company_id)
