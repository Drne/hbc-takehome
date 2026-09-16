# Project Description

Create a multi-Customer React app that can do CRUD operations on Customers and
Orders.
This application is primarily used by Employees to place orders for Customers.

- A Home component that displays a list of all the Customers.
- A CreateCustomer Action that allows employee to create new Customers.
- An EditCustomer Action that allows employee to edit existing Customers.
- A DeleteCustomer Action that allows employee to delete existing Customers.

- When you select customer, Application should display all the history of previous
  orders and be able to add orders.
- When placing an order, Product name should be a drop down that employee can
  select.
- Create a WebSocket server that allows Employee to subscribe to and publish
  messages.
- When Employee publishes a message, the WebSocket server should broadcast
  the message to all the other Employee web sessions.
- UI should subscribe to get updates via web socket server.
- No need to build User Interface to manage Product and Employee tables.
- Follow industry standard design patterns and make sure to have a clean logical
  project structure to segregate responsibilities.

## Technology

- UI: React JavaScript or WPF
- Server: Python/FastAPI
