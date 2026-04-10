from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class RoomBase(BaseModel):
    room_name: str
    category: str
    description: Optional[str] = None

class RoomCreate(RoomBase):
    pass

class RoomResponse(RoomBase):
    id: UUID
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class MessageCreate(BaseModel):
    room_id: UUID
    content: str

class MessageResponse(BaseModel):
    id: UUID
    room_id: UUID
    user_id: UUID
    content: str
    created_at: datetime
    # Optional: include user display name later
    user_name: Optional[str] = None

    class Config:
        from_attributes = True
