# vehicle_repo.py - Handles all database queries related to vehicles.
# Pure database operations only — no business logic lives here.

from sqlalchemy.orm import Session
from typing import Optional
from app.models.vehicle import Vehicle


def get_vehicle_by_id(db: Session, vehicle_id: int):
    """Fetch a single vehicle by its ID. Returns None if not found."""
    return db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()


def get_all_vehicles(db: Session):
    """Fetch every vehicle in the inventory, ordered by creation date (newest first)."""
    return db.query(Vehicle).order_by(Vehicle.created_at.desc()).all()


def search_vehicles(
    db: Session,
    make: Optional[str] = None,
    model: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
):
    """
    Search vehicles with optional filters.
    All filters are optional — if none are provided, this returns all vehicles.
    Text searches use LIKE for case-insensitive partial matching.
    """
    query = db.query(Vehicle)

    if make:
        query = query.filter(Vehicle.make.ilike(f"%{make}%"))
    if model:
        query = query.filter(Vehicle.model.ilike(f"%{model}%"))
    if category:
        query = query.filter(Vehicle.category.ilike(f"%{category}%"))
    if min_price is not None:
        query = query.filter(Vehicle.price >= min_price)
    if max_price is not None:
        query = query.filter(Vehicle.price <= max_price)

    return query.order_by(Vehicle.created_at.desc()).all()


def create_vehicle(db: Session, make: str, model: str, category: str, price: float, quantity: int):
    """Insert a new vehicle record into the database."""
    vehicle = Vehicle(make=make, model=model, category=category, price=price, quantity=quantity)
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle


def update_vehicle(db: Session, vehicle_id: int, updates: dict):
    """
    Update a vehicle's fields using a dictionary of changes.
    Only the fields included in the updates dict will be modified.
    Returns the updated vehicle, or None if it was not found.
    """
    vehicle = get_vehicle_by_id(db, vehicle_id)
    if not vehicle:
        return None

    # Apply each field update dynamically
    for field, value in updates.items():
        if value is not None:
            setattr(vehicle, field, value)

    db.commit()
    db.refresh(vehicle)
    return vehicle


def delete_vehicle(db: Session, vehicle_id: int) -> bool:
    """
    Delete a vehicle by ID.
    Returns True if deleted, False if the vehicle was not found.
    """
    vehicle = get_vehicle_by_id(db, vehicle_id)
    if not vehicle:
        return False

    db.delete(vehicle)
    db.commit()
    return True


def decrease_quantity(db: Session, vehicle_id: int) -> Optional[Vehicle]:
    """
    Decrease vehicle quantity by 1 (for purchase operations).
    Returns None if vehicle not found, raises ValueError if already out of stock.
    """
    vehicle = get_vehicle_by_id(db, vehicle_id)
    if not vehicle:
        return None

    if vehicle.quantity <= 0:
        raise ValueError("This vehicle is out of stock.")

    vehicle.quantity -= 1
    db.commit()
    db.refresh(vehicle)
    return vehicle


def increase_quantity(db: Session, vehicle_id: int, amount: int) -> Optional[Vehicle]:
    """
    Increase vehicle quantity by a given amount (for restock operations).
    Returns None if vehicle not found.
    """
    vehicle = get_vehicle_by_id(db, vehicle_id)
    if not vehicle:
        return None

    vehicle.quantity += amount
    db.commit()
    db.refresh(vehicle)
    return vehicle
