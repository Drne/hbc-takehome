# Frontend README

This frontend is a lightweight React + TypeScript sales console for viewing and interacting with employees, customers, orders, products, and live employee messaging.

## Stack

- React 18
- TypeScript
- Vite
- styled-components
- Socket.IO client

## High-level architecture

The app follows a simple feature-oriented structure:

- `src/App.tsx` is the top-level shell and orchestrates the main user flow.
- `src/context/ApiContext.tsx` provides the backend base URL to all data hooks.
- `src/hooks/*.ts` encapsulate API access and local state for each domain.
- `src/components/*.tsx` render UI panels and forms.
- `src/types.ts` centralizes the front-end domain models.

The pattern is intentionally straightforward: each domain (employees, customers, orders, products, chat) has a hook that fetches data from the backend and exposes state plus mutation helpers.

## Architecture notes by layer

### 1. Application shell

`App.tsx` owns high-level UI state such as:

- the selected employee
- the selected customer
- the employee login state

It uses a simple conditional render flow:

- if no employee is selected, show the employee selector
- otherwise show the main sales console layout

The main console is organized into three panels:

- customer sidebar
- order history / sales details
- chat panel

### 2. Data access layer

The app uses custom hooks for each API domain, such as:

- `useEmployees()`
- `useCustomers()`
- `useOrders()`
- `useProducts()`
- `useMessages()`

Used for live updates and chat (described below):
- `useSocket()`
- `useUpdateEvent()`
- `useMessages()`

Each hook typically does three things:

- stores state locally (`useState`)
- fetches data on mount (`useEffect`)
- exposes helper functions for create/update/delete actions

This avoids placing fetch logic directly inside components and keeps data behavior near the feature it supports.

Example pattern:

- fetch data from `${apiUrl}/employees`
- normalize backend fields to front-end-friendly names
- update local state after successful mutations

The hooks intentionally skip a heavy client state library; they rely on React local state and callback-driven updates.

### 3. Real-time communication

The `useSocket()` hook manages the single socket connection with the backend and supplies the socket instance to other hooks.

The `useMessages()` and `useUpdateEvent()` hooks use that socket instance and add message event callbacks to handle
 sending/receiving chat messages and handling order/customer update events.

### Out of Scope

The following was considered out of scope for the sake of this exercise.

- No centralized state management: the size of this application makes heavy state management libraries overkill
- No query caching or invalidation: data refreshes are manual and simple, not optimized for large-scale client apps.
- No auth and authorization model: there is no session or JWT flow, RBAC, or route protection.
- Limited testing strategy: there are no unit/component/integration tests in the frontend layer.
- No observability or error reporting: no telemetry, logging pipeline, or monitoring hooks.
- Layout for very small screens

## Running locally

From the repository root:

```bash
npm run dev
```

or directly in this folder:

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

The frontend expects the backend to be running, typically on `http://localhost:8001`.
