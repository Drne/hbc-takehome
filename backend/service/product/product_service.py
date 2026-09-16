from __future__ import annotations

from typing import Optional, cast

from backend.data.product.model import Product as ProductRecord
from backend.data.product.repository import ProductRepository
from backend.data.product.types import ProductCreatePayload, ProductUpdatePayload
from .types import Product, ProductCreate, ProductUpdate


class ProductService:
    def __init__(self, repository: Optional[ProductRepository] = None):
        self.repository = repository or ProductRepository()

    @staticmethod
    def _to_product(record: ProductRecord) -> Product:
        return Product(
            ProductID=record.ProductID,
            Name=record.Name,
            Price=record.Price,
        )

    def list_products(self) -> list[Product]:
        return [self._to_product(record) for record in self.repository.list()]

    def get_product(self, product_id: int) -> Optional[Product]:
        record = self.repository.get_by_id(product_id)
        if record is None:
            return None
        return self._to_product(record)

    def create_product(self, payload: ProductCreate | dict) -> Optional[Product]:
        if hasattr(payload, "model_dump"):
            data = payload.model_dump(exclude_none=True)
        elif isinstance(payload, dict):
            data = payload
        else:
            data = payload.__dict__
        record_ids = self.repository.create(cast(ProductCreatePayload, data))
        if not record_ids:
            return None
        return self.get_product(record_ids[0])

    def update_product(self, product_id: int, payload: ProductUpdate | dict) -> Optional[Product]:
        if hasattr(payload, "model_dump"):
            data = payload.model_dump(exclude_unset=True, exclude_none=True)
        elif isinstance(payload, dict):
            data = payload
        else:
            data = payload.__dict__
        if not data:
            return self.get_product(product_id)
        self.repository.update(product_id, cast(ProductUpdatePayload, data))
        return self.get_product(product_id)

    def delete_product(self, product_id: int) -> bool:
        return bool(self.repository.remove(product_id))
