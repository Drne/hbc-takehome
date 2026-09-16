#!/usr/bin/env bash
set -euo pipefail

# Remove if you already have deps installed
npm run install:all

BACKEND_PORT="${BACKEND_PORT:-8001}"
FRONTEND_PORT="${FRONTEND_PORT:-5173}"

cd "$(dirname "$0")"

PORT="$BACKEND_PORT" concurrently \
  --names backend,frontend \
  --prefix-colors blue,green \
  "python3 -m backend.main" \
  "cd frontend && npm run dev -- --host 0.0.0.0 --port ${FRONTEND_PORT}"
