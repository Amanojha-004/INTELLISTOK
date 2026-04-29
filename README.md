# IntelliStok Backend

This project now includes an Express backend that serves the static frontend and exposes REST APIs for inventory, orders, and suppliers.

## Run locally

1. Open a terminal in `c:\Users\Amank\Downloads\intellistok`
2. Run `npm install`
3. Run `npm start`
4. Open `http://localhost:3000/dashboard.html`

## API endpoints

- `GET /api/inventory`
- `POST /api/inventory`
- `PUT /api/inventory/:id`
- `DELETE /api/inventory/:id`
- `GET /api/orders`
- `POST /api/orders`
- `PATCH /api/orders/:id/status`
- `GET /api/suppliers`
- `POST /api/suppliers`
- `GET /api/dashboard`
