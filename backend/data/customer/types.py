from __future__ import annotations

from typing import TypedDict


class CustomerCreatePayload(TypedDict):
    FirstName: str
    MiddleInitial: str | None
    LastName: str


class CustomerUpdatePayload(TypedDict, total=False):
    FirstName: str
    MiddleInitial: str | None
    LastName: str
