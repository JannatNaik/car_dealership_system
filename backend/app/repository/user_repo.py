# user_repo.py - Handles all database queries related to users.
# The repository pattern keeps raw database logic separate from business logic.

from sqlalchemy.orm import Session
from app.models.user import User


def get_user_by_id(db: Session, user_id: int):
    """Fetch a single user by their primary key ID."""
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_username(db: Session, username: str):
    """Fetch a single user by their username. Used during login."""
    return db.query(User).filter(User.username == username).first()


def get_user_by_email(db: Session, email: str):
    """Fetch a single user by their email. Used to check for duplicates during registration."""
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, username: str, email: str, password_hash: str, role: str = "customer"):
    """
    Insert a new user into the database.

    Args:
        db: Active SQLAlchemy database session.
        username: The user's chosen username.
        email: The user's email address.
        password_hash: The bcrypt-hashed password (NEVER store plain text passwords).
        role: Either "customer" or "admin". Defaults to "customer".

    Returns:
        The newly created User ORM object (with its new ID assigned).
    """
    new_user = User(
        username=username,
        email=email,
        password_hash=password_hash,
        role=role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)  # Refresh to get the auto-generated ID from the database
    return new_user
