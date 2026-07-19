# conftest.py - Shared pytest fixtures used across all test files.
# Fixtures here are automatically available to all tests in the tests/ directory.

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Import Base and all models so SQLAlchemy knows about all tables
from app.database.database import Base, get_db
import app.models  # noqa: F401 — this registers all ORM models with Base

from sqlalchemy.pool import StaticPool

# We use an in-memory SQLite database for tests with a StaticPool.
# This avoids creating temporary database files on disk and prevents
# leftover state/locks from polluting subsequent test runs.
test_engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def override_get_db():
    """
    Replacement for the real get_db() dependency.
    Uses the test database instead of the production one.
    """
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function", autouse=True)
def setup_database():
    """
    Create all tables before each test and drop them after.
    This ensures every test starts with a fresh, empty state —
    no leftover data from previous tests can cause side effects.
    """
    # Create all tables fresh
    Base.metadata.create_all(bind=test_engine)

    # Import app HERE (after tables are created) and override the DB dependency
    from app.main import app
    app.dependency_overrides[get_db] = override_get_db

    yield

    # Tear down — drop all tables so next test gets a clean slate
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def client(setup_database):
    """
    Provide a FastAPI TestClient for making HTTP requests in tests.
    This simulates real HTTP calls without needing a running server.
    Depends on setup_database to ensure the test DB is ready.
    """
    from app.main import app
    return TestClient(app)


@pytest.fixture
def admin_token(client):
    """
    Register an admin user and return their JWT token.
    Use this fixture in tests that require admin privileges.
    """
    client.post("/api/auth/register", json={
        "username": "admin_user",
        "email": "admin@test.com",
        "password": "adminpass123",
        "role": "admin"
    })
    response = client.post("/api/auth/login", json={
        "username": "admin_user",
        "password": "adminpass123"
    })
    return response.json()["access_token"]


@pytest.fixture
def customer_token(client):
    """
    Register a regular customer and return their JWT token.
    Use this fixture in tests that verify customer-level access.
    """
    client.post("/api/auth/register", json={
        "username": "customer_user",
        "email": "customer@test.com",
        "password": "customerpass123",
        "role": "customer"
    })
    response = client.post("/api/auth/login", json={
        "username": "customer_user",
        "password": "customerpass123"
    })
    return response.json()["access_token"]


@pytest.fixture
def sample_vehicle(client, admin_token):
    """
    Create a sample vehicle in the database and return its data.
    Use this fixture in tests that need an existing vehicle to work with.
    """
    response = client.post(
        "/api/vehicles",
        json={
            "make": "Toyota",
            "model": "Fortuner",
            "category": "SUV",
            "price": 4200000.00,
            "quantity": 10
        },
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    return response.json()
