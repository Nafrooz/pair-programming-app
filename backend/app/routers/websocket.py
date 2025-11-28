"""WebSocket routes for real-time collaboration."""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.websocket_manager import manager
from app.services.room_service import RoomService
import json
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    """
    WebSocket endpoint for real-time code collaboration.

    Clients connect to this endpoint with a room_id.
    All code updates are broadcast to other users in the same room.
    """
    # Get database session
    db: Session = next(get_db())

    try:
        # Verify room exists
        room = RoomService.get_room(db, room_id)
        if not room:
            await websocket.close(code=4004, reason="Room not found")
            return

        # Accept the connection
        await manager.connect(websocket, room_id)

        # Send current room state to the newly connected client
        initial_state = {
            "type": "init",
            "code": room.code,
            "language": room.language,
            "active_users": manager.get_room_connection_count(room_id)
        }
        await manager.send_personal_message(json.dumps(initial_state), websocket)

        # Notify other users about new connection
        user_join_message = {
            "type": "user_joined",
            "active_users": manager.get_room_connection_count(room_id)
        }
        await manager.broadcast_to_room(user_join_message, room_id, exclude_websocket=websocket)

        # Listen for messages
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message = json.loads(data)

            message_type = message.get("type")

            if message_type == "code_update":
                # Update code in database
                code = message.get("code", "")
                RoomService.update_room_code(db, room_id, code)

                # Broadcast to other users in the room (excluding sender)
                broadcast_message = {
                    "type": "code_update",
                    "code": code,
                    "user_id": message.get("user_id")
                }
                await manager.broadcast_to_room(broadcast_message, room_id, exclude_websocket=websocket)

            elif message_type == "cursor_position":
                # Broadcast cursor position to other users
                cursor_message = {
                    "type": "cursor_position",
                    "user_id": message.get("user_id"),
                    "position": message.get("position"),
                    "line": message.get("line"),
                    "column": message.get("column")
                }
                await manager.broadcast_to_room(cursor_message, room_id, exclude_websocket=websocket)

            elif message_type == "ping":
                # Respond to ping with pong
                pong_message = {"type": "pong"}
                await manager.send_personal_message(json.dumps(pong_message), websocket)

    except WebSocketDisconnect:
        logger.info(f"Client disconnected from room {room_id}")
    except Exception as e:
        logger.error(f"Error in WebSocket connection: {e}")
    finally:
        # Clean up connection
        manager.disconnect(websocket, room_id)

        # Notify other users about disconnection
        user_left_message = {
            "type": "user_left",
            "active_users": manager.get_room_connection_count(room_id)
        }
        await manager.broadcast_to_room(user_left_message, room_id)

        # Close database session
        db.close()
