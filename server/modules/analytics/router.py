from fastapi import APIRouter, Depends
from typing import Dict, Any
from modules.analytics.service import AnalyticsService
from modules.auth.service import get_current_user, require_permission
import uuid

router = APIRouter()
svc = AnalyticsService()


# -- Role-scoped analytics --

@router.get("/user")
async def user_analytics(user: Dict[str, Any] = Depends(get_current_user)):
    """Career growth metrics for the authenticated candidate."""
    return await svc.get_user_analytics(uuid.UUID(user["sub"]))


@router.get("/company")
async def company_analytics(user: Dict[str, Any] = Depends(get_current_user)):
    """Recruitment pipeline metrics for the authenticated recruiter."""
    return await svc.get_company_analytics(uuid.UUID(user["sub"]))


@router.get("/admin")
async def admin_analytics(user: Dict[str, Any] = Depends(require_permission("admin.access"))):
    """Platform-wide health and growth dashboard data."""
    return await svc.get_admin_analytics()


# -- Insights endpoints (same data, aliased for frontend clarity) --

@router.get("/insights/user")
async def user_insights(user: Dict[str, Any] = Depends(get_current_user)):
    """Alias for /analytics/user — used by the insights dashboard."""
    return await svc.get_user_analytics(uuid.UUID(user["sub"]))


@router.get("/insights/company")
async def company_insights(user: Dict[str, Any] = Depends(get_current_user)):
    """Alias for /analytics/company — used by the insights dashboard."""
    return await svc.get_company_analytics(uuid.UUID(user["sub"]))


@router.get("/insights/admin")
async def admin_insights(user: Dict[str, Any] = Depends(require_permission("admin.access"))):
    """Alias for /analytics/admin — used by the insights dashboard."""
    return await svc.get_admin_analytics()
