import os
import re
import jwt
import logging
from datetime import datetime, timedelta
from nacl.signing import VerifyKey
from nacl.exceptions import BadSignatureError
from fastapi import Security, HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from core.supabase import get_supabase
from typing import List, Optional

logger = logging.getLogger(__name__)

SECRET_KEY = os.getenv("JWT_SECRET", "supersecret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours
REPLAY_WINDOW_SECONDS = 300  # 5 minutes

if SECRET_KEY == "supersecret":
    logger.error(
        "CRITICAL SECURITY WARNING: JWT_SECRET is using the default value 'supersecret'. "
        "THIS IS A MAJOR VULNERABILITY IN PRODUCTION. Please set a strong JWT_SECRET in your .env!"
    )

security = HTTPBearer()


import base58


def _decode_signature(signature: str) -> bytes:
    """
    Auto-detect and decode a signature from either hex or base58 format.
    Phantom wallets produce raw bytes that the frontend may encode as either.
    """
    # Check if it looks like a hex string (even length, only hex chars)
    if all(c in "0123456789abcdefABCDEF" for c in signature) and len(signature) % 2 == 0:
        try:
            return bytes.fromhex(signature)
        except ValueError:
            pass

    # Fall back to base58
    try:
        return base58.b58decode(signature)
    except Exception:
        pass

    raise ValueError(f"Cannot decode signature: not valid hex or base58")


def _extract_timestamp_from_message(message: str) -> Optional[int]:
    """
    Extract the Unix timestamp from the signed message.
    Expected format includes 'Time: <unix_ms>' somewhere in the message.
    """
    match = re.search(r"Time:\s*(\d+)", message)
    if match:
        return int(match.group(1))
    return None


async def verify_solana_signature(wallet: str, message: str, signature: str) -> bool:
    """
    Verifies a Solana Ed25519 signature.
    - Accepts both hex and base58 encoded signatures.
    - Validates message timestamp to prevent replay attacks.
    - Allows DEV_ mock wallets ONLY if ALLOW_DEV_WALLETS is enabled.
    """
    # Allow demo/dev wallets through ONLY if explicitly enabled
    if wallet.startswith("DEV_") and signature == "MOCK_DEMO_SIGNATURE":
        if os.getenv("ALLOW_DEV_WALLETS", "false").lower() == "true":
            logger.warning(f"Using insecure DEV_ wallet for: {wallet}")
            return True
        else:
            logger.error(f"Blocked DEV_ wallet attempt in production: {wallet}")
            return False

    # Replay attack prevention: check timestamp freshness
    ts = _extract_timestamp_from_message(message)
    if ts is not None:
        # Timestamp is in milliseconds from frontend
        age_seconds = abs((datetime.utcnow().timestamp() * 1000 - ts) / 1000)
        if age_seconds > REPLAY_WINDOW_SECONDS:
            logger.warning(
                f"Replay attack blocked: message is {age_seconds:.0f}s old "
                f"(max {REPLAY_WINDOW_SECONDS}s) for wallet {wallet[:8]}..."
            )
            return False

    try:
        pubkey_bytes = base58.b58decode(wallet)
        sig_bytes = _decode_signature(signature)

        verify_key = VerifyKey(pubkey_bytes)
        verify_key.verify(message.encode(), sig_bytes)
        return True
    except BadSignatureError:
        logger.warning(f"Invalid signature for wallet {wallet[:8]}...")
        return False
    except Exception as e:
        logger.error(f"Signature verification error for {wallet[:8]}...: {e}")
        return False


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security),
):
    """
    Validates the custom JWT or Supabase JWT and returns the user payload.
    """
    token = credentials.credentials

    # 1. Try Custom JWT (Wallet/Demo)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id:
            payload["id"] = user_id
            return payload
    except jwt.PyJWTError:
        pass

    # 2. Try Supabase Auth Verification
    sb = get_supabase()
    if sb:
        try:
            # We call Supabase API to verify the token
            user_res = sb.auth.get_user(token)
            if user_res.user:
                # Map Supabase user to our payload format
                return {
                    "sub": user_res.user.id,
                    "id": user_res.user.id,
                    "email": user_res.user.email,
                    "roles": [user_res.user.user_metadata.get("role", "USER")],
                }
        except Exception:
            pass

    raise HTTPException(status_code=401, detail="Token expired or invalid")


# In-memory permission cache to reduce DB load
_PERMISSION_CACHE = {}

async def get_user_permissions(user_id: str) -> List[str]:
    """
    Fetches permissions for a specific user with internal caching.
    """
    if user_id in _PERMISSION_CACHE:
        cache_data, expiry = _PERMISSION_CACHE[user_id]
        if datetime.utcnow() < expiry:
            return cache_data

    sb = get_supabase()
    if not sb:
        return ["job.create", "profile.edit"] # Minimal safe default

    try:
        # Optimized query with better join mapping
        response = (
            sb.table("user_roles")
            .select("roles:role_id(role_permissions(permissions(permission_name)))")
            .eq("user_id", user_id)
            .execute()
        )

        permissions = set()
        for entry in response.data or []:
            role = entry.get("roles", {})
            for rp in role.get("role_permissions", []):
                perm = rp.get("permissions", {}).get("permission_name")
                if perm:
                    permissions.add(perm)

        perm_list = list(permissions)
        # Cache for 5 minutes
        _PERMISSION_CACHE[user_id] = (perm_list, datetime.utcnow() + timedelta(minutes=5))
        return perm_list
    except Exception as e:
        print(f"Permission fetch error for {user_id}: {e}")
        return []


def require_permission(permission: str):
    """
    Dependency factory to enforce a specific permission.
    """

    async def permission_checker(user=Depends(get_current_user)):
        user_id = getattr(user, "id", None) or user.get("id")
        perms = await get_user_permissions(user_id)

        if permission not in perms:
            raise HTTPException(
                status_code=403,
                detail=f"Access denied. Required permission: {permission}",
            )
        return user

    return permission_checker
