import logging
import time
from datetime import datetime, timezone
from typing import Any, Optional

try:
    from backend.transport.websocket import emit_event, sio, socketio_app, socketio_server
except ModuleNotFoundError:  # pragma: no cover - allows direct execution from backend/
    from transport.websocket import emit_event, sio, socketio_app, socketio_server

logger = logging.getLogger(__name__)


@sio.event
async def connect(sid: str, environ: dict[str, Any], auth: Optional[dict[str, Any]] = None) -> None:
    logger.info("socket connected: %s", sid)


@sio.event
async def disconnect(sid: str) -> None:
    logger.info("socket disconnected: %s", sid)


@sio.event
async def message(sid: str, payload: Optional[dict[str, Any]]) -> None:
    message_payload = payload or {}
    safe_payload = {
        "id": message_payload.get("id")
        or f"{int(time.time() * 1000)}-{sid[:8]}-{len(message_payload.get('text', ''))}",
        "employeeName": message_payload.get("employeeName") or "Employee",
        "text": message_payload.get("text") or "",
        "createdAt": message_payload.get("createdAt") or datetime.now(timezone.utc).isoformat(),
    }

    await emit_event("message", safe_payload, skip_sid=sid)
