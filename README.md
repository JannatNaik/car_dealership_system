# AutoDrive: Car Dealership Inventory System

AutoDrive is a full-stack Car Dealership Inventory System designed to manage user authentication, role-based access control, vehicle inventories, and mock purchasing workflows. This project demonstrates clean coding practices, SOLID design principles, and Test-Driven Development (TDD).

---

## Overall Architecture

```
                 ┌───────────────────────────┐
                 │       React SPA           │
                 │      (Vite + CSS)         │
                 └─────────────┬─────────────┘
                               │
                               │ REST API
                               ▼
                 ┌───────────────────────────┐
                 │      FastAPI Backend      │
                 └─────────────┬─────────────┘
                               │
                               │ SQLAlchemy ORM
                               ▼
                 ┌───────────────────────────┐
                 │      SQLite Database      │
                 │      (dealership.db)      │
                 └───────────────────────────┘
```

---

## Tech Stack

### Backend
*   **Python**: `3.13.7`
*   **FastAPI**: For high-performance, asynchronous RESTful API routing.
*   **SQLAlchemy ORM**: For database access.
*   **SQLite**: File-based database (`dealership.db`), allowing zero-config local runs.
*   **JWT Authentication**: Secure user authentication (`python-jose`).
*   **Passlib + Bcrypt**: Password hashing.
*   **Pytest**: Robust test suite following Test-Driven Development (TDD) principles.

### Frontend
*   **React**: Single-page application bootstrapped with Vite.
*   **Tailwind CSS**: For clean, modern styling.
*   **Axios**: API client configuration with authentication interceptors.
*   **React Router**: client-side routing.
*   **React Toastify**: For beautiful, responsive alert notifications.

---

## Features

### Authentication & Authorization
*   **User Registration**: Registers customers and admins.
*   **Token-Based Login**: Generates JWT token for subsequent API calls.
*   **Role-Based Access Control (RBAC)**: Enforces page navigation and action permissions (e.g., customers can purchase, admins can manage inventory and restock).

### Vehicle Management
*   **Inventory Grid**: Shows available vehicles with make, model, category, price, and stock quantity.
*   **Search & Filters**: Quick filters for Category, Make, Model, and Price range.
*   **Details Page**: Provides a deep dive into vehicle statistics.

### Inventory System
*   **Purchase Flow**: Decrease vehicle quantity by 1. Disables the "Purchase" button and labels it "Out of Stock" if quantity drops to 0.
*   **Restock Form**: Admin-only feature to increase stock quantity by a chosen amount.
*   **Admin Panel**: Admin-only panel to create, update, delete, and restock vehicles.

---

## Database Schema

### Users Table
| Column Name     | Type     | Constraints                          |
| :-------------- | :------- | :----------------------------------- |
| `id`            | Integer  | Primary Key, Autoincrement           |
| `username`      | String   | Unique, Indexed, Non-Nullable        |
| `email`         | String   | Unique, Indexed, Non-Nullable        |
| `password_hash` | String   | Non-Nullable                         |
| `role`          | String   | Default `"customer"`, Non-Nullable   |
| `created_at`    | DateTime | Default `utcnow()`, Non-Nullable     |

### Vehicles Table
| Column Name  | Type     | Constraints                      |
| :----------- | :------- | :------------------------------- |
| `id`         | Integer  | Primary Key, Autoincrement       |
| `make`       | String   | Indexed, Non-Nullable            |
| `model`      | String   | Indexed, Non-Nullable            |
| `category`   | String   | Indexed, Non-Nullable            |
| `price`      | Float    | Non-Nullable                     |
| `quantity`   | Integer  | Default `0`, Non-Nullable        |
| `created_at` | DateTime | Default `utcnow()`, Non-Nullable |

---

## API Endpoints

### Authentication (Public)
*   `POST /api/auth/register` - Registers a new user.
*   `POST /api/auth/login` - Authenticates user. Returns JWT and user profile.

