from fastapi import APIRouter, Depends, Body
from typing import Dict, Any, Optional
import uuid
import logging

from core.response import success_response
from core.supabase import get_supabase
from core.events import bus
from core.exceptions import AuthorizationError, ExternalServiceError

from modules.auth.core.service import verify_solana_signature, create_access_token, get_current_user
from modules.auth.schemas.models import WalletLoginRequest, AuthTokenResponse
from modules.auth.core.handlers import USER_CREATED

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/wallet")
async def wallet_login(req: WalletLoginRequest):
    """Verify a signed Solana message and return a JWT."""
    is_valid = await verify_solana_signature(req.wallet_address, req.message, req.signature)
    if not is_valid:
        raise AuthorizationError("Invalid signature verification failed")

    db = get_supabase()
    if not db: raise ExternalServiceError("Database unavailable")

    existing = db.table("users").select("*").eq("wallet_address", req.wallet_address).execute()
    role = (req.requested_role or "user").lower()

    if existing.data:
        user = existing.data[0]
    else:
        # Register new user
        uid = str(uuid.uuid4())
        default_name = f"User {req.wallet_address[:6]}"
        
        try:
            created = db.table("users").insert({
                "id": uid,
                "wallet_address": req.wallet_address,
                "full_name": default_name,
                # user_code is handled by DB trigger trg_generate_user_code
                "profile_data": {"skills": [], "proof_score": 0}
            }).execute()
            if not created.data: raise ExternalServiceError("Failed to create user record")
            user = created.data[0]
            
            await bus.emit(USER_CREATED, {
                "user_id": user["id"],
                "name": user["full_name"],
                "wallet": req.wallet_address
            })
        except Exception as e:
            logger.error(f"Registration failed: {e}")
            raise ExternalServiceError("User registration failed")

    # Role management
    try:
        user_roles_query = db.table("user_roles").select("roles(role_name)").eq("user_id", user["id"]).execute()
        current_roles = [r["roles"]["role_name"].lower() for r in user_roles_query.data] if user_roles_query.data else []
    except:
        current_roles = []

    if role not in current_roles:
        try:
            role_row = db.table("roles").select("id").eq("role_name", role.upper()).execute()
            if role_row.data:
                db.table("user_roles").insert({"user_id": user["id"], "role_id": role_row.data[0]["id"]}).execute()
                current_roles.append(role)
        except Exception as e:
            logger.warning(f"Role assignment failed: {e}")
            current_roles.append(role)

    token = create_access_token(data={
        "sub": user["id"],
        "wallet": user["wallet_address"],
        "roles": current_roles if current_roles else ["user"]
    })

    data = {
        "access_token": token,
        "role": current_roles[0] if current_roles else "user",
        "user_id": user["id"],
        "user_code": user.get("user_code"),
        "wallet_address": user["wallet_address"],
        "name": user.get("full_name")
    }
    return success_response(data=data, message="Authentication successful")

@router.get("/me")
async def get_me(user=Depends(get_current_user)):
    """Return the current user's session data."""
    return success_response(data=user)
