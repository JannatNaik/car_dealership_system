# vehicle_service.py - Business logic layer for vehicle CRUD and inventory operations.
# Services handle validation and orchestrate calls to the repository layer.

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional

from app.repository import vehicle_repo
from app.schemas.vehicle import VehicleCreate, VehicleUpdate


def get_all_vehicles(db: Session):
    """Return all vehicles in the inventory."""
    return vehicle_repo.get_all_vehicles(db)


def search_vehicles(
    db: Session,
    make: Optional[str] = None,
    model: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
):
    """
    Search for vehicles using optional filters.
    If no filters are given, all vehicles are returned.
    """
    return vehicle_repo.search_vehicles(
        db=db,
        make=make,
        model=model,
        category=category,
        min_price=min_price,
        max_price=max_price,
    )


def get_vehicle_or_404(db: Session, vehicle_id: int):
    """
    Fetch a vehicle by ID, raising a 404 error if it does not exist.
    Used as a helper in other service functions.
    """
    vehicle = vehicle_repo.get_vehicle_by_id(db, vehicle_id)
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vehicle with ID {vehicle_id} was not found."
        )
    return vehicle


def add_vehicle(db: Session, vehicle_data: VehicleCreate):
    """
    Create a new vehicle entry in the inventory.
    Only admins should call this (enforced at the router level).
    """
    return vehicle_repo.create_vehicle(
        db=db,
        make=vehicle_data.make,
        model=vehicle_data.model,
        category=vehicle_data.category,
        price=vehicle_data.price,
        quantity=vehicle_data.quantity,
    )


def edit_vehicle(db: Session, vehicle_id: int, vehicle_data: VehicleUpdate):
    """
    Update specific fields of an existing vehicle.
    Returns the updated vehicle, raising 404 if not found.
    """
    # First ensure the vehicle exists
    get_vehicle_or_404(db, vehicle_id)

    # Only send non-None fields to the repo so we don't overwrite with nulls
    updates = vehicle_data.model_dump(exclude_none=True)
    return vehicle_repo.update_vehicle(db, vehicle_id, updates)


def remove_vehicle(db: Session, vehicle_id: int):
    """
    Delete a vehicle from the inventory.
    Only admins should call this (enforced at the router level).
    Raises 404 if the vehicle doesn't exist.
    """
    # This will raise 404 automatically if vehicle not found
    get_vehicle_or_404(db, vehicle_id)
    deleted = vehicle_repo.delete_vehicle(db, vehicle_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vehicle with ID {vehicle_id} was not found."
        )
    return {"message": "Vehicle deleted successfully."}


def purchase_vehicle(db: Session, vehicle_id: int):
    """
    Process a vehicle purchase — decrements quantity by 1.
    Raises 404 if vehicle not found, 400 if it's out of stock.
    """
    # Verify the vehicle exists first
    get_vehicle_or_404(db, vehicle_id)

    try:
        updated_vehicle = vehicle_repo.decrease_quantity(db, vehicle_id)
        return updated_vehicle
    except ValueError as e:
        # Repository raises ValueError when quantity is 0
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


def restock_vehicle(db: Session, vehicle_id: int, amount: int):
    """
    Add stock to a vehicle's inventory.
    Only admins should call this (enforced at the router level).
    Raises 404 if vehicle not found.
    """
    get_vehicle_or_404(db, vehicle_id)
    return vehicle_repo.increase_quantity(db, vehicle_id, amount)
