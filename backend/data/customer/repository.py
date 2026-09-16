from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.data.customer.model import Customer
from backend.data.database import SessionLocal
from .types import CustomerCreatePayload, CustomerUpdatePayload


class CustomerRepository:
    def __init__(self, session: Session | None = None) -> None:
        self.session = session or SessionLocal()

    def list(self) -> list[Customer]:
        return list(self.session.execute(select(Customer).order_by(Customer.CustomerID)).scalars().all())

    def get_by_id(self, customer_id: int) -> Customer | None:
        return self.session.get(Customer, customer_id)

    def create(self, payload: CustomerCreatePayload) -> list[int]:
        record = Customer(**payload)
        self.session.add(record)
        self.session.commit()
        self.session.refresh(record)
        return [record.CustomerID]

    def update(self, customer_id: int, payload: CustomerUpdatePayload) -> int:
        record = self.get_by_id(customer_id)
        if record is None:
            return 0
        for key, value in payload.items():
            if value is not None and hasattr(record, key):
                setattr(record, key, value)
        self.session.commit()
        return 1

    def remove(self, customer_id: int) -> int:
        record = self.get_by_id(customer_id)
        if record is None:
            return 0

        for order in list(record.orders):
            self.session.delete(order)

        self.session.delete(record)
        self.session.commit()
        return 1
