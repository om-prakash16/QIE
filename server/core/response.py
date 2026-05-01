from typing import Any, Dict, Optional, List
from datetime import datetime
from fastapi.responses import JSONResponse

def success_response(
    data: Any = None,
    meta: Optional[Dict[str, Any]] = None,
    status_code: int = 200
) -> Dict[str, Any]:
    """Standardized success response envelope."""
    response = {
        "status": "success",
        "data": data,
        "meta": {
            "timestamp": datetime.utcnow().isoformat(),
        }
    }
    if meta:
        response["meta"].update(meta)
    return response

def error_response(
    message: str,
    code: str = "internal_error",
    details: Any = None,
    status_code: int = 500
) -> JSONResponse:
    """Standardized error response envelope."""
    content = {
        "status": "error",
        "error": {
            "code": code,
            "message": message,
            "details": details
        },
        "meta": {
            "timestamp": datetime.utcnow().isoformat(),
        }
    }
    return JSONResponse(status_code=status_code, content=content)

def paginated_response(
    data: List[Any],
    total: int,
    page: int,
    size: int,
    meta: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """Standardized paginated response envelope."""
    pagination = {
        "total": total,
        "page": page,
        "size": size,
        "pages": (total + size - 1) // size if size > 0 else 0
    }
    
    extra_meta = {"pagination": pagination}
    if meta:
        extra_meta.update(meta)
        
    return success_response(data=data, meta=extra_meta)
