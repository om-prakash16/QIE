from fastapi import APIRouter, Depends
from portal.apps.jobs.service import JobService
from portal.core.security import get_current_user

router = APIRouter()
service = JobService()

@router.get("/")
async def list_jobs(user=Depends(get_current_user)):
    return await service.get_jobs_for_candidate(user["sub"])

@router.post("/")
async def create_job(data: dict, user=Depends(get_current_user)):
    # The company ID should be included in the data or derived from user's default company
    # For now we pass the user ID so the service can resolve the default company if needed
    data["_actor_id"] = user["sub"]
    return await service.post_job(data)
