# user_service.py - Business logic layer for user-related operations.
# Services sit between the router (HTTP layer) and the repository (database layer).
# They validate business rules and orchestrate repository calls.

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.repository import user_repo
from app.auth.password import hash_password, verify_password
from app.auth.jwt import create_access_token
from app.schemas.user import UserCreate


def register_user(db: Session, user_data: UserCreate):
    """
    Register a new user account.

    Business rules:
    - Username must be unique.
    - Email must be unique.
    - Passwords are hashed before storage.

    Raises HTTPException 400 if the username or email is already taken.
    """
    # Check if username is already taken
    if user_repo.get_user_by_username(db, user_data.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists. Please choose a different username."
        )

    # Check if email is already registered
    if user_repo.get_user_by_email(db, user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered. Please use a different email."
        )

    # Hash the password before storing it — NEVER store plain-text passwords
    hashed = hash_password(user_data.password)

    # Determine role — default is "customer"; "admin" can be set explicitly
    role = user_data.role if user_data.role in ("admin", "customer") else "customer"

    new_user = user_repo.create_user(
        db=db,
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed,
        role=role
    )
    return new_user


def login_user(db: Session, username: str, password: str):
    """
    Authenticate a user and return a JWT token.

    Business rules:
    - User must exist.
    - Password must match the stored hash.

    Raises HTTPException 401 if credentials are invalid.
    Returns a token payload dict on success.
    """
    # Try to find the user by username
    user = user_repo.get_user_by_username(db, username)

    # Generic error message — don't reveal whether username or password was wrong
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create JWT with user identity embedded in it
    token = create_access_token(data={"sub": user.username, "role": user.role})

    return {"access_token": token, "token_type": "bearer", "user": user}
