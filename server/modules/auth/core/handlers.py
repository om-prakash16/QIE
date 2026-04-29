import logging
from core.events import bus
from modules.auth.core.mailer import mailer
from modules.activity.service import record_event

logger = logging.getLogger(__name__)

# Event Name Constants
USER_CREATED = "USER_CREATED"
JOB_APPLIED = "JOB_APPLIED"
IDENTITY_VERIFIED = "IDENTITY_VERIFIED"
IDENTITY_REJECTED = "IDENTITY_REJECTED"
JOB_POSTED = "JOB_POSTED"


async def handle_user_created(data: dict):
    """
    Handler for USER_CREATED event.
    data expected: { "user_id": str, "email": str, "name": str, "wallet": str }
    """
    uid = data.get("user_id")
    email = data.get("email")
    name = data.get("name")

    # 1. Record Activity
    if uid:
        await record_event(
            actor_id=uid,
            actor_role="user",
            event_type="registration",
            description=f"Synchronized wallet {data.get('wallet')[:6]} with the Nexus.",
        )

    # 2. Trigger Mailer
    if email:
        logger.info(f"Processing Welcome Email for {email}")
        await mailer.send_welcome_email(email, name or "Member")


async def handle_job_applied(data: dict):
    """
    Handler for JOB_APPLIED event.
    data expected: { "user_id": str, "email": str, "job_title": str, "company_name": str }
    """
    data.get("user_id")
    email = data.get("email")
    job_title = data.get("job_title")

    # Activity is already logged in service.py for Job Application,
    # but we could add a specific telemetry event here.

    if email:
        logger.info(f"Processing Application Alert for {email} / Job: {job_title}")
        await mailer.send_application_alert(email, job_title or "Position")


async def handle_identity_status(data: dict):
    """
    Handler for IDENTITY_VERIFIED and IDENTITY_REJECTED events.
    data expected: { "user_id": str, "email": str, "name": str, "status": str, "reason": str }
    """
    uid = data.get("user_id")
    email = data.get("email")
    name = data.get("name")
    status = data.get("status")
    reason = data.get("reason")

    # 1. Record Activity
    if uid:
        await record_event(
            actor_id=uid,
            actor_role="user",
            event_type=f"identity_{status}",
            description=f"Identity verification protocol {status} by administrative node.",
        )

    # 2. Trigger Mailer
    if email:
        logger.info(f"Processing Identity Email ({status}) for {email}")
        await mailer.send_verification_email(email, name or "User", status, reason)


async def handle_job_posted(data: dict):
    """
    Handler for JOB_POSTED event.
    Triggers job alerts for candidates with 'ai_recommendations' enabled
    and a skill match > 70%.
    """
    from core.supabase import get_supabase
    db = get_supabase()
    if not db:
        return

    job_id = data.get("job_id")
    job_title = data.get("title")
    job_skills = set([s.lower() for s in data.get("skills_required", [])])

    if not job_skills:
        return

    # 1. Query users with active subscriptions
    # We fetch users and their profile_data to check for matches
    try:
        # Get users who have 'ai_recommendations' set to true in their JSONB prefs
        # Supabase/PostgREST syntax for JSONB filter: notification_prefs->>ai_recommendations.eq.true
        active_subs = (
            db.table("user_settings")
            .select("user_id, users(email, full_name, profile_data)")
            .eq("notification_prefs->>ai_recommendations", "true")
            .execute()
        )

        if not active_subs.data:
            return

        logger.info(f"Checking job alerts for {len(active_subs.data)} subscribers.")

        for sub in active_subs.data:
            user = sub.get("users", {})
            email = user.get("email")
            if not email:
                continue

            profile_skills = set([s.lower() for s in user.get("profile_data", {}).get("skills", [])])
            
            # Simple overlap check
            if profile_skills:
                match_count = len(job_skills.intersection(profile_skills))
                match_percent = (match_count / len(job_skills)) * 100 if job_skills else 0
                
                if match_percent >= 70:
                    logger.info(f"MATCH FOUND: Notifying {email} about {job_title}")
                    await mailer.send_job_alert(
                        email=email,
                        name=user.get("full_name", "Candidate"),
                        job_title=job_title,
                        match_score=int(match_percent)
                    )
    except Exception as e:
        logger.error(f"Error processing job alerts: {e}")


def initialize_event_handlers():
    """
    Register all system-wide event handlers to the core bus.
    This should be called during application startup.
    """
    bus.subscribe(USER_CREATED, handle_user_created)
    bus.subscribe(JOB_APPLIED, handle_job_applied)
    bus.subscribe(IDENTITY_VERIFIED, handle_identity_status)
    bus.subscribe(IDENTITY_REJECTED, handle_identity_status)
    bus.subscribe(JOB_POSTED, handle_job_posted)

    logger.info("Platform Event Handlers Initialized Successfully.")
