"""Pydantic schemas for room-related requests and responses."""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class RoomCreate(BaseModel):
    """Schema for creating a new room."""
    language: Optional[str] = "python"


class RoomResponse(BaseModel):
    """Schema for room response."""
    room_id: str

    class Config:
        from_attributes = True


class RoomDetail(BaseModel):
    """Schema for detailed room information."""
    id: str
    code: str
    language: str
    created_at: datetime
    active_users: int

    class Config:
        from_attributes = True


class CodeUpdate(BaseModel):
    """Schema for code update messages."""
    room_id: str
    code: str
    user_id: Optional[str] = None


class AutocompleteRequest(BaseModel):
    """Schema for autocomplete requests."""
    code: str
    cursor_position: int
    language: str = "python"


class AutocompleteResponse(BaseModel):
    """Schema for autocomplete responses."""
    suggestion: str
    start_position: int
    end_position: int
