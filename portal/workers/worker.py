import os
from arq import create_pool
from arq.connections import RedisSettings
from portal.workers.tasks.scouting_tasks import scout_candidates_for_job

# Redis Configuration (defaults to localhost)
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))

async def startup(ctx):
    """
    Initialize connections (e.g. DB clients) that tasks need.
    """
    print("Worker startup: Initializing task dependencies...")

async def shutdown(ctx):
    """
    Clean up connections.
    """
    print("Worker shutdown: Cleaning up...")

class WorkerSettings:
    """
    ARQ Worker settings.
    To run the worker, use: arq portal.workers.worker.WorkerSettings
    """
    functions = [scout_candidates_for_job]
    redis_settings = RedisSettings(host=REDIS_HOST, port=REDIS_PORT)
    on_startup = startup
    on_shutdown = shutdown
    max_jobs = 10
    job_timeout = 300 # 5 minutes
