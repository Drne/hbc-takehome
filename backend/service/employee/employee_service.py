from __future__ import annotations

from typing import Optional, cast

from backend.data.employee.model import Employee as EmployeeRecord
from backend.data.employee.repository import EmployeeRepository
from backend.data.employee.types import EmployeeCreatePayload, EmployeeUpdatePayload
from .types import Employee, EmployeeCreate, EmployeeUpdate


class EmployeeService:
    def __init__(self, repository: Optional[EmployeeRepository] = None):
        self.repository = repository or EmployeeRepository()

    @staticmethod
    def _to_employee(record: EmployeeRecord) -> Employee:
        return Employee(
            EmployeeID=record.EmployeeID,
            FirstName=record.FirstName,
            MiddleInitial=record.MiddleInitial,
            LastName=record.LastName,
        )

    def list_employees(self) -> list[Employee]:
        return [self._to_employee(record) for record in self.repository.list()]

    def get_employee(self, employee_id: int) -> Optional[Employee]:
        record = self.repository.get_by_id(employee_id)
        if record is None:
            return None
        return self._to_employee(record)

    def create_employee(self, payload: EmployeeCreate | dict) -> Optional[Employee]:
        if hasattr(payload, "model_dump"):
            data = payload.model_dump(exclude_none=True)
        elif isinstance(payload, dict):
            data = payload
        else:
            data = payload.__dict__
        record_ids = self.repository.create(cast(EmployeeCreatePayload, data))
        if not record_ids:
            return None
        return self.get_employee(record_ids[0])

    def update_employee(self, employee_id: int, payload: EmployeeUpdate | dict) -> Optional[Employee]:
        if hasattr(payload, "model_dump"):
            data = payload.model_dump(exclude_unset=True, exclude_none=True)
        elif isinstance(payload, dict):
            data = payload
        else:
            data = payload.__dict__
        if not data:
            return self.get_employee(employee_id)
        self.repository.update(employee_id, cast(EmployeeUpdatePayload, data))
        return self.get_employee(employee_id)

    def delete_employee(self, employee_id: int) -> bool:
        return bool(self.repository.remove(employee_id))
