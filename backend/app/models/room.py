"""Database models for rooms."""
from sqlalchemy import Column, String, Text, DateTime, Integer
from sqlalchemy.sql import func
from app.database.connection import Base
import uuid


class Room(Base):
    """Room model for storing collaborative coding sessions."""

    __tablename__ = "rooms"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(Text, default="# Start coding here...\n")
    language = Column(String, default="python")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    active_users = Column(Integer, default=0)

    def __repr__(self):
        return f"<Room(id={self.id}, language={self.language})>"
