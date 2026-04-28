from arq import create_pool
from arq.connections import RedisSettings
import os

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))

async def enqueue_task(task_name: str, *args, **kwargs):
    """
    Push a task into the background queue.
    """
    redis = await create_pool(RedisSettings(host=REDIS_HOST, port=REDIS_PORT))
    try:
        await redis.enqueue_job(task_name, *args, **kwargs)
        print(f"Task Enqueued: {task_name}")
    finally:
        await redis.close()
