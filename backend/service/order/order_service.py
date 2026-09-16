from __future__ import annotations

from typing import Optional, cast

from backend.data.order.model import Order as OrderRecord
from backend.data.order.repository import OrderRepository
from backend.data.order.types import OrderCreatePayload, OrderUpdatePayload
from .types import Order, OrderCreate, OrderUpdate


class OrderService:
    def __init__(self, repository: Optional[OrderRepository] = None):
        self.repository = repository or OrderRepository()

    @staticmethod
    def _to_order(record: OrderRecord) -> Order:
        return Order(
            OrderID=record.OrderID,
            SalesPersonID=record.SalesPersonID,
            CustomerID=record.CustomerID,
            ProductID=record.ProductID,
            Quantity=record.Quantity,
        )

    def list_orders(self) -> list[Order]:
        return [self._to_order(record) for record in self.repository.list()]

    def get_order(self, order_id: int) -> Optional[Order]:
        record = self.repository.get_by_id(order_id)
        if record is None:
            return None
        return self._to_order(record)

    def create_order(self, payload: OrderCreate | dict) -> Optional[Order]:
        if hasattr(payload, "model_dump"):
            data = payload.model_dump(exclude_none=True)
        elif isinstance(payload, dict):
            data = payload
        else:
            data = payload.__dict__
        record_ids = self.repository.create(cast(OrderCreatePayload, data))
        if not record_ids:
            return None
        return self.get_order(record_ids[0])

    def update_order(self, order_id: int, payload: OrderUpdate | dict) -> Optional[Order]:
        if hasattr(payload, "model_dump"):
            data = payload.model_dump(exclude_unset=True, exclude_none=True)
        elif isinstance(payload, dict):
            data = payload
        else:
            data = payload.__dict__
        if not data:
            return self.get_order(order_id)
        self.repository.update(order_id, cast(OrderUpdatePayload, data))
        return self.get_order(order_id)

    def delete_order(self, order_id: int) -> bool:
        return bool(self.repository.remove(order_id))
