from __future__ import annotations

from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field


class ProductBase(BaseModel):
    Name: str = Field(..., min_length=1, max_length=255)
    Price: Decimal = Field(..., ge=0)


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    Name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    Price: Optional[Decimal] = Field(default=None, ge=0)


class Product(ProductBase):
    ProductID: int


ProductCreatePayload = ProductCreate
ProductUpdatePayload = ProductUpdate
