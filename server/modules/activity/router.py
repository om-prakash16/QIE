from fastapi import APIRouter, Depends, Query
from typing import Optional
from pydantic import BaseModel
from modules.auth.service import get_current_user, require_permission
from modules.activity.service import (
    record_event,
    get_user_timeline,
    get_company_timeline,
    get_admin_timeline,
)

router = APIRouter()


class EventRecord(BaseModel):
    event_type: str
    description: str
    entity_type: Optional[str] = None
    entity_id: Optional[str] = None
    metadata: Optional[dict] = None


# -- Candidate timeline --

@router.get("/user")
async def user_activity(
    limit: int = Query(20, ge=1, le=100),
    user=Depends(get_current_user),
):
    """Return the authenticated user's own activity timeline."""
    return await get_user_timeline(user["sub"], limit)


# -- Company timeline --

@router.get("/company")
async def company_activity(
    limit: int = Query(20, ge=1, le=100),
    user=Depends(get_current_user),
):
    """Return recruiter-scoped activity relevant to the company's jobs."""
    return await get_company_timeline(user["sub"], limit)


# -- Admin global feed --

@router.get("/admin")
async def admin_activity(
    limit: int = Query(50, ge=1, le=200),
    user=Depends(require_permission("admin.access")),
):
    """Return the unfiltered platform-wide event stream."""
    return await get_admin_timeline(limit)


# -- Record endpoint (internal use) --

@router.post("/record")
async def record(event: EventRecord, user=Depends(get_current_user)):
    """
    Log an activity event for the authenticated user.

    Mostly called server-side from other routers, but exposed as an
    endpoint so the frontend can log client-only actions (e.g. profile views).
    """
    roles = user.get("roles", ["USER"])
    role = roles[0].lower() if roles else "user"

    await record_event(
        actor_id=user["sub"],
        actor_role=role,
        event_type=event.event_type,
        description=event.description,
        entity_type=event.entity_type,
        entity_id=event.entity_id,
        metadata=event.metadata,
    )
    return {"status": "recorded"}
