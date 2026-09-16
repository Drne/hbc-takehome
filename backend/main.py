import os

try:
    from backend.app import app
except ModuleNotFoundError:  # pragma: no cover - allows direct execution from backend/
    from app import app

if __name__ == "__main__":
    import uvicorn

    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8001"))
    uvicorn.run(app, host=host, port=port)
