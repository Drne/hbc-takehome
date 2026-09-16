from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.data.order.model import Order
from backend.data.database import SessionLocal
from .types import OrderCreatePayload, OrderUpdatePayload


class OrderRepository:
    def __init__(self, session: Session | None = None) -> None:
        self.session = session or SessionLocal()

    def list(self) -> list[Order]:
        return list(self.session.execute(select(Order).order_by(Order.OrderID)).scalars().all())

    def get_by_id(self, order_id: int) -> Order | None:
        return self.session.get(Order, order_id)

    def create(self, payload: OrderCreatePayload) -> list[int]:
        record = Order(**payload)
        self.session.add(record)
        self.session.commit()
        self.session.refresh(record)
        return [record.OrderID]

    def update(self, order_id: int, payload: OrderUpdatePayload) -> int:
        record = self.get_by_id(order_id)
        if record is None:
            return 0
        for key, value in payload.items():
            if value is not None and hasattr(record, key):
                setattr(record, key, value)
        self.session.commit()
        return 1

    def remove(self, order_id: int) -> int:
        record = self.get_by_id(order_id)
        if record is None:
            return 0
        self.session.delete(record)
        self.session.commit()
        return 1
