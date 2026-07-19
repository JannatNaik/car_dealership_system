# Implementation Plan - Car Dealership Inventory System

This plan outlines the architecture, database design, API endpoints, and development steps for building the Car Dealership Inventory System. We will follow a Test-Driven Development (TDD) approach for the backend logic and keep the frontend clean, responsive, and user-friendly.

## Technology Stack

*   **Backend**: Python 3.13+, FastAPI, SQLAlchemy ORM, SQLite (file-based database for ease of local setup), JWT Authentication, Passlib (password hashing), Pytest (testing).
*   **Frontend**: React (Vite), Tailwind CSS, Axios, React Router.
*   **Database**: SQLite (`dealership.db`). SQLAlchemy will be used so we can easily swap to MySQL or PostgreSQL if needed.

---

## Database Design

We will define two main tables: `users` and `vehicles`.

### `users` Table
*   `id`: Integer (Primary Key, Autoincrement)
*   `username`: String (Unique, Indexed)
*   `email`: String (Unique, Indexed)
*   `password_hash`: String
*   `role`: String (either `"customer"` or `"admin"`)
*   `created_at`: DateTime

### `vehicles` Table
*   `id`: Integer (Primary Key, Autoincrement)
*   `make`: String (Indexed)
*   `model`: String (Indexed)
*   `category`: String (Indexed)
*   `price`: Float
*   `quantity`: Integer
*   `created_at`: DateTime

---

## Backend Directory Structure

We will populate the directories under `backend/app/` according to the requested structure:
```
backend/
  dealership.db (SQLite database file, auto-generated)
  requirements.txt
  pytest.ini
  app/
    __init__.py
    main.py
    database/
      __init__.py
      database.py
    models/
      __init__.py
      user.py
      vehicle.py
    schemas/
      __init__.py
      user.py
      vehicle.py
    repository/
      __init__.py
      user_repo.py
      vehicle_repo.py
    services/
      __init__.py
      user_service.py
      vehicle_service.py
    auth/
      __init__.py
      jwt.py
      password.py
    routers/
      __init__.py
      auth_router.py
      vehicle_router.py
    tests/
      __init__.py
      conftest.py
      test_auth.py
      test_vehicles.py
      test_inventory.py
```

---

## API Endpoints

### Authentication
*   `POST /api/auth/register` - Registers a new user. Returns a success message.
*   `POST /api/auth/login` - Authenticates a user. Returns a JWT token and user info.

### Vehicles (Protected: Bearer Token Required)
*   `POST /api/vehicles` - Add a new vehicle (Admin only).
*   `GET /api/vehicles` - View all available vehicles.
*   `GET /api/vehicles/search` - Search/filter vehicles (make, model, category, price range).
*   `PUT /api/vehicles/{id}` - Update a vehicle's details (Admin only).
*   `DELETE /api/vehicles/{id}` - Delete a vehicle (Admin only).

### Inventory (Protected: Bearer Token Required)
*   `POST /api/vehicles/{id}/purchase` - Purchase a vehicle, decrements quantity by 1. Returns error if quantity is 0.
*   `POST /api/vehicles/{id}/restock` - Restock a vehicle, increments quantity by given amount (Admin only).

---

## TDD & Testing Strategy

We will follow the **Red-Green-Refactor** lifecycle:
1.  **Red**: Write a test in `backend/app/tests/` asserting the expected API response or service behavior. Run `pytest` and watch it fail.
2.  **Green**: Implement the minimal code in repositories, services, and routers to make the test pass.
3.  **Refactor**: Clean up code structure, ensure PEP-8 compliance, and run tests again to verify no regression.

We will write tests covering:
*   User registration (success, duplicate username/email, invalid data).
*   User login (success, invalid password, non-existent user).
*   Vehicle CRUD operations and permissions (admin vs customer).
*   Search and filtering parameters.
*   Purchase behavior (quantity decrement, handling out of stock).
*   Restock behavior (admin authorization, quantity increment).

---

## Frontend Layout & Pages

We will create a clean React SPA in the `frontend` folder:
*   `Login / Register`: Forms with basic client-side validation.
*   `Dashboard (Customer & Admin)`:
    *   Display vehicles in a clean, modern responsive grid.
    *   Filters: Search input, category dropdown, price slider.
    *   For customers: "Purchase" button (disabled if quantity is 0).
    *   For admins: "Edit Details", "Delete", "Restock" options.
*   `Admin Forms`: Add and Edit Vehicle modals/pages.
*   `Navbar`: Shows current user, role, and a "Logout" button.

---

## Verification Plan

### Automated Tests
We will run:
```bash
cd backend
pytest -v
```

### Manual Verification
1.  Launch the backend: `uvicorn app.main:app --reload`
2.  Launch the frontend: `npm run dev`
3.  Verify the registration and login flows.
4.  Verify customer dashboard, search/filter, and purchase flows.
5.  Verify admin vehicle management (Create, Update, Delete, Restock).
