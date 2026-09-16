from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


class CustomerBase(BaseModel):
    FirstName: str = Field(..., min_length=1, max_length=255)
    MiddleInitial: Optional[str] = Field(default=None, min_length=1, max_length=1)
    LastName: str = Field(..., min_length=1, max_length=255)


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(BaseModel):
    FirstName: Optional[str] = Field(default=None, min_length=1, max_length=255)
    MiddleInitial: Optional[str] = Field(default=None, min_length=1, max_length=1)
    LastName: Optional[str] = Field(default=None, min_length=1, max_length=255)


class Customer(CustomerBase):
    CustomerID: int


CustomerCreatePayload = CustomerCreate
CustomerUpdatePayload = CustomerUpdate
