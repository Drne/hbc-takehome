# HBC Takehome

This project contains a FastAPI backend and a React + Vite frontend. The quickest way to get both running locally is to install the dependencies and start the root dev script.

## Prerequisites

- Node.js 18+
- npm
- Python 3.10+
- A terminal with bash/zsh

## One-time setup

From the repository root:

```bash
# install Node dependencies
npm install

# install frontend dependencies
cd frontend
npm install
cd ..

# create and activate a virtual environment for Python deps
python3 -m venv .venv
source .venv/bin/activate

# install backend dependencies (PIP MUST BE AVAILABLE IN PATH VAR)
python -m pip install --upgrade pip
pip install -r backend/requirements.txt
```

If you prefer, the repo also defines a convenience script:

```bash
npm run install:all
```

This installs the root Node deps, frontend deps, and backend Python requirements. If you use a virtual environment, run the backend installs inside that environment instead of the system Python.

## Start the app

### Run both services together

From the repo root:

```bash
npm run dev
```

This starts the stack with:

- Backend: http://localhost:8001
- Frontend: http://localhost:5173
- API docs: http://localhost:8001/docs

The root script uses `concurrently` to launch the backend and frontend together.

### Run the backend only

```bash
source .venv/bin/activate
cd backend
PORT=8001 python3 main.py
```

The backend serves the API from the port specified by `PORT` (default is `8001` when invoked from the root script).

### Run the frontend only

```bash
cd frontend
npm run dev -- --host 0.0.0.0 --port 5173
```

### Alternative helper script

There is also a shell wrapper that starts both processes together:

```bash
./run-dev.sh
```

This script defaults to:

- backend: http://localhost:8000
- frontend: http://localhost:5173

You can override the ports as needed:

```bash
BACKEND_PORT=8001 FRONTEND_PORT=5173 ./run-dev.sh
```

## Typical local workflow

1. Open a terminal in the repo root.
2. Activate your Python environment if you created one:
   ```bash
   source .venv/bin/activate
   ```
3. Start the app:
   ```bash
   npm run dev
   ```
4. Open the frontend in your browser at http://localhost:5173.
5. If you need the backend API directly, use http://localhost:8001 or the OpenAPI docs at http://localhost:8001/docs.