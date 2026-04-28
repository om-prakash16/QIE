from fastapi import APIRouter, Depends
from portal.apps.applications.service import ApplicationService
from portal.core.security import get_current_user

router = APIRouter()
service = ApplicationService()

@router.post("/{job_id}/apply")
async def apply_to_job(job_id: str, user=Depends(get_current_user)):
    return await service.apply(job_id, user["sub"])

@router.get("/me")
async def get_my_applications(user=Depends(get_current_user)):
    return service.repository.get_by_candidate(user["sub"])

@router.post("/{app_id}/status")
async def update_app_status(app_id: str, data: dict, user=Depends(get_current_user)):
    return await service.update_status(app_id, data["status"], user["sub"])
