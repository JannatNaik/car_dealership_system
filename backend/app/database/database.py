from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./dealership.db"

# Create the SQLite engine.
# connect_args={"check_same_thread": False} is required only for SQLite —
# it allows the same connection to be used across threads (needed for FastAPI).
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Session factory — autocommit=False means we control when to commit/rollback.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all SQLAlchemy ORM models (using modern SQLAlchemy 2.0 style)
Base = declarative_base()


def get_db():
    """
    FastAPI dependency that yields a database session.
    The session is always closed after the request finishes — even on errors.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
