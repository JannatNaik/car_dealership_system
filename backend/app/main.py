# main.py - The FastAPI application entry point.
# This file ties together all routers and configures the app.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import engine
from app.models import Base  # Import all models so SQLAlchemy knows about them
from app.routers import auth_router, vehicle_router

# ─── Create Database Tables ───────────────────────────────────────────────────
# This will create the SQLite database file and all tables on startup if they
# don't already exist. In production, you'd use Alembic migrations instead.
Base.metadata.create_all(bind=engine)

# ─── Initialize FastAPI App ───────────────────────────────────────────────────
app = FastAPI(
    title="Car Dealership Inventory API",
    description="A RESTful API for managing a car dealership's vehicle inventory, user accounts, and purchase operations.",
    version="1.0.0",
)

# ─── CORS Middleware ──────────────────────────────────────────────────────────
# Allow the React frontend (running on localhost:5173 by default) to talk to our API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Register Routers ─────────────────────────────────────────────────────────
app.include_router(auth_router.router)
app.include_router(vehicle_router.router)


# ─── Root Health Check ────────────────────────────────────────────────────────
@app.get("/")
def root():
    """Simple health-check endpoint to verify the API is running."""
    return {"message": "Car Dealership API is up and running!", "docs": "/docs"}
