from __future__ import annotations

from typing import TypedDict


class EmployeeCreatePayload(TypedDict):
    FirstName: str
    MiddleInitial: str | None
    LastName: str


class EmployeeUpdatePayload(TypedDict, total=False):
    FirstName: str
    MiddleInitial: str | None
    LastName: str
