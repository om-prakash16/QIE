from fastapi import APIRouter, HTTPException, Depends
from modules.auth.service import get_current_user
from modules.auth.guards import require_company
from modules.auth.models import CompanyCreate, CompanyInvite, ApiKeyCreate
from core.supabase import get_supabase
from modules.activity.service import record_event
from modules.companies.enterprise_api_service import EnterpriseApiService

router = APIRouter()
enterprise_api_service = EnterpriseApiService()


@router.post("/create")
async def create_company(req: CompanyCreate, user=Depends(get_current_user)):
    """
    Set up a new company workspace.

    The requesting user is automatically assigned the OWNER role within the
    company and their global platform role is elevated to COMPANY so they
    gain access to the recruiter dashboard.
    """
    db = get_supabase()
    user_id = user.get("sub")

    company_resp = (
        db.table("companies")
        .insert(
            {
                "name": req.name,
                "created_by_user_id": user_id,
            }
        )
        .execute()
    )

    if not company_resp.data:
        raise HTTPException(status_code=500, detail="Failed to create company")

    company = company_resp.data[0]

    # Owner membership record
    db.table("company_members").insert(
        {
            "company_id": company["id"],
            "user_id": user_id,
            "company_role": "OWNER",
        }
    ).execute()

    # Elevate the user's global role so they route to the correct dashboard.
    role_row = (
        db.table("roles").select("id").eq("role_name", "COMPANY").single().execute()
    )
    if role_row.data:
        db.table("user_roles").insert(
            {
                "user_id": user_id,
                "role_id": role_row.data["id"],
            }
        ).execute()

    await record_event(
        actor_id=user_id,
        actor_role="company",
        event_type="created_company",
        description=f"Created company workspace: {req.name}",
        entity_type="company",
        entity_id=company["id"],
    )

    return {"status": "success", "company_id": company["id"]}


@router.post("/invite-member")
async def invite_member(req: CompanyInvite, user=Depends(require_company)):
    """
    Invite an existing user to join a company.

    The target user must have logged in at least once so their wallet is
    already registered. Only OWNER-level members can send invitations.
    """
    db = get_supabase()
    user_id = user.get("sub")

    ownership = (
        db.table("company_members")
        .select("*")
        .eq("company_id", req.company_id)
        .eq("user_id", user_id)
        .eq("company_role", "OWNER")
        .execute()
    )

    if not ownership.data:
        raise HTTPException(
            status_code=403, detail="Only company owners can invite members"
        )

    target = (
        db.table("users")
        .select("id")
        .eq("wallet_address", req.wallet_address)
        .execute()
    )
    if not target.data:
        raise HTTPException(
            status_code=404,
            detail="User not found. They need to connect their wallet at least once first.",
        )

    result = (
        db.table("company_members")
        .insert(
            {
                "company_id": req.company_id,
                "user_id": target.data[0]["id"],
                "company_role": req.role,
            }
        )
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to send invitation")

    return {"status": "success"}


@router.get("/team")
async def get_team(company_id: str, user=Depends(require_company)):
    """Return all members of a company with their wallet addresses."""
    db = get_supabase()
    response = (
        db.table("company_members")
        .select("*, users(wallet_address)")
        .eq("company_id", company_id)
        .execute()
    )
    return response.data


@router.get("/api-keys")
async def list_company_api_keys(company_id: str, user=Depends(require_company)):
    """List all API keys for the company."""
    db = get_supabase()
    user_id = user.get("sub")

    # Verify membership
    membership = (
        db.table("company_members")
        .select("*")
        .eq("company_id", company_id)
        .eq("user_id", user_id)
        .execute()
    )
    if not membership.data:
        raise HTTPException(status_code=403, detail="Not a member of this company")

    return enterprise_api_service.list_api_keys(company_id)


@router.post("/api-keys")
async def create_company_api_key(
    company_id: str, req: ApiKeyCreate, user=Depends(require_company)
):
    """Generate a new API key for external integrations."""
    db = get_supabase()
    user_id = user.get("sub")

    # Verify OWNER/ADMIN role in company
    membership = (
        db.table("company_members")
        .select("company_role")
        .eq("company_id", company_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    if not membership.data or membership.data["company_role"] not in ["OWNER", "ADMIN"]:
        raise HTTPException(
            status_code=403, detail="Only owners/admins can manage API keys"
        )

    raw_key = enterprise_api_service.generate_api_key(
        company_id=company_id, label=req.label, scopes=req.scopes
    )

    await record_event(
        actor_id=user_id,
        actor_role="company",
        event_type="api_key_created",
        description=f"Generated new Enterprise API Key: {req.label}",
        entity_type="company",
        entity_id=company_id,
    )

    return {"status": "success", "api_key": raw_key}


@router.delete("/api-keys/{key_id}")
async def revoke_company_api_key(
    key_id: str, company_id: str, user=Depends(require_company)
):
    """Revoke an API key."""
    db = get_supabase()
    user_id = user.get("sub")

    # Verify OWNER/ADMIN role
    membership = (
        db.table("company_members")
        .select("company_role")
        .eq("company_id", company_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    if not membership.data or membership.data["company_role"] not in ["OWNER", "ADMIN"]:
        raise HTTPException(
            status_code=403, detail="Only owners/admins can manage API keys"
        )

    enterprise_api_service.revoke_api_key(key_id)

    await record_event(
        actor_id=user_id,
        actor_role="company",
        event_type="api_key_revoked",
        description=f"Revoked API Key ID: {key_id}",
        entity_type="company",
        entity_id=company_id,
    )

    return {"status": "success"}
