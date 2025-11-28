"""API routes for room management."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.room import RoomCreate, RoomResponse, RoomDetail
from app.services.room_service import RoomService

router = APIRouter(prefix="/rooms", tags=["rooms"])


@router.post("", response_model=RoomResponse, status_code=201)
async def create_room(
    room_data: RoomCreate = RoomCreate(),
    db: Session = Depends(get_db)
):
    """
    Create a new coding room.

    Returns a unique room_id that can be used to join the room.
    """
    room = RoomService.create_room(db, room_data)
    return RoomResponse(room_id=room.id)


@router.get("/{room_id}", response_model=RoomDetail)
async def get_room(room_id: str, db: Session = Depends(get_db)):
    """
    Get details about a specific room.

    Returns room information including current code, language, and active users.
    """
    room = RoomService.get_room(db, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    return RoomDetail(
        id=room.id,
        code=room.code,
        language=room.language,
        created_at=room.created_at,
        active_users=room.active_users
    )
