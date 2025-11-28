"""API routes for autocomplete functionality."""
from fastapi import APIRouter
from app.schemas.room import AutocompleteRequest, AutocompleteResponse
from app.services.autocomplete_service import AutocompleteService

router = APIRouter(prefix="/autocomplete", tags=["autocomplete"])


@router.post("", response_model=AutocompleteResponse)
async def get_autocomplete(request: AutocompleteRequest):
    """
    Get an AI-style autocomplete suggestion (mocked).

    Accepts:
    - code: Current code content
    - cursor_position: Position of the cursor in the code
    - language: Programming language (e.g., "python", "javascript")

    Returns a mocked suggestion based on simple pattern matching.
    """
    return AutocompleteService.get_suggestion(request)
