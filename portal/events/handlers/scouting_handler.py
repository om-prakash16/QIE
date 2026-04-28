from portal.workers.tasks.scouting_tasks import scout_candidates_for_job

async def handle_job_posted(data: dict):
    """
    Triggered when a new job is posted.
    """
    job_id = data.get("job_id")
    company_id = data.get("company_id")
    
    if job_id and company_id:
        # We now use the ARQ worker queue for durable background processing.
        from portal.workers.queue import enqueue_task
        import asyncio
        asyncio.create_task(enqueue_task("scout_candidates_for_job", job_id, company_id))
