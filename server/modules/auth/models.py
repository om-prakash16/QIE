from pydantic import BaseModel
from typing import Optional


class WalletLoginRequest(BaseModel):
    wallet_address: str
    message: str
    signature: str
    requested_role: Optional[str] = "USER"


class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str


class CompanyCreate(BaseModel):
    name: str


class CompanyInvite(BaseModel):
    company_id: str
    wallet_address: str
    role: str = "VIEWER"


class ApiKeyCreate(BaseModel):
    label: str
    scopes: Optional[list[str]] = ["read.proof_score", "read.skills"]
