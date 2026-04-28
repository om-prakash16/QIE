from fastapi import APIRouter, Depends
from portal.apps.identities.service import IdentityService
from portal.core.security import get_current_user, require_permission

router = APIRouter()
service = IdentityService()

@router.post("/submit")
async def submit_identity(data: dict, user=Depends(get_current_user)):
    return await service.submit(user["sub"], data["id_type"], data["document_url"])

@router.post("/verify/{user_id}")
async def verify_user_identity(user_id: str, data: dict, admin=Depends(require_permission("admin.verify"))):
    return await service.verify(user_id, admin["sub"], data["status"], data.get("reason"))
