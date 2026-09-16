from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


class OrderBase(BaseModel):
    SalesPersonID: int
    CustomerID: int
    ProductID: int
    Quantity: int = Field(..., ge=1)


class OrderCreate(OrderBase):
    pass


class OrderUpdate(BaseModel):
    SalesPersonID: Optional[int] = None
    CustomerID: Optional[int] = None
    ProductID: Optional[int] = None
    Quantity: Optional[int] = Field(default=None, ge=1)


class Order(OrderBase):
    OrderID: int


OrderCreatePayload = OrderCreate
OrderUpdatePayload = OrderUpdate
