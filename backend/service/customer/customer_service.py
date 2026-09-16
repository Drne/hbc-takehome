from __future__ import annotations

from typing import Optional, cast

from backend.data.customer.model import Customer as CustomerRecord
from backend.data.customer.repository import CustomerRepository
from backend.data.customer.types import CustomerCreatePayload, CustomerUpdatePayload
from .types import Customer, CustomerCreate, CustomerUpdate


class CustomerService:
    def __init__(self, repository: Optional[CustomerRepository] = None):
        self.repository = repository or CustomerRepository()

    @staticmethod
    def _to_customer(record: CustomerRecord) -> Customer:
        return Customer(
            CustomerID=record.CustomerID,
            FirstName=record.FirstName,
            MiddleInitial=record.MiddleInitial,
            LastName=record.LastName,
        )

    def list_customers(self) -> list[Customer]:
        return [self._to_customer(record) for record in self.repository.list()]

    def get_customer(self, customer_id: int) -> Optional[Customer]:
        record = self.repository.get_by_id(customer_id)
        if record is None:
            return None
        return self._to_customer(record)

    def create_customer(self, payload: CustomerCreate | dict) -> Optional[Customer]:
        if hasattr(payload, "model_dump"):
            data = payload.model_dump(exclude_none=True)
        elif isinstance(payload, dict):
            data = payload
        else:
            data = payload.__dict__
        record_ids = self.repository.create(cast(CustomerCreatePayload, data))
        if not record_ids:
            return None
        return self.get_customer(record_ids[0])

    def update_customer(self, customer_id: int, payload: CustomerUpdate | dict) -> Optional[Customer]:
        if hasattr(payload, "model_dump"):
            data = payload.model_dump(exclude_unset=True, exclude_none=True)
        elif isinstance(payload, dict):
            data = payload
        else:
            data = payload.__dict__
        if not data:
            return self.get_customer(customer_id)
        self.repository.update(customer_id, cast(CustomerUpdatePayload, data))
        return self.get_customer(customer_id)

    def delete_customer(self, customer_id: int) -> bool:
        return bool(self.repository.remove(customer_id))
