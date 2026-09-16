from __future__ import annotations

import os
from contextlib import contextmanager
from pathlib import Path
from typing import Generator

from sqlalchemy import event, create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker
from sqlalchemy.pool import StaticPool


def _resolve_database_url() -> str:
    url = os.getenv("DATABASE_URL")
    if url:
        return url

    if os.getenv("DATABASE_IN_MEMORY", "false").lower() == "true":
        return "sqlite:///:memory:"

    db_path = Path(__file__).resolve().parents[1] / "data.db"
    return f"sqlite:///{db_path.as_posix()}"


def is_in_memory_database() -> bool:
    return _resolve_database_url().startswith("sqlite:///:memory:")


class Base(DeclarativeBase):
    pass


database_url = _resolve_database_url()
engine = create_engine(
    database_url,
    future=True,
    connect_args={"check_same_thread": False} if database_url.startswith("sqlite") else {},
    poolclass=StaticPool if is_in_memory_database() else None,
)

if database_url.startswith("sqlite"):
    @event.listens_for(engine, "connect")
    def _set_sqlite_pragma(dbapi_connection, _connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False, expire_on_commit=False)


class Database:
    def __init__(self) -> None:
        self.engine = engine
        self.session_factory = SessionLocal

    def initialize(self) -> None:
        initialize_database()

    def get_connection(self):
        return get_db_session()


database = Database()


def run_alembic_migrations() -> None:
    from alembic import command
    from alembic.config import Config

    config_path = Path(__file__).resolve().parents[1] / "alembic.ini"
    alembic_cfg = Config(str(config_path))
    alembic_cfg.set_main_option("sqlalchemy.url", _resolve_database_url())
    command.upgrade(alembic_cfg, "head")


def initialize_database() -> None:
    from . import Customer, Employee, Order, Product  # noqa: F401

    Base.metadata.create_all(bind=engine)
    _seed_initial_data()


def _seed_initial_data() -> None:
    from decimal import Decimal

    from sqlalchemy import select

    from . import Customer, Employee, Order, Product

    with SessionLocal() as session:
        if session.execute(select(Product)).first() is not None:
            return

        session.add_all(
            [
                Product(ProductID=1, Name="Widget", Price=Decimal("9.99")),
                Product(ProductID=2, Name="Gadget", Price=Decimal("19.99")),
                Product(ProductID=3, Name="Doohickey", Price=Decimal("4.50")),
                Employee(EmployeeID=1, FirstName="Alice", MiddleInitial="J", LastName="Anderson"),
                Employee(EmployeeID=2, FirstName="Bob", MiddleInitial=None, LastName="Brown"),
                Employee(EmployeeID=3, FirstName="Carol", MiddleInitial="M", LastName="Clark"),
                Customer(CustomerID=1, FirstName="Derek", MiddleInitial="A", LastName="Davis"),
                Customer(CustomerID=2, FirstName="Eva", MiddleInitial=None, LastName="Edwards"),
                Customer(CustomerID=3, FirstName="Frank", MiddleInitial="R", LastName="Foster"),
            ]
        )
        session.commit()

        session.add_all(
            [
                Order(OrderID=1, SalesPersonID=1, CustomerID=1, ProductID=1, Quantity=2),
                Order(OrderID=2, SalesPersonID=2, CustomerID=2, ProductID=2, Quantity=1),
                Order(OrderID=3, SalesPersonID=3, CustomerID=3, ProductID=3, Quantity=5),
            ]
        )
        session.commit()


@contextmanager
def get_db() -> Generator[Session, None, None]:
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def get_db_session() -> Session:
    return SessionLocal()


def database() -> SessionLocal:  # pragma: no cover - compatibility helper
    return SessionLocal