### Vehicles (Protected)
*   `GET /api/vehicles` - List all available vehicles.
*   `GET /api/vehicles/search` - Search vehicles by category, make, model, min/max price.
*   `POST /api/vehicles` - Add a new vehicle (Admin only).
*   `PUT /api/vehicles/{id}` - Update vehicle details (Admin only).
*   `DELETE /api/vehicles/{id}` - Delete vehicle (Admin only).

### Inventory (Protected)
*   `POST /api/vehicles/{id}/purchase` - Purchase a vehicle (decreases quantity by 1).
*   `POST /api/vehicles/{id}/restock` - Restock a vehicle (increases quantity, Admin only).

---

## Local Setup & Run Guide

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload
   ```
   *The server will start on [http://localhost:8000](http://localhost:8000).*
   *API documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).*

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will launch on [http://localhost:5173](http://localhost:5173).*

---

## Running Backend Tests (TDD)

We followed a Test-Driven Development flow. To execute the backend test suite:
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Run pytest:
   ```bash
   python -m pytest -v
   ```
This runs 40 distinct test assertions covering authentication, permissions, searches, purchases, and restocking.

---

## Screenshots in Action

Here are some representations of the application UI:

### 1. Modern Login Page
A clean dark/light card-based form featuring form-level validation, elegant error feedback, and quick links to registration.

### 2. Vehicle Catalog Dashboard
Displays a grid of cards showing make, model, pricing, and live inventory count. The "Purchase" button disables dynamically when stock hits 0, turning into a grayed-out "Out of Stock" state.

### 3. Interactive Filter Panels
Enables users to search by keyword (make/model) and apply filters (SUV, Sedan, Hatchback, etc.) combined with minimum and maximum price constraints.

### 4. Admin Management Controls
Admins are shown additional operational buttons: "Edit", "Delete", and "Restock". Forms for adding a new vehicle or adjusting stock numbers appear cleanly in overlays.

---

## My AI Usage

### AI Tools Used
*   **Gemini 3.5 Flash** & **Claude 3.5 Sonnet** (via the Antigravity assistant)

### How they were used
1.  **Architecture & Design**: Brainstormed the layout, folder separation (routers, models, schemas, repositories, services), and mapped out the DB design for SQLite integration.
2.  **TDD Boilerplate**: Used the AI assistant to write the initial test configurations and mock tests in `backend/app/tests/` to fail first (RED state).
3.  **Debugging & Troubleshooting**: When a dependency conflict occurred with `bcrypt` (throwing a `ValueError: password cannot be longer than 72 bytes` on Python 3.13 due to a passlib/bcrypt incompatibility), the AI quickly identified the root cause and suggested pinning `bcrypt==4.0.1`.
4.  **Frontend Polish**: Structured Tailwind CSS styles and component hooks (`useAuth`, axios interceptors) to ensure token expiration kicks the user to login automatically.

### Reflections on AI Impact
Using AI tools significantly streamlined the development velocity:
*   **Pros**: Writing verbose unit tests and boilerplate endpoints (schemas, models) was cut down from hours to minutes. Setting up an Axios response interceptor for 401 token expiry was generated accurately.
*   **Cons**: Relies on accurate dependency management. The breaking changes in newer Python/bcrypt libraries required manual overrides that the AI eventually resolved, showing that human oversight is still critical.

---

## Test Report Summary

```
============================= test session starts =============================
platform win32 -- Python 3.13.7, pytest-9.1.1, pluggy-1.6.0
rootdir: C:\car_system\backend
configfile: pytest.ini
collected 40 items

app/tests/test_auth.py .............                                     [ 32%]
app/tests/test_inventory.py ...........                                  [ 60%]
app/tests/test_vehicles.py ................                              [100%]

========================== 40 passed in 158.22s ===============================
```
All tests completed with 100% success rate, validating authentication registration, token lifecycle, search behaviors, and inventory constraints.
