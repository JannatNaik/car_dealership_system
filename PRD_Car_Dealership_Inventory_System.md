# Product Requirements Document (PRD)

# Car Dealership Inventory System

Version: 1.0  
Author: Jannat Shaikh 
Date: 19/07/2026
Project Type: Full Stack Assessment (TDD)

---

## 1. Objective

The objective of this project is to build a secure, responsive, and scalable Car Dealership Inventory Management System that enables authenticated users to browse, search, and purchase vehicles while allowing administrators to manage the dealership inventory.

The project demonstrates:
- REST API Development
- Authentication & Authorization
- Database Design
- React Frontend Development
- Test-Driven Development (TDD)
- Clean Architecture
- Modern Software Engineering Practices

---

## 2. Product Vision

Provide dealerships with a lightweight inventory management platform that allows efficient vehicle management while offering customers an intuitive vehicle browsing and purchasing experience.

---

## 3. Target Users

### Customer
- Register
- Login
- View available vehicles
- Search vehicles
- Purchase vehicles
- Logout

### Administrator
- Login
- Add vehicles
- Update vehicles
- Delete vehicles
- Restock inventory
- View all vehicles
- Manage dealership inventory

---

## 4. User Roles & Permissions

| Feature         | Customer   | Admin |
|-----------------|------------|-------|
| Register        |    ✅     |  ❌   |
| Login           |    ✅     |  ✅   |
| View Vehicles   |    ✅     |  ✅   |
| Search Vehicles |    ✅     |  ✅   |
| Purchase Vehicle|    ✅     |  ✅   |
| Add Vehicle     |    ❌     |  ✅   |
| Update Vehicle  |    ❌     |  ✅   |
| Delete Vehicle  |    ❌     |  ✅   |
| Restock Vehicle |    ❌     |  ✅   |

---

## 5. Problem Statement

Many small dealerships still maintain inventory manually or through spreadsheets, making inventory tracking, searching, and purchasing inefficient.

This application digitizes inventory while ensuring secure access control and an intuitive user experience.

---

## 6. Functional Requirements

### Authentication
- User Registration
- User Login
- JWT Authentication
- Role-based authorization

### Vehicle Management
- Add Vehicle (Admin)
- Update Vehicle (Admin)
- Delete Vehicle (Admin)
- View Vehicles
- Search Vehicles

Each vehicle includes:
- Unique ID
- Make
- Model
- Category
- Price
- Quantity

### Inventory
- Purchase Vehicle
- Restock Vehicle (Admin)
- Prevent negative stock

### Dashboard
- Display all vehicles
- Search & Filter
- Purchase button disabled when stock = 0

---

## 7. Non-Functional Requirements

### Performance
- API response < 500ms (normal operations)
- Search response < 1 second

### Security
- bcrypt password hashing
- JWT Authentication
- Role-Based Access Control
- Input validation
- SQL injection prevention

### Reliability
- No negative inventory
- Consistent inventory transactions

### Maintainability
- SOLID Principles
- Layered Architecture
- Repository Pattern
- Service Layer

### Usability
- Responsive UI
- Easy navigation
- Accessible interface

---

## 8. Assumptions

### Admin Scope
- Admin users are pre-created.
- Customers cannot self-register as admins.
- Only admins manage inventory.

### Other Assumptions
- One purchase decreases stock by one.
- Prices are stored in local currency.
- Payment gateway is not implemented.
- Purchase reserves inventory only.
- Email and username are unique.

---

## 9. Constraints

- React frontend
- FastAPI backend
- SQLite for development
- Test-Driven Development
- Git commit history should reflect Red-Green-Refactor

---

## 10. Out of Scope

- Online payments
- Forgot password
- Email verification
- Social login
- Reviews & Ratings
- Wishlist
- Order history
- Multi-dealership support
- Analytics dashboard
- CI/CD
- Docker deployment

---

## 11. Success Criteria

- Authentication works
- CRUD operations work
- Purchase updates stock correctly
- Search works
- Tests pass
- Responsive UI
- Documentation complete

---

## 12. Acceptance Criteria

- User registration/login
- JWT authentication
- Vehicle CRUD
- Search/filter
- Purchase & restock
- Responsive frontend
- Passing test suite
- README + PROMPTS.md

---

## 13. Risks

| Risk                    | Mitigation           |
|-------------------------|----------------------|
| Unauthorized access     | JWT + RBAC           |
| Duplicate records       | Database constraints |
| Invalid input           | Validation           |
| Inventory inconsistency | Transactions         |

---

## 14. Future Enhancements

- Vehicle images
- Payment integration
- Pagination
- Sorting
- Analytics
- Docker
- CI/CD
- Cloud deployment

---

## 15. Deliverables Checklist

### Backend
- REST APIs
- Authentication
- CRUD
- Search
- Purchase
- Restock
- Database
- Unit Tests

### Frontend
- Login/Register
- Dashboard
- Search
- Admin Panel
- Responsive UI

### Documentation
- README.md
- PRD.md
- IMPLEMENTATION_PLAN.md
- PROMPTS.md

### Testing
- Test Report
- Pytest Results

### Git
- Public Repository
- Meaningful Commits
- TDD History

### Optional
- Live Deployment
- Screenshots
- Swagger Documentation

---

## 16. Technology Stack

**Frontend:** React, Tailwind CSS, Axios, React Router

**Backend:** FastAPI, SQLAlchemy, JWT, Passlib

**Database:** SQLite (Development), MySQL/PostgreSQL (Future)

**Testing:** Pytest, HTTPX

**Version Control:** Git & GitHub

---

## 17. Development Methodology

- Agile-inspired iterations
- Test-Driven Development
- SOLID Principles
- Frequent Git commits
- Transparent AI-assisted development

---

## 18. Definition of Done

- Required APIs implemented
- Frontend complete
- Authentication & authorization working
- Tests passing
- Documentation complete
- Ready for interview demonstration
