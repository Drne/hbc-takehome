from __future__ import annotations

from typing import TYPE_CHECKING, Optional

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base

if TYPE_CHECKING:
    from ..order.model import Order


class Employee(Base):
    __tablename__ = "employees"

    EmployeeID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    FirstName: Mapped[str] = mapped_column(String(255), nullable=False)
    MiddleInitial: Mapped[Optional[str]] = mapped_column(String(1), nullable=True)
    LastName: Mapped[str] = mapped_column(String(255), nullable=False)

    orders: Mapped[list["Order"]] = relationship(
        back_populates="employee",
        cascade="all, delete, delete-orphan",
        passive_deletes=True,
    )

EmployeeRow = Employee