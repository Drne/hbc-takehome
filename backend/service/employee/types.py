from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


class EmployeeBase(BaseModel):
    FirstName: str = Field(..., min_length=1, max_length=255)
    MiddleInitial: Optional[str] = Field(default=None, min_length=1, max_length=1)
    LastName: str = Field(..., min_length=1, max_length=255)


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(BaseModel):
    FirstName: Optional[str] = Field(default=None, min_length=1, max_length=255)
    MiddleInitial: Optional[str] = Field(default=None, min_length=1, max_length=1)
    LastName: Optional[str] = Field(default=None, min_length=1, max_length=255)


class Employee(EmployeeBase):
    EmployeeID: int


EmployeeCreatePayload = EmployeeCreate
EmployeeUpdatePayload = EmployeeUpdate
