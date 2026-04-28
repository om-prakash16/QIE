import os
import jwt
import logging
from datetime import datetime, timedelta
from fastapi import Security, HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from portal.core.supabase import get_supabase
from typing import List, Optional

logger = logging.getLogger(__name__)

SECRET_KEY = os.getenv("JWT_SECRET", "supersecret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

# Role Hierarchy for RBAC
ROLE_HIERARCHY = {
    "SUPER_ADMIN": 100,
    "ADMIN": 80,
    "COMPANY_OWNER": 60,
    "RECRUITER": 40,
    "USER": 10
}

security = HTTPBearer()


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


def require_role(min_role: str):
    """
    Dependency to enforce a minimum role hierarchy (RBAC).
    Example: require_role("COMPANY_OWNER") will allow COMPANY_OWNER, ADMIN, SUPER_ADMIN
    """
    async def role_checker(user=Depends(get_current_user)):
        user_roles = user.get("roles", ["USER"])
        
        # User has multiple roles potentially; get their highest hierarchy level
        user_level = max([ROLE_HIERARCHY.get(r.upper(), 0) for r in user_roles], default=0)
        required_level = ROLE_HIERARCHY.get(min_role.upper(), 100)

        if user_level < required_level:
            raise HTTPException(
                status_code=403,
                detail=f"Access denied. Required role level: {min_role}",
            )
        return user

    return role_checker
