from fastapi import APIRouter, HTTPException, Depends
from modules.auth.service import verify_solana_signature, create_access_token, get_current_user
from modules.auth.models import WalletLoginRequest, AuthTokenResponse
from core.supabase import get_supabase

router = APIRouter()


@router.post("/wallet-login", response_model=AuthTokenResponse)
async def wallet_login(req: WalletLoginRequest):
    """
    Verify a signed Solana message and return a JWT.

    New wallets are automatically registered on first login. The `requested_role`
    field lets the frontend declare intent (USER vs COMPANY) at signup time —
    existing accounts always use the role stored in the DB.
    """
    is_valid = await verify_solana_signature(req.wallet_address, req.message, req.signature)
    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid signature")

    db = get_supabase()
    if not db:
        raise HTTPException(status_code=500, detail="Database unavailable")

    existing = db.table("users").select("*").eq("wallet_address", req.wallet_address).execute()

    if existing.data:
        user = existing.data[0]
    else:
        # First time this wallet has connected — create the account.
        role = req.requested_role.upper() if req.requested_role else "USER"
        created = db.table("users").insert({
            "wallet_address": req.wallet_address,
            "role": role,
        }).execute()

        if not created.data:
            raise HTTPException(status_code=500, detail="Failed to create account")

        user = created.data[0]

        # Wire up the role in the join table so permission checks work.
        role_row = db.table("roles").select("id").eq("role_name", role).single().execute()
        if role_row.data:
            db.table("user_roles").insert({
                "user_id": user["id"],
                "role_id": role_row.data["id"],
            }).execute()

    # Pull roles for the token payload.
    user_roles = db.table("user_roles").select("roles(role_name)").eq("user_id", user["id"]).execute()
    roles = [r["roles"]["role_name"] for r in user_roles.data] if user_roles.data else ["USER"]

    token = create_access_token(data={
        "sub": user["id"],
        "wallet": user["wallet_address"],
        "roles": roles,
    })

    return AuthTokenResponse(access_token=token, role=roles[0])


@router.get("/me")
async def get_me(user = Depends(get_current_user)):
    """Return the decoded JWT payload for the current session."""
    return user
