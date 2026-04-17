from fastapi import Header, HTTPException, Depends
from typing import Dict, Any, Optional
from modules.companies.enterprise_api_service import EnterpriseApiService

api_service = EnterpriseApiService()

async def require_enterprise_key(x_api_key: Optional[str] = Header(None)) -> Dict[str, Any]:
    """
    FastAPI Dependency to authenticate external ATS systems.
    Validates the X-API-KEY header and returns company context.
    """
    if not x_api_key:
        raise HTTPException(
            status_code=401, 
            detail="Missing API Key. Provide it in the X-API-KEY header."
        )

    company_ctx = await api_service.validate_api_key(x_api_key)
    
    if not company_ctx:
        raise HTTPException(
            status_code=403, 
            detail="Invalid or deactivated Enterprise API Key."
        )

    return company_ctx
