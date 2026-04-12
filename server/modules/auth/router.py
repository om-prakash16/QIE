from fastapi import APIRouter, HTTPException, Depends
from modules.auth.service import verify_solana_signature, create_access_token, get_current_user
from modules.auth.models import WalletLoginRequest, AuthTokenResponse
from core.supabase import get_supabase
import uuid

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

    role = (req.requested_role.lower() if req.requested_role else "user")
    
    if existing.data:
        user = existing.data[0]
    else:
        # First time this wallet has connected — create the account.
        uid = str(uuid.uuid4())
        created = db.table("users").insert({
            "id": uid,
            "wallet_address": req.wallet_address,
            # 'role' column is not in public.users, we use the user_roles table
        }).execute()

        if not created.data:
            raise HTTPException(status_code=500, detail="Failed to create account")

        user = created.data[0]

    # Pull existing roles for this user
    user_roles_query = db.table("user_roles").select("roles(role_name)").eq("user_id", user["id"]).execute()
    current_roles_upper = [r["roles"]["role_name"].upper() for r in user_roles_query.data] if user_roles_query.data else []

    # Use uppercase for database querying
    db_role_name = role.upper()

    # Ensure the requested role is assigned if not already present
    if db_role_name not in current_roles_upper:
        # Avoid .single() crash by fetching and checking length
        role_row = db.table("roles").select("id").eq("role_name", db_role_name).execute()
        if role_row.data and len(role_row.data) > 0:
            db.table("user_roles").insert({
                "user_id": user["id"],
                "role_id": role_row.data[0]["id"],
            }).execute()
            current_roles_upper.append(db_role_name)

    token = create_access_token(data={
        "sub": user["id"],
        "wallet": user["wallet_address"],
        "roles": [r.lower() for r in current_roles_upper] if current_roles_upper else ["user"],
    })

    return AuthTokenResponse(access_token=token, role=current_roles_upper[0].lower() if current_roles_upper else "user")


@router.get("/me")
async def get_me(user = Depends(get_current_user)):
    """Return the decoded JWT payload for the current session."""
    return user
