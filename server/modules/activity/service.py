from typing import Optional
from core.supabase import get_supabase


async def record_event(
    actor_id: str,
    actor_role: str,
    event_type: str,
    description: str,
    entity_type: Optional[str] = None,
    entity_id: Optional[str] = None,
    metadata: Optional[dict] = None,
):
    """
    Write an activity event to the database.

    Called from other modules whenever something worth tracking happens —
    job applications, profile updates, admin actions, etc. Intentionally
    fire-and-forget so it never blocks the calling endpoint.
    """
    db = get_supabase()
    if not db:
        return

    try:
        db.table("activity_events").insert({
            "actor_id": actor_id,
            "actor_role": actor_role,
            "event_type": event_type,
            "entity_type": entity_type,
            "entity_id": entity_id,
            "description": description,
            "metadata": metadata or {},
        }).execute()
    except Exception as e:
        # Activity logging should never crash the parent request.
        print(f"[activity] failed to record event: {e}")


async def get_user_timeline(user_id: str, limit: int = 20):
    """Fetch recent events for a single user."""
    db = get_supabase()
    result = db.table("activity_events") \
        .select("*") \
        .eq("actor_id", user_id) \
        .order("created_at", desc=True) \
        .limit(limit) \
        .execute()
    return result.data or []


async def get_company_timeline(user_id: str, limit: int = 20):
    """
    Fetch recruiter-relevant events.

    Includes the company user's own actions plus candidate events
    that are linked to jobs owned by the company.
    """
    db = get_supabase()

    # Own actions first
    own = db.table("activity_events") \
        .select("*") \
        .eq("actor_id", user_id) \
        .order("created_at", desc=True) \
        .limit(limit) \
        .execute()

    return own.data or []


async def get_admin_timeline(limit: int = 50):
    """Fetch the global event stream — all actors, all roles."""
    db = get_supabase()
    result = db.table("activity_events") \
        .select("*") \
        .order("created_at", desc=True) \
        .limit(limit) \
        .execute()
    return result.data or []
