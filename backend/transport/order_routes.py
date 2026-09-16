from fastapi import APIRouter, HTTPException, status

try:
    from backend.service.order.order_service import OrderService
    from backend.service.order.types import Order, OrderCreate, OrderUpdate
    from backend.transport.websocket import publish_update_event
except ModuleNotFoundError:  # pragma: no cover - allows direct execution from backend/
    from service.order.order_service import OrderService
    from service.order.types import Order, OrderCreate, OrderUpdate
    from transport.websocket import publish_update_event


router = APIRouter(prefix="/orders", tags=["orders"])
service = OrderService()


@router.get("", response_model=list[Order])
def list_orders() -> list[Order]:
    return service.list_orders()


@router.post("", response_model=Order, status_code=status.HTTP_201_CREATED)
async def create_order(payload: OrderCreate) -> Order:
    order = service.create_order(payload)
    if order is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Order could not be created")
    await publish_update_event("order", "create", order.OrderID, order.model_dump())
    return order


@router.get("/{order_id}", response_model=Order)
def get_order(order_id: int) -> Order:
    order = service.get_order(order_id)
    if order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order


@router.put("/{order_id}", response_model=Order)
async def update_order(order_id: int, payload: OrderUpdate) -> Order:
    order = service.update_order(order_id, payload)
    if order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    await publish_update_event("order", "update", order.OrderID, order.model_dump())
    return order


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_order(order_id: int) -> None:
    success = service.delete_order(order_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    await publish_update_event("order", "delete", order_id)
    return None
