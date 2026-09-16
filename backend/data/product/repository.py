from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.data.product.model import Product
from backend.data.database import SessionLocal
from .types import ProductCreatePayload, ProductUpdatePayload


class ProductRepository:
    def __init__(self, session: Session | None = None) -> None:
        self.session = session or SessionLocal()

    def list(self) -> list[Product]:
        return list(self.session.execute(select(Product).order_by(Product.ProductID)).scalars().all())

    def get_by_id(self, product_id: int) -> Product | None:
        return self.session.get(Product, product_id)

    def create(self, payload: ProductCreatePayload) -> list[int]:
        record = Product(**payload)
        self.session.add(record)
        self.session.commit()
        self.session.refresh(record)
        return [record.ProductID]

    def update(self, product_id: int, payload: ProductUpdatePayload) -> int:
        record = self.get_by_id(product_id)
        if record is None:
            return 0
        for key, value in payload.items():
            if value is not None and hasattr(record, key):
                setattr(record, key, value)
        self.session.commit()
        return 1

    def remove(self, product_id: int) -> int:
        record = self.get_by_id(product_id)
        if record is None:
            return 0
        self.session.delete(record)
        self.session.commit()
        return 1
