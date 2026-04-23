"""
Role-Based Access Control (RBAC) Guard Dependencies.

Reusable FastAPI dependencies for enforcing role-based access.
Import these in any router to protect endpoints by role.

Usage:
    @router.get("/admin-only")
    async def admin_endpoint(user=Depends(require_admin)):
        ...
"""

from fastapi import Depends, HTTPException
from modules.auth.service import get_current_user


async def require_admin(user=Depends(get_current_user)):
    """Dependency: Requires the caller to have the 'admin' role."""
    roles = [r.lower() for r in user.get("roles", [])]
    if "admin" not in roles and "super_admin" not in roles:
        raise HTTPException(
            status_code=403,
            detail="Administrative access required. Insufficient privileges.",
        )
    return user


async def require_company(user=Depends(get_current_user)):
    """Dependency: Requires the caller to have the 'company' role strictly."""
    roles = [r.lower() for r in user.get("roles", [])]
    if "company" not in roles:
        raise HTTPException(
            status_code=403,
            detail="Company access required. Insufficient privileges.",
        )
    return user


async def require_user(user=Depends(get_current_user)):
    """Dependency: Requires the caller to have the 'user' or 'talent' role strictly."""
    roles = [r.lower() for r in user.get("roles", [])]
    # If the user has 'admin' or 'company', they should use their respective endpoints.
    if "user" not in roles and "talent" not in roles:
        raise HTTPException(
            status_code=403,
            detail="User/Talent access required. Insufficient privileges.",
        )
    if not user or not user.get("sub"):
        raise HTTPException(
            status_code=401,
            detail="Authentication required.",
        )
    return user


async def require_company_or_admin(user=Depends(get_current_user)):
    """Dependency: Requires either company or admin role."""
    roles = [r.lower() for r in user.get("roles", [])]
    if "company" not in roles and "admin" not in roles:
        raise HTTPException(
            status_code=403,
            detail="Company or admin access required.",
        )
    return user


async def require_moderator(user=Depends(get_current_user)):
    """Dependency: Requires moderator or higher role."""
    roles = [r.lower() for r in user.get("roles", [])]
    if not any(r in roles for r in ["moderator", "admin", "super_admin"]):
        raise HTTPException(status_code=403, detail="Moderation access required.")
    return user


async def require_ai_admin(user=Depends(get_current_user)):
    """Dependency: Requires AI administrator role."""
    roles = [r.lower() for r in user.get("roles", [])]
    if "ai_admin" not in roles and "super_admin" not in roles:
        raise HTTPException(status_code=403, detail="AI System Configuration access required.")
    return user

