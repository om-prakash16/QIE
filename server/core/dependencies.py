from typing import Optional
from fastapi import Depends, Header, HTTPException, status
from core.supabase import get_supabase
from core.exceptions import AuthorizationError, ExternalServiceError, ValidationError
from modules.auth.core.service import get_current_user

async def get_db():
    """Dependency that returns the Supabase client or raises an error."""
    db = get_supabase()
    if not db:
        raise ExternalServiceError(
            message="Database connection is currently unavailable",
            details={"service": "supabase"}
        )
    return db

async def get_optional_db():
    """Dependency that returns the Supabase client or None (for graceful degradation)."""
    return get_supabase()

async def get_current_user_id(user = Depends(get_current_user)) -> str:
    """Extracts the user ID (UUID) from the authenticated user payload."""
    user_id = user.get("sub") or user.get("id")
    if not user_id:
        raise AuthorizationError(message="Invalid user payload: missing ID")
    return str(user_id)

async def get_validated_wallet(
    wallet: str = Header(..., alias="x-wallet-address"),
) -> str:
    """Validates the format of a Solana wallet address from headers."""
    # Basic Solana wallet regex (base58, 32-44 characters)
    import re
    if not re.match(r"^[1-9A-HJ-NP-Za-km-z]{32,44}$", wallet):
        if not wallet.startswith("DEV_"): # Allow demo wallets
            raise ValidationError(
                message="Invalid wallet address format",
                details={"wallet": wallet}
            )
    return wallet

async def get_company_id(
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_db)
) -> str:
    """Lookups and returns the company ID owned by the current user."""
    res = db.table("companies").select("id").eq("created_by_user_id", user_id).limit(1).execute()
    if not res.data:
        raise AuthorizationError(
            message="No company profile found for this user",
            details={"user_id": user_id}
        )
    return str(res.data[0]["id"])
