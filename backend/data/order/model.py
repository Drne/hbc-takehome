from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base

if TYPE_CHECKING:
    from ..customer.model import Customer
    from ..employee.model import Employee
    from ..product.model import Product


class Order(Base):
    __tablename__ = "orders"

    OrderID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    SalesPersonID: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("employees.EmployeeID", ondelete="CASCADE"),
        nullable=False,
    )
    CustomerID: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("customers.CustomerID", ondelete="CASCADE"),
        nullable=False,
    )
    ProductID: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("products.ProductID", ondelete="CASCADE"),
        nullable=False,
    )
    Quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    employee: Mapped[Employee] = relationship(back_populates="orders", passive_deletes=True)
    customer: Mapped[Customer] = relationship(back_populates="orders", passive_deletes=True)
    product: Mapped[Product] = relationship(back_populates="orders", passive_deletes=True)

OrderRow = Order