from fastapi import APIRouter, HTTPException, status

try:
    from backend.service.employee.employee_service import EmployeeService
    from backend.service.employee.types import Employee, EmployeeCreate, EmployeeUpdate
except ModuleNotFoundError:  # pragma: no cover - allows direct execution from backend/
    from service.employee.employee_service import EmployeeService
    from service.employee.types import Employee, EmployeeCreate, EmployeeUpdate


router = APIRouter(prefix="/employees", tags=["employees"])
service = EmployeeService()


@router.get("", response_model=list[Employee])
def list_employees() -> list[Employee]:
    return service.list_employees()


@router.post("", response_model=Employee, status_code=status.HTTP_201_CREATED)
def create_employee(payload: EmployeeCreate) -> Employee:
    employee = service.create_employee(payload)
    if employee is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employee could not be created")
    return employee


@router.get("/{employee_id}", response_model=Employee)
def get_employee(employee_id: int) -> Employee:
    employee = service.get_employee(employee_id)
    if employee is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    return employee


@router.put("/{employee_id}", response_model=Employee)
def update_employee(employee_id: int, payload: EmployeeUpdate) -> Employee:
    employee = service.update_employee(employee_id, payload)
    if employee is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    return employee


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: int) -> None:
    success = service.delete_employee(employee_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    return None
