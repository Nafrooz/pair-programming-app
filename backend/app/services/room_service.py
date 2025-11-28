"""Service layer for room management."""
from sqlalchemy.orm import Session
from app.models.room import Room
from app.schemas.room import RoomCreate
from typing import Optional
import uuid


class RoomService:
    """Service for managing coding rooms."""

    @staticmethod
    def create_room(db: Session, room_data: RoomCreate) -> Room:
        """Create a new coding room."""
        room = Room(
            id=str(uuid.uuid4()),
            language=room_data.language,
            code=f"# Start coding in {room_data.language}...\n"
        )
        db.add(room)
        db.commit()
        db.refresh(room)
        return room

    @staticmethod
    def get_room(db: Session, room_id: str) -> Optional[Room]:
        """Get a room by ID."""
        return db.query(Room).filter(Room.id == room_id).first()

    @staticmethod
    def update_room_code(db: Session, room_id: str, code: str) -> Optional[Room]:
        """Update the code in a room."""
        room = db.query(Room).filter(Room.id == room_id).first()
        if room:
            room.code = code
            db.commit()
            db.refresh(room)
        return room

    @staticmethod
    def increment_active_users(db: Session, room_id: str) -> Optional[Room]:
        """Increment the active users count for a room."""
        room = db.query(Room).filter(Room.id == room_id).first()
        if room:
            room.active_users += 1
            db.commit()
            db.refresh(room)
        return room

    @staticmethod
    def decrement_active_users(db: Session, room_id: str) -> Optional[Room]:
        """Decrement the active users count for a room."""
        room = db.query(Room).filter(Room.id == room_id).first()
        if room and room.active_users > 0:
            room.active_users -= 1
            db.commit()
            db.refresh(room)
        return room
