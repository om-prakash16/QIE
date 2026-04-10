import os
import jwt
from datetime import datetime, timedelta
from nacl.signing import VerifyKey
from nacl.exceptions import BadSignatureError
from fastapi import Security, HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from core.supabase import get_supabase
from typing import List, Optional, Dict, Any

SECRET_KEY = os.getenv("JWT_SECRET", "supersecret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440 # 24 hours

security = HTTPBearer()

async def verify_solana_signature(wallet: str, message: str, signature: str) -> bool:
    """
    Verifies a Solana Ed25519 signature.
    Signature expected as hex string.
    Supports a 'MOCK_DEMO_SIGNATURE' for wallets starting with 'DEV_' for testing.
    """
    if wallet.startswith("DEV_") and signature == "MOCK_DEMO_SIGNATURE":
        return True

    try:
        verify_key = VerifyKey(bytes.fromhex(wallet))
        verify_key.verify(message.encode(), bytes.fromhex(signature))
        return True
    except (BadSignatureError, ValueError):
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

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Validates the custom JWT and returns the user payload.
    """
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return payload
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token expired or invalid")

async def get_user_permissions(user_id: str) -> List[str]:
    """
    Fetches permissions for a specific user based on their roles.
    """
    sb = get_supabase()
    if not sb:
        # Full access in mock mode
        return [
            "job.create", "job.edit", "job.moderate", 
            "profile.edit", "profile.moderate", 
            "ai.config.manage", "schema.manage", "user.promote"
        ]

    try:
        # Complex join query to get all permissions for the user's role
        # We query the user_roles -> roles -> role_permissions -> permissions
        # Supabase syntax for joins:
        response = sb.table("user_roles") \
            .select("roles(role_permissions(permissions(permission_name)))") \
            .eq("user_id", user_id) \
            .execute()

        permissions = []
        for role_entry in response.data:
            role = role_entry.get("roles", {})
            role_perms = role.get("role_permissions", [])
            for rp in role_perms:
                perm_obj = rp.get("permissions", {})
                if perm_name := perm_obj.get("permission_name"):
                    permissions.append(perm_name)
        
        return list(set(permissions)) # De-duplicate
    except Exception as e:
        print(f"Permission fetch error: {str(e)}")
        return []

def require_permission(permission: str):
    """
    Dependency factory to enforce a specific permission.
    """
    async def permission_checker(user = Depends(get_current_user)):
        user_id = getattr(user, "id", None) or user.get("id")
        perms = await get_user_permissions(user_id)
        
        if permission not in perms:
            raise HTTPException(
                status_code=403, 
                detail=f"Access denied. Required permission: {permission}"
            )
        return user
    return permission_checker
