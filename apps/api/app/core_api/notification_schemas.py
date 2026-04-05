from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional, Dict, Any

class NotificationBase(BaseModel):
    user_id: UUID
    type: str # e.g., 'nft_minted', 'job_offer'
    title: str
    message: str
    metadata: Optional[Dict[str, Any]] = {}

class NotificationCreate(NotificationBase):
    pass

class NotificationUpdate(BaseModel):
    status: str # 'read' or 'unread'

class NotificationResponse(NotificationBase):
    id: UUID
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class ActivityLogBase(BaseModel):
    user_id: Optional[UUID] = None
    action_type: str
    entity_type: Optional[str] = None
    entity_id: Optional[UUID] = None
    description: Optional[str] = None
    tx_hash: Optional[str] = None

class ActivityLogCreate(ActivityLogBase):
    pass

class ActivityLogResponse(ActivityLogBase):
    id: UUID
    timestamp: datetime

    class Config:
        from_attributes = True

class AILogBase(BaseModel):
    user_id: Optional[UUID] = None
    model_name: str
    operation_type: str
    input_summary: Optional[str] = None
    output_data: Optional[Dict[str, Any]] = None
    token_usage: Optional[int] = 0

class AILogCreate(AILogBase):
    pass

class AILogResponse(AILogBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
