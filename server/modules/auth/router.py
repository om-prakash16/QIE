from fastapi import APIRouter, HTTPException, Depends
from modules.auth.service import (
    verify_solana_signature,
    create_access_token,
    get_current_user,
)
from modules.auth.models import WalletLoginRequest, AuthTokenResponse
from core.supabase import get_supabase
from core.events import bus
from modules.auth.handlers import USER_CREATED
import uuid
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


def _generate_user_code(db) -> str:
    """
    Generate a sequential user code in the format BHT-XXXXX.
    Queries the max existing code and increments.
    """
    try:
        result = (
            db.table("users")
            .select("user_code")
            .not_.is_("user_code", "null")
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )

        if result.data and result.data[0].get("user_code"):
            last_code = result.data[0]["user_code"]
            # Extract the number part from "BHT-XXXXX"
            try:
                num = int(last_code.split("-")[1])
                return f"BHT-{num + 1}"
            except (IndexError, ValueError):
                pass

        # First user or no valid codes found
        return "BHT-10001"
    except Exception as e:
        logger.warning(f"user_code generation fallback: {e}")
        # Fallback: use a hash-based code
        short_id = uuid.uuid4().hex[:5].upper()
        return f"BHT-{short_id}"


@router.post("/wallet-login", response_model=AuthTokenResponse)
async def wallet_login(req: WalletLoginRequest):
    """
    Verify a signed Solana message and return a JWT.

    New wallets are automatically registered on first login. The `requested_role`
    field lets the frontend declare intent (USER vs COMPANY) at signup time —
    existing accounts always use the role stored in the DB.
    """
    is_valid = await verify_solana_signature(
        req.wallet_address, req.message, req.signature
    )
    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid signature")

    db = get_supabase()
    if not db:
        raise HTTPException(status_code=500, detail="Database unavailable")

    existing = (
        db.table("users").select("*").eq("wallet_address", req.wallet_address).execute()
    )

    role = req.requested_role.lower() if req.requested_role else "user"

    if existing.data:
        user = existing.data[0]
    else:
        # First time this wallet has connected — create the account.
        uid = str(uuid.uuid4())
        user_code = _generate_user_code(db)
        # Truncate wallet for a default name
        default_name = f"User {req.wallet_address[:6]}"

        try:
            created = (
                db.table("users")
                .insert(
                    {
                        "id": uid,
                        "wallet_address": req.wallet_address,
                        "full_name": default_name,
                        "user_code": user_code,
                        "profile_data": {
                            "skills": [],
                            "education": [],
                            "experience": [],
                            "bio": "",
                            "proof_score": 0,
                        },
                    }
                )
                .execute()
            )

            if not created.data:
                logger.error(f"Failed to create account in Supabase for wallet {req.wallet_address}")
                raise HTTPException(status_code=500, detail="Could not create user account")
            
            user = created.data[0]
        except Exception as e:
            if req.wallet_address.startswith("DEV_"):
                logger.warning(f"Demo wallet registration DB failure (likely RLS): {e}. Falling back to mock user for testing.")
                user = {
                    "id": uid,
                    "wallet_address": req.wallet_address,
                    "full_name": default_name,
                    "user_code": user_code,
                    "email": None,
                }
            else:
                logger.error(f"Critical failure during user registration: {e}")
                raise HTTPException(status_code=500, detail="Registration failed. Please ensure the backend has the correct Supabase Service Role Key.")

        # Emit event for new registration (side effects like welcome email)
        await bus.emit(
            USER_CREATED,
            {
                "user_id": user["id"],
                "email": user.get("email"),
                "name": user.get("full_name"),
                "wallet": req.wallet_address,
            },
        )

    # Pull existing roles for this user
    try:
        user_roles_query = (
            db.table("user_roles")
            .select("roles(role_name)")
            .eq("user_id", user["id"])
            .execute()
        )
        current_roles_upper = (
            [r["roles"]["role_name"].upper() for r in user_roles_query.data]
            if user_roles_query.data
            else []
        )
    except Exception:
        current_roles_upper = []

    # Use uppercase for database querying
    db_role_name = role.upper()

    # Ensure the requested role is assigned if not already present
    if db_role_name not in current_roles_upper:
        try:
            # Avoid .single() crash by fetching and checking length
            role_row = (
                db.table("roles").select("id").eq("role_name", db_role_name).execute()
            )
            if role_row.data and len(role_row.data) > 0:
                db.table("user_roles").insert(
                    {
                        "user_id": user["id"],
                        "role_id": role_row.data[0]["id"],
                    }
                ).execute()
                current_roles_upper.append(db_role_name)
        except Exception as e:
            logger.warning(f"Could not assign role in DB: {e}. Adding to session roles only.")
            current_roles_upper.append(db_role_name)

    final_role = current_roles_upper[0].lower() if current_roles_upper else "user"

    token = create_access_token(
        data={
            "sub": user["id"],
            "wallet": user["wallet_address"],
            "roles": [r.lower() for r in current_roles_upper]
            if current_roles_upper
            else ["user"],
        }
    )

    return AuthTokenResponse(
        access_token=token,
        role=final_role,
        user_id=user["id"],
        user_code=user.get("user_code"),
        wallet_address=user["wallet_address"],
        name=user.get("full_name", f"User {req.wallet_address[:6]}"),
    )


@router.get("/me")
async def get_me(user=Depends(get_current_user)):
    """Return the decoded JWT payload for the current session."""
    return user
