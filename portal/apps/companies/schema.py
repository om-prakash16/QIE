from pydantic import BaseModel, Field
from typing import List, Optional

class CompanyCreate(BaseModel):
    name: str = Field(..., min_length=2)

class CompanyInvite(BaseModel):
    company_id: str
    wallet_address: str
    role: str = "MEMBER"

class ApiKeyCreate(BaseModel):
    label: str
    scopes: List[str] = ["read"]
