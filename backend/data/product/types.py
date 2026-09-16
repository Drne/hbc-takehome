from __future__ import annotations

from decimal import Decimal
from typing import TypedDict


class ProductCreatePayload(TypedDict):
    Name: str
    Price: Decimal


class ProductUpdatePayload(TypedDict, total=False):
    Name: str
    Price: Decimal
