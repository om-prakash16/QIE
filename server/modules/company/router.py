from fastapi import APIRouter, HTTPException, Depends
from modules.auth.service import get_current_user
from modules.auth.models import CompanyCreate, CompanyInvite
from core.supabase import get_supabase

router = APIRouter()

@router.post("/create")
async def create_company(req: CompanyCreate, user = Depends(get_current_user)):
    """
    SECTION 6: Company Account Creation.
    Creates a new company workspace and assigns the user as OWNER.
    """
    db = get_supabase()
    user_id = user.get("sub")

    # 1. Create Company
    company_resp = db.table("companies").insert({
        "name": req.name,
        "created_by_user_id": user_id
    }).execute()

    if not company_resp.data:
        raise HTTPException(status_code=500, detail="Failed to create company")
    
    company = company_resp.data[0]

    # 2. Assign user as OWNER in company_members
    db.table("company_members").insert({
        "company_id": company["id"],
        "user_id": user_id,
        "company_role": "OWNER"
    }).execute()

    # 3. Update user global role to COMPANY
    role_resp = db.table("roles").select("id").eq("role_name", "COMPANY").single().execute()
    if role_resp.data:
        db.table("user_roles").insert({"user_id": user_id, "role_id": role_resp.data["id"]}).execute()

    return {"status": "success", "company_id": company["id"]}

@router.post("/invite-member")
async def invite_member(req: CompanyInvite, user = Depends(get_current_user)):
    """
    SECTION 7: Team Member Invitations.
    """
    db = get_supabase()
    user_id = user.get("sub")

    # 1. Verify invitation sender is OWNER of the company
    member_check = db.table("company_members").select("*") \
        .eq("company_id", req.company_id) \
        .eq("user_id", user_id) \
        .eq("company_role", "OWNER") \
        .execute()
    
    if not member_check.data:
        raise HTTPException(status_code=403, detail="Only company owners can invite members")

    # 2. Get target user_id from wallet address
    target_resp = db.table("users").select("id").eq("wallet_address", req.wallet_address).execute()
    if not target_resp.data:
        raise HTTPException(status_code=404, detail="Target user not found. They must login once first.")
    
    target_id = target_resp.data[0]["id"]

    # 3. Add to company_members
    invite_resp = db.table("company_members").insert({
        "company_id": req.company_id,
        "user_id": target_id,
        "company_role": req.role
    }).execute()

    if not invite_resp.data:
        raise HTTPException(status_code=500, detail="Failed to invite member")

    return {"status": "success"}

@router.get("/team")
async def get_team(company_id: str, user = Depends(get_current_user)):
    """
    Returns list of all members in a company.
    """
    db = get_supabase()
    response = db.table("company_members").select("*, users(wallet_address)") \
        .eq("company_id", company_id) \
        .execute()
    return response.data
