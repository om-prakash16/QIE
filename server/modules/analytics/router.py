from fastapi import APIRouter, Depends
from typing import Dict, Any
import uuid

from core.response import success_response
from core.dependencies import get_current_user_id
from modules.auth.core.guards import require_admin
from modules.analytics.service import AnalyticsService
from modules.analytics.market_intelligence_router import router as market_intel_router
from modules.ai.services.growth_service import GrowthTrackingService

router = APIRouter()
svc = AnalyticsService()
growth_svc = GrowthTrackingService()

@router.get("/public")
async def public_analytics():
    """Aggregate totals for the public landing page."""
    data = await svc.get_public_stats()
    return success_response(data=data)

@router.get("/user")
async def user_analytics(user_id: str = Depends(get_current_user_id)):
    """Career growth metrics for the authenticated candidate."""
    data = await svc.get_user_analytics(uuid.UUID(user_id))
    return success_response(data=data)

@router.get("/user/growth")
async def user_growth_tracking(user_id: str = Depends(get_current_user_id)):
    """Historical growth data and milestones."""
    data = await growth_svc.get_user_growth_metrics(user_id)
    return success_response(data=data)

@router.get("/company")
async def company_analytics(user_id: str = Depends(get_current_user_id)):
    """Recruitment pipeline metrics for the recruiter."""
    data = await svc.get_company_analytics(uuid.UUID(user_id))
    return success_response(data=data)

@router.get("/admin")
async def admin_analytics(admin=Depends(require_admin)):
    """Platform-wide health and growth dashboard data."""
    data = await svc.get_admin_analytics()
    return success_response(data=data)

# Insights Aliases
@router.get("/insights/user")
async def user_insights(user_id: str = Depends(get_current_user_id)):
    data = await svc.get_user_analytics(uuid.UUID(user_id))
    return success_response(data=data)

@router.get("/insights/company")
async def company_insights(user_id: str = Depends(get_current_user_id)):
    data = await svc.get_company_analytics(uuid.UUID(user_id))
    return success_response(data=data)

@router.get("/insights/admin")
async def admin_insights(admin=Depends(require_admin)):
    data = await svc.get_admin_analytics()
    return success_response(data=data)

router.include_router(
    market_intel_router, prefix="/market-intel", tags=["Market Intelligence"]
)
