from fastapi import APIRouter, HTTPException, status

try:
    from backend.service.product.product_service import ProductService
    from backend.service.product.types import Product, ProductCreate, ProductUpdate
except ModuleNotFoundError:  # pragma: no cover - allows direct execution from backend/
    from service.product.product_service import ProductService
    from service.product.types import Product, ProductCreate, ProductUpdate


router = APIRouter(prefix="/products", tags=["products"])
service = ProductService()


@router.get("", response_model=list[Product])
def list_products() -> list[Product]:
    return service.list_products()


@router.post("", response_model=Product, status_code=status.HTTP_201_CREATED)
def create_product(payload: ProductCreate) -> Product:
    product = service.create_product(payload)
    if product is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Product could not be created")
    return product


@router.get("/{product_id}", response_model=Product)
def get_product(product_id: int) -> Product:
    product = service.get_product(product_id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product


@router.put("/{product_id}", response_model=Product)
def update_product(product_id: int, payload: ProductUpdate) -> Product:
    product = service.update_product(product_id, payload)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int) -> None:
    success = service.delete_product(product_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return None
