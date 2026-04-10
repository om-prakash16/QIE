from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException, Query
from typing import List, Dict, Any
from modules.auth.service import get_current_user
from modules.chat.service import ChatService
from modules.chat.ws_manager import manager
from modules.chat.models import RoomResponse, RoomCreate, MessageResponse
import json

router = APIRouter()
chat_service = ChatService()

@router.get("/rooms", response_model=List[RoomResponse])
async def list_rooms(current_user = Depends(get_current_user)):
    """List all active community discussion rooms."""
    return await chat_service.get_rooms()

@router.get("/history/{room_id}", response_model=List[MessageResponse])
async def get_room_history(room_id: str, limit: int = Query(50), current_user = Depends(get_current_user)):
    """Fetch previous messages for a room."""
    return await chat_service.get_history(room_id, limit)

@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    # Auth is tricky over WS, we usually pass token as query param
    # For now, we connect, but in production, we'd verify JWT from header/query
    
    await manager.connect(websocket, room_id)
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            # Save message to DB
            saved_msg = await chat_service.save_message(
                room_id=room_id,
                user_id=payload["user_id"],
                content=payload["content"]
            )
            
            # Broadcast to everyone in the room
            await manager.broadcast(json.dumps(saved_msg), room_id)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
    except Exception as e:
        print(f"WS Error: {e}")
        manager.disconnect(websocket, room_id)
