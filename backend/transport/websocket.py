import socketio
from typing import Any, Optional

socketio_server = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
)

sio = socketio_server
socketio_app = socketio.ASGIApp(socketio_server, socketio_path="socket.io")


async def publish_update_event(
    entity: str,
    action: str,
    resource_id: Optional[int] = None,
    payload: Optional[dict[str, Any]] = None,
) -> None:
    event_payload: dict[str, Any] = {"entity": entity, "action": action}
    if resource_id is not None:
        event_payload["id"] = resource_id
    if payload is not None:
        event_payload["data"] = payload
    await socketio_server.emit("update", event_payload)


async def emit_event(event_name: str, payload: Optional[dict[str, Any]] = None, *, skip_sid: Optional[str] = None) -> None:
    await socketio_server.emit(event_name, payload or {}, skip_sid=skip_sid)
