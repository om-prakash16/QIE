from typing import Any, Dict, Optional
from fastapi import status

class AppException(Exception):
    """Base exception for all application errors."""
    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        code: str = "internal_error",
        details: Optional[Any] = None
    ):
        self.message = message
        self.status_code = status_code
        self.code = code
        self.details = details
        super().__init__(message)

class NotFoundError(AppException):
    def __init__(self, message: str = "Resource not found", details: Optional[Any] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_404_NOT_FOUND,
            code="not_found",
            details=details
        )

class ValidationError(AppException):
    def __init__(self, message: str = "Validation failed", details: Optional[Any] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            code="validation_error",
            details=details
        )

class AuthorizationError(AppException):
    def __init__(self, message: str = "Unauthorized access", details: Optional[Any] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="unauthorized",
            details=details
        )

class ExternalServiceError(AppException):
    def __init__(self, message: str = "External service error", details: Optional[Any] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_502_BAD_GATEWAY,
            code="external_service_error",
            details=details
        )
