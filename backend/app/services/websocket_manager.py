"""WebSocket connection manager for real-time collaboration."""
from typing import Dict, List
from fastapi import WebSocket
import json
import logging

logger = logging.getLogger(__name__)


class ConnectionManager:
    """Manages WebSocket connections for collaborative coding rooms."""

    def __init__(self):
        # Dictionary mapping room_id to list of active WebSocket connections
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: str):
        """Accept a new WebSocket connection and add it to a room."""
        await websocket.accept()

        if room_id not in self.active_connections:
            self.active_connections[room_id] = []

        self.active_connections[room_id].append(websocket)
        logger.info(f"Client connected to room {room_id}. Total connections: {len(self.active_connections[room_id])}")

    def disconnect(self, websocket: WebSocket, room_id: str):
        """Remove a WebSocket connection from a room."""
        if room_id in self.active_connections:
            if websocket in self.active_connections[room_id]:
                self.active_connections[room_id].remove(websocket)
                logger.info(f"Client disconnected from room {room_id}. Remaining connections: {len(self.active_connections[room_id])}")

            # Clean up empty rooms
            if len(self.active_connections[room_id]) == 0:
                del self.active_connections[room_id]
                logger.info(f"Room {room_id} removed (no active connections)")

    async def send_personal_message(self, message: str, websocket: WebSocket):
        """Send a message to a specific WebSocket connection."""
        await websocket.send_text(message)

    async def broadcast_to_room(self, message: dict, room_id: str, exclude_websocket: WebSocket = None):
        """
        Broadcast a message to all connections in a room.

        Args:
            message: Dictionary to be sent as JSON
            room_id: ID of the room to broadcast to
            exclude_websocket: Optional WebSocket to exclude from broadcast (e.g., the sender)
        """
        if room_id not in self.active_connections:
            return

        # Convert message to JSON string
        message_str = json.dumps(message)

        # List to track connections that need to be removed
        disconnected = []

        for connection in self.active_connections[room_id]:
            # Skip the excluded websocket (typically the sender)
            if exclude_websocket and connection == exclude_websocket:
                continue

            try:
                await connection.send_text(message_str)
            except Exception as e:
                logger.error(f"Error sending message to client: {e}")
                disconnected.append(connection)

        # Clean up disconnected clients
        for connection in disconnected:
            self.disconnect(connection, room_id)

    def get_room_connection_count(self, room_id: str) -> int:
        """Get the number of active connections in a room."""
        if room_id not in self.active_connections:
            return 0
        return len(self.active_connections[room_id])


# Global connection manager instance
manager = ConnectionManager()
