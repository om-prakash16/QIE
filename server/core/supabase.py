import os
import logging
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# Try to import supabase, gracefully fallback if not installed yet
try:
    from supabase import create_client, Client

    SUPABASE_URL = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY", "")

    if SUPABASE_URL and SUPABASE_KEY:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        logger.info(f"Supabase connected successfully! (Privilege: {'System' if os.getenv('SUPABASE_SERVICE_ROLE_KEY') else 'Standard'})")
    else:
        supabase = None
        logger.warning("Supabase keys not found in .env - running in mock mode")

except ImportError:
    supabase = None
    logger.warning("supabase-py not installed - running in mock mode")


def get_supabase() -> Optional["Client"]:
    """Returns the Supabase client instance, or None if not configured."""
    return supabase

def check_db_health() -> bool:
    """Checks if the Supabase client is initialized and reachable."""
    if not supabase:
        return False
    try:
        # Simple query to check connectivity
        supabase.table("users").select("count", count="exact").limit(1).execute()
        return True
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return False
