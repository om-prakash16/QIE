from fastapi import APIRouter, Depends, Body
from typing import Dict, Any, Optional
from pydantic import BaseModel

from core.response import success_response
from modules.auth.core.guards import require_admin
from modules.cms.service import CMSService

router = APIRouter()

class CMSUpdateRequest(BaseModel):
    section_key: str
    content_key: str
    content_value: str
    metadata: Optional[Dict[str, Any]] = None

@router.get("/")
async def get_all_cms_content():
    """Public endpoint to fetch all active site content."""
    content = await CMSService.get_all_active()
    return success_response(data=content)

@router.get("/{section}")
async def get_cms_section(section: str):
    """Fetch content for a specific section."""
    content = await CMSService.get_by_section(section)
    return success_response(data=content)

@router.patch("/update")
async def update_cms_content(
    update: CMSUpdateRequest, 
    admin=Depends(require_admin)
):
    """Admin-only: update site text and metadata."""
    data = await CMSService.upsert_content(update.model_dump(), admin["id"])
    return success_response(data=data, message="CMS content updated")

@router.delete("/{section}/{key}")
async def delete_cms_content(
    section: str, 
    key: str, 
    admin=Depends(require_admin)
):
    """Admin-only: deactivate a specific CMS key."""
    await CMSService.deactivate_key(section, key)
    return success_response(data=None, message="CMS entry deactivated")
