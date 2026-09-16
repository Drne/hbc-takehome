import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    from backend.data.database import initialize_database, is_in_memory_database, run_alembic_migrations
    from backend.transport.customer_routes import router as customer_router
    from backend.transport.employee_routes import router as employee_router
    from backend.transport.message_router import sio, socketio_app
    from backend.transport.order_routes import router as order_router
    from backend.transport.product_routes import router as product_router
except ModuleNotFoundError:  # pragma: no cover - allows direct execution from backend/
    from data.database import initialize_database, is_in_memory_database, run_alembic_migrations
    from transport.customer_routes import router as customer_router
    from transport.employee_routes import router as employee_router
    from transport.message_router import sio, socketio_app
    from transport.order_routes import router as order_router
    from transport.product_routes import router as product_router


def create_app() -> FastAPI:
    app = FastAPI(title="Basic FastAPI service", version="1.0.0")

    @app.on_event("startup")
    def startup() -> None:
        if is_in_memory_database():
            run_alembic_migrations()
        initialize_database()

    # CORS - allow local frontend dev servers (Vite/CRA) to access the API
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(customer_router)
    app.include_router(employee_router)
    app.include_router(order_router)
    app.include_router(product_router)

    @app.get("/health", tags=["health"])
    def health_check() -> dict[str, str]:
        return {"status": "ok"}

    return app


fastapi_app = create_app()
app = socketio.ASGIApp(sio, fastapi_app, socketio_path="socket.io")
