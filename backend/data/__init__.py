"""Data access layer package."""

try:
    from backend.data.customer.repository import CustomerRepository
    from backend.data.employee.repository import EmployeeRepository
    from backend.data.order.repository import OrderRepository
    from backend.data.product.repository import ProductRepository
except ModuleNotFoundError:  # pragma: no cover - allows running from backend/ directly
    from .customer.repository import CustomerRepository
    from .employee.repository import EmployeeRepository
    from .order.repository import OrderRepository
    from .product.repository import ProductRepository

from .customer.model import Customer, CustomerRow
from .database import Database, SessionLocal, database, get_db, get_db_session, initialize_database
from .employee.model import Employee, EmployeeRow
from .order.model import Order, OrderRow
from .product.model import Product, ProductRow

__all__ = [
    "Customer",
    "CustomerRepository",
    "CustomerRow",
    "Database",
    "Employee",
    "EmployeeRepository",
    "EmployeeRow",
    "Order",
    "OrderRepository",
    "OrderRow",
    "Product",
    "ProductRepository",
    "ProductRow",
    "SessionLocal",
    "database",
    "get_db",
    "get_db_session",
    "initialize_database",
]
