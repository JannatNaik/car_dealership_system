from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional


class VehicleBase(BaseModel):
    make: str = Field(..., min_length=1, max_length=100)
    model: str = Field(..., min_length=1, max_length=100)
    category: str = Field(..., min_length=1, max_length=50)
    price: float = Field(..., gt=0)
    quantity: int = Field(..., ge=0)


class VehicleCreate(VehicleBase):
    pass


class VehicleUpdate(BaseModel):
    make: Optional[str] = Field(None, min_length=1, max_length=100)
    model: Optional[str] = Field(None, min_length=1, max_length=100)
    category: Optional[str] = Field(None, min_length=1, max_length=50)
    price: Optional[float] = Field(None, gt=0)
    quantity: Optional[int] = Field(None, ge=0)


class VehicleRestock(BaseModel):
    quantity: int = Field(..., gt=0)


class VehicleResponse(VehicleBase):
    # Use model_config instead of inner class Config (Pydantic v2 style)
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
