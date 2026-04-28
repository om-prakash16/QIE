from portal.workers.tasks.scouting_tasks import scout_candidates_for_job

async def handle_job_posted(data: dict):
    """
    Triggered when a new job is posted.
    """
    job_id = data.get("job_id")
    company_id = data.get("company_id")
    
    if job_id and company_id:
        # In a real distributed system, we would queue this with Celery/RQ.
        # Here we run it as a fire-and-forget background task.
        import asyncio
        asyncio.create_task(scout_candidates_for_job(job_id, company_id))
