from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.data.employee.model import Employee
from backend.data.database import SessionLocal
from .types import EmployeeCreatePayload, EmployeeUpdatePayload


class EmployeeRepository:
    def __init__(self, session: Session | None = None) -> None:
        self.session = session or SessionLocal()

    def list(self) -> list[Employee]:
        return list(self.session.execute(select(Employee).order_by(Employee.EmployeeID)).scalars().all())

    def get_by_id(self, employee_id: int) -> Employee | None:
        return self.session.get(Employee, employee_id)

    def create(self, payload: EmployeeCreatePayload) -> list[int]:
        record = Employee(**payload)
        self.session.add(record)
        self.session.commit()
        self.session.refresh(record)
        return [record.EmployeeID]

    def update(self, employee_id: int, payload: EmployeeUpdatePayload) -> int:
        record = self.get_by_id(employee_id)
        if record is None:
            return 0
        for key, value in payload.items():
            if value is not None and hasattr(record, key):
                setattr(record, key, value)
        self.session.commit()
        return 1

    def remove(self, employee_id: int) -> int:
        record = self.get_by_id(employee_id)
        if record is None:
            return 0
        self.session.delete(record)
        self.session.commit()
        return 1
