from __future__ import annotations

from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import DECIMAL, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base

if TYPE_CHECKING:
    from ..order.model import Order


class Product(Base):
    __tablename__ = "products"

    ProductID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    Name: Mapped[str] = mapped_column(String(255), nullable=False)
    Price: Mapped[Decimal] = mapped_column(DECIMAL(10, 2), nullable=False)

    orders: Mapped[list["Order"]] = relationship(
        back_populates="product",
        cascade="all, delete, delete-orphan",
        passive_deletes=True,
    )

ProductRow = Product