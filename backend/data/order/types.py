from __future__ import annotations

from typing import TypedDict


class OrderCreatePayload(TypedDict):
    SalesPersonID: int
    CustomerID: int
    ProductID: int
    Quantity: int


class OrderUpdatePayload(TypedDict, total=False):
    SalesPersonID: int
    CustomerID: int
    ProductID: int
    Quantity: int
