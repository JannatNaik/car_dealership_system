# auth_router.py - FastAPI router for authentication endpoints.
# All routes here are public (no login required).

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.user import UserCreate, UserResponse, Token, UserLogin
from app.services import user_service

# All routes in this router will be prefixed with /api/auth
router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=201)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user account.
    
    - Validates that username and email are unique.
    - Hashes the password before storing.
    - Returns the created user profile (without password).
    """
    new_user = user_service.register_user(db, user_data)
    return new_user


@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate a user and receive a JWT token.

    - Use the returned `access_token` in subsequent requests.
    - Set the Authorization header to: `Bearer <access_token>`.
    """
    result = user_service.login_user(db, credentials.username, credentials.password)
    return result
