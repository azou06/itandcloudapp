# IT and Cloud Service Tracker

This is a minimal Node.js application that allows technicians to create and track service tickets for client equipment.

## Usage

```
npm start
```
Starts the HTTP server on port 3000.

```
npm test
```
Runs the test suite.

## API

- `POST /tickets` – Create a ticket. Body should include `clientName`, `equipment`, and `description`.
- `GET /tickets` – List all tickets.
- `GET /tickets/:id` – Get a specific ticket.
- `PUT /tickets/:id/status` – Update the status of a ticket by providing `{ "status": "..." }`.

Tickets are kept in memory for simplicity and are not persisted.
