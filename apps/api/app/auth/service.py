from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from core.supabase import get_supabase
from typing import List, Optional

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Validates the Supabase JWT and returns the user object.
    """
    sb = get_supabase()
    if not sb:
        # Mock mode for development
        return {"id": "mock_id", "email": "mock@example.com", "user_metadata": {"role": "admin"}}

    token = credentials.credentials
    try:
        # Supabase's auth.get_user(token) handles signature validation internally
        response = sb.auth.get_user(token)
        if not response.user:
            raise HTTPException(status_code=401, detail="Invalid or expired session")
        return response.user
    except Exception as e:
        print(f"Auth error: {str(e)}")
        raise HTTPException(status_code=401, detail="Could not validate credentials")

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
