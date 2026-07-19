# vehicle_router.py - FastAPI router for vehicle and inventory endpoints.
# All routes here require a valid JWT token.

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Optional, List

from app.database.database import get_db
from app.auth.jwt import decode_access_token
from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleResponse, VehicleRestock
from app.services import vehicle_service

# All routes in this router will be prefixed with /api/vehicles
router = APIRouter(prefix="/api/vehicles", tags=["Vehicles"])

# FastAPI OAuth2 scheme — tells the docs UI how to get a token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


# ─── Dependency helpers ───────────────────────────────────────────────────────

def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Dependency: Decode the JWT from the Authorization header.
    Raises 401 if the token is missing, expired, or invalid.
    """
    token_data = decode_access_token(token)
    if token_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return token_data


def require_admin(current_user=Depends(get_current_user)):
    """
    Dependency: Ensures the logged-in user has the 'admin' role.
    Raises 403 Forbidden if they are a regular customer.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Admin privileges are required for this action."
        )
    return current_user


# ─── Vehicle CRUD Routes ──────────────────────────────────────────────────────

@router.get("", response_model=List[VehicleResponse])
def list_vehicles(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """
    Get all vehicles in the inventory.
    Requires: Any authenticated user (customer or admin).
    """
    return vehicle_service.get_all_vehicles(db)


@router.get("/search", response_model=List[VehicleResponse])
def search_vehicles(
    make: Optional[str] = None,
    model: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Search vehicles by optional filters.
    Requires: Any authenticated user.

    Query params: make, model, category, min_price, max_price
    Example: /api/vehicles/search?category=SUV&max_price=5000000
    """
    return vehicle_service.search_vehicles(db, make, model, category, min_price, max_price)


@router.post("", response_model=VehicleResponse, status_code=201)
def add_vehicle(
    vehicle_data: VehicleCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),  # Only admins can add vehicles
):
    """
    Add a new vehicle to the inventory.
    Requires: Admin role.
    """
    return vehicle_service.add_vehicle(db, vehicle_data)


@router.put("/{vehicle_id}", response_model=VehicleResponse)
def update_vehicle(
    vehicle_id: int,
    vehicle_data: VehicleUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),  # Only admins can edit vehicles
):
    """
    Update an existing vehicle's details.
    Requires: Admin role.
    Only include the fields you want to change.
    """
    return vehicle_service.edit_vehicle(db, vehicle_id, vehicle_data)


@router.delete("/{vehicle_id}")
def delete_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),  # Only admins can delete vehicles
):
    """
    Permanently delete a vehicle from the inventory.
    Requires: Admin role.
    """
    return vehicle_service.remove_vehicle(db, vehicle_id)


# ─── Inventory Routes ─────────────────────────────────────────────────────────

@router.post("/{vehicle_id}/purchase", response_model=VehicleResponse)
def purchase_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),  # Any authenticated user can purchase
):
    """
    Purchase a vehicle — decreases its quantity by 1.
    Requires: Any authenticated user.
    Returns 400 if the vehicle is out of stock.
    """
    return vehicle_service.purchase_vehicle(db, vehicle_id)


@router.post("/{vehicle_id}/restock", response_model=VehicleResponse)
def restock_vehicle(
    vehicle_id: int,
    restock_data: VehicleRestock,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),  # Only admins can restock
):
    """
    Add more stock to a vehicle's inventory.
    Requires: Admin role.
    Body: { "quantity": <number_to_add> }
    """
    return vehicle_service.restock_vehicle(db, vehicle_id, restock_data.quantity)
