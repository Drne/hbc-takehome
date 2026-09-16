from fastapi import APIRouter, HTTPException, status

try:
    from backend.service.customer.customer_service import CustomerService
    from backend.service.customer.types import Customer, CustomerCreate, CustomerUpdate
    from backend.transport.websocket import publish_update_event
except ModuleNotFoundError:  # pragma: no cover - allows direct execution from backend/
    from service.customer.customer_service import CustomerService
    from service.customer.types import Customer, CustomerCreate, CustomerUpdate
    from transport.websocket import publish_update_event


router = APIRouter(prefix="/customers", tags=["customers"])
service = CustomerService()


@router.get("", response_model=list[Customer])
def list_customers() -> list[Customer]:
    return service.list_customers()


@router.post("", response_model=Customer, status_code=status.HTTP_201_CREATED)
async def create_customer(payload: CustomerCreate) -> Customer:
    customer = service.create_customer(payload)
    if customer is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Customer could not be created")
    await publish_update_event("customer", "create", customer.CustomerID, customer.model_dump())
    return customer


@router.get("/{customer_id}", response_model=Customer)
def get_customer(customer_id: int) -> Customer:
    customer = service.get_customer(customer_id)
    if customer is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    return customer


@router.put("/{customer_id}", response_model=Customer)
async def update_customer(customer_id: int, payload: CustomerUpdate) -> Customer:
    customer = service.update_customer(customer_id, payload)
    if customer is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    await publish_update_event("customer", "update", customer.CustomerID, customer.model_dump())
    return customer


@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_customer(customer_id: int) -> None:
    success = service.delete_customer(customer_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    await publish_update_event("customer", "delete", customer_id)
    return None
