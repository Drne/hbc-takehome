Backend Architecture
====================

Overview
--------
This backend is a small FastAPI-based service with Socket.IO support. It follows a clear 3-layer separation:
- Transport: FastAPI routers and Socket.IO message handlers (HTTP + realtime)
- Service: Business logic and Pydantic request/response models
- Data: SQLAlchemy ORM models and repositories that persist to SQLite (or other DB via DATABASE_URL)

Layer details
-------------
1. Transport
- REST: APIRouter files in transport/ provide CRUD endpoints for Customers, Employees, Orders, and Products.
  - Routes: /customers, /employees, /orders, /products (standard GET/POST/PUT/DELETE patterns).
  - Each route delegates to the corresponding Service class.
- Socket.IO: transport/websocket.py sets up an AsyncServer (asgi) with events:
  - connect, disconnect, message
  - update - update events for orders and customers (products and employee updates out of scope)
  - emits inbound messages to all connected clients (skip sender) using event name "message".
  - Mounted at the ASGI path socket.io (app uses socketio.ASGIApp).

2. Service
- service/* contains per-entity service classes (CustomerService, EmployeeService, OrderService, ProductService).
- Services transform DB records into Pydantic types (service/*/types.py) and orchestrate repository calls.
- Services accept Pydantic models or plain dict inputs and return Pydantic output models used by FastAPI responses.

3. Data
- data/database.py handles DB URL resolution (DATABASE_URL environment variable or local SQLite file). Supports in-memory SQLite via DATABASE_IN_MEMORY=true for tests/dev.
- SQLAlchemy is used (DeclarativeBase). SessionLocal is the factory used across repositories.
- Each entity has model, repository, and typed payload definitions in data/*.
  - Repositories encapsulate direct DB CRUD using a Session; they commit/refresh as needed and return primary IDs or boolean success markers.
- Database initialization seeds sample data on first run. For in-memory DB, alembic migrations are run at startup before initializing.

Migrations and Seeding
---------------------
- Alembic is configured (alembic.ini + alembic/). database.run_alembic_migrations() will apply migrations against resolved DATABASE_URL.
- initialize_database() creates tables via SQLAlchemy metadata.create_all() and inserts seed rows (products, employees, customers, and orders) if database is empty.

Configuration & Running
-----------------------
Environment variables:
- DATABASE_URL - full SQLAlchemy URL to use (overrides defaults).
- DATABASE_IN_MEMORY - set to "true" to use sqlite:///:memory: for ephemeral runs (useful for tests).
- HOST / PORT - (used by main.py) to configure uvicorn host/port.

Typical run (from repository root):
- pip install -r backend/requirements.txt
- uvicorn backend.main:app --host 0.0.0.0 --port 8001

Socket.IO clients should connect to the ASGI path /socket.io and listen/emit event "message".

Out of Scope
------------
- Testing - unit and e2e tests have been omitted for this exercise
- Durable data storage - currently all data storage is in-memory or tied to local db files
- Observability
- Auth
- Production-level CORS - currently using wildcards