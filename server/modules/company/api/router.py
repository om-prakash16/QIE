from fastapi import APIRouter, Depends, Query, Body
from typing import List, Dict, Any

from core.response import success_response
from core.dependencies import get_db, get_current_user_id, get_company_id
from modules.auth.schemas.models import CompanyCreate, CompanyInvite, ApiKeyCreate
from modules.activity.service import record_event
from modules.companies.enterprise_api_service import EnterpriseApiService

router = APIRouter()
enterprise_api_service = EnterpriseApiService()

@router.post("/create")
async def create_company(
    req: CompanyCreate, 
    user_id: str = Depends(get_current_user_id)
):
    """Set up a new company workspace."""
    db = await get_db()
    
    # 1. Create Company
    company_resp = db.table("companies").insert({
        "name": req.name,
        "created_by_user_id": user_id,
    }).execute()

    if not company_resp.data:
        from core.exceptions import ExternalServiceError
        raise ExternalServiceError("Failed to create company workspace")

    company = company_resp.data[0]

    # 2. Add OWNER membership
    db.table("company_members").insert({
        "company_id": company["id"],
        "user_id": user_id,
        "company_role": "OWNER",
    }).execute()

    # 3. Elevate Platform Role
    role_row = db.table("roles").select("id").eq("role_name", "COMPANY").single().execute()
    if role_row.data:
        db.table("user_roles").insert({
            "user_id": user_id,
            "role_id": role_row.data["id"],
        }).execute()

    await record_event(
        actor_id=user_id,
        actor_role="company",
        event_type="created_company",
        description=f"Created company workspace: {req.name}",
        entity_type="company",
        entity_id=company["id"],
    )

    return success_response(data={"company_id": company["id"]}, message="Company workspace created")

@router.post("/invite-member")
async def invite_member(
    req: CompanyInvite,
    user_id: str = Depends(get_current_user_id),
    company_id: str = Depends(get_company_id)
):
    """Invite an existing user by wallet address."""
    db = await get_db()
    
    # Check if target exists
    target = db.table("users").select("id").eq("wallet_address", req.wallet_address).execute()
    if not target.data:
        from core.exceptions import NotFoundError
        raise NotFoundError("User not found with this wallet address")

    result = db.table("company_members").insert({
        "company_id": company_id,
        "user_id": target.data[0]["id"],
        "company_role": req.role,
    }).execute()

    return success_response(data=result.data[0], message="Member invited")

@router.get("/team")
async def get_team(
    company_id: str = Depends(get_company_id)
):
    """Return all members of the company."""
    db = await get_db()
    response = db.table("company_members").select("*, users(wallet_address, full_name)").eq("company_id", company_id).execute()
    return success_response(data=response.data)

@router.get("/api-keys")
async def list_company_api_keys(
    company_id: str = Depends(get_company_id)
):
    """List all API keys for the company."""
    keys = enterprise_api_service.list_api_keys(company_id)
    return success_response(data=keys)

@router.post("/api-keys")
async def create_company_api_key(
    req: ApiKeyCreate,
    user_id: str = Depends(get_current_user_id),
    company_id: str = Depends(get_company_id)
):
    """Generate a new API key."""
    raw_key = enterprise_api_service.generate_api_key(
        company_id=company_id, label=req.label, scopes=req.scopes
    )
    return success_response(data={"api_key": raw_key}, message="API Key generated")
