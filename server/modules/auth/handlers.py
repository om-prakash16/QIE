import logging
from core.events import bus
from modules.auth.mailer import mailer

logger = logging.getLogger(__name__)

# Event Name Constants
USER_CREATED = "USER_CREATED"
JOB_APPLIED = "JOB_APPLIED"

async def handle_user_created(data: dict):
    """
    Handler for USER_CREATED event.
    data expected: { "email": str, "name": str }
    """
    email = data.get("email")
    name = data.get("name")
    
    if not email:
        logger.warning("USER_CREATED handler skipped: No email provided.")
        return

    logger.info(f"Processing Welcome Email for {email}")
    await mailer.send_welcome_email(email, name or "Member")

async def handle_job_applied(data: dict):
    """
    Handler for JOB_APPLIED event.
    data expected: { "email": str, "job_title": str }
    """
    email = data.get("email")
    job_title = data.get("job_title")
    
    if not email:
        logger.warning("JOB_APPLIED handler skipped: No email provided.")
        return

    logger.info(f"Processing Application Alert for {email} / Job: {job_title}")
    await mailer.send_application_alert(email, job_title or "Position")

def initialize_event_handlers():
    """
    Register all system-wide event handlers to the core bus.
    This should be called during application startup.
    """
    bus.subscribe(USER_CREATED, handle_user_created)
    bus.subscribe(JOB_APPLIED, handle_job_applied)
    
    logger.info("Platform Event Handlers Initialized Successfully.")
