"""Application configuration settings."""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database settings
    database_url: str = "postgresql://user:password@localhost:5432/pairprogramming"

    # Application settings
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    debug: bool = True

    # CORS settings
    allowed_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
    ]

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
