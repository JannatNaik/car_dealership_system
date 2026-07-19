# AI Prompts History

This file documents the major prompt prompts exchanged during the design, development, and debugging of the Car Dealership Inventory System.

---

### Prompt 1: Initial Specification and Architecture Setup
**Role**: User
**Prompt**:
> TDD Kata: Car Dealership Inventory System
> Objective
> The goal of this kata is to design, build, and test a full-stack Car Dealership Inventory System. This project will test your skills in API development, database management, frontend implementation, testing, and modern development workflows, including the use of AI tools.
> ... [Detailed instructions specifying Node.js/TypeScript or Python/FastAPI backend, React frontend, TDD process, git co-authorship guidelines, and 22 implementation steps] ...
> create this project in the given folder structure, make the codes well commented, and humanify the logic and code writing style, keep the tech stack easy to implement, and code logic easy to understand, don't make it too much fancy, keep it simple and decent.

**Response Summary**:
*   Analyzed the workspace and system environment (found Python 3.13.7, Node.js 24.4.1).
*   Noted that MySQL was not installed as an active service and proposed using SQLAlchemy with SQLite for local execution.
*   Generated a comprehensive `implementation_plan.md` artifact outlining the database design, project layout, endpoints, testing suite strategy, and frontend organization.
*   Submitted the plan for user approval.

---

### Prompt 2: Plan Approval
**Role**: User
**Prompt**:
> yes i approve

**Response Summary**:
*   Created the `task.md` tracking list artifact.
*   Cleaned up placeholder directories in the workspace.
*   Created `requirements.txt` containing dependencies.
*   Implemented the database connection `database.py`.
*   Created the user model (`models/user.py`) and vehicle model (`models/vehicle.py`).
*   Created user schemas (`schemas/user.py`) and vehicle schemas (`schemas/vehicle.py`).

---

### Prompt 3: Code Expansion
**Role**: User
**Prompt**:
> continue

**Response Summary**:
*   Implemented `password.py` helper for bcrypt hashing.
*   Implemented JWT helpers `jwt.py`.
*   Created data access repositories for users (`user_repo.py`) and vehicles (`vehicle_repo.py`).
*   Built business services (`user_service.py`, `vehicle_service.py`).
*   Constructed controllers/routers (`auth_router.py`, `vehicle_router.py`).
*   Organized tests (`conftest.py`, `test_auth.py`, `test_vehicles.py`, `test_inventory.py`).
*   Ran the initial test suite and hit dependency issues (e.g. `pydantic[email]` missing `email-validator` and `bcrypt 5.0` causing `passlib` value errors on Python 3.13).
*   Refactored conftest.py table initialization order to fix `no such table: users` error.
*   Downgraded `bcrypt` to version `4.0.1`.
*   Ran the tests again and verified all 40 tests passed.
*   Scaffolded the React/Vite/Tailwind frontend files (`package.json`, `vite.config.js`, `tailwind.config.js`, `index.html`, etc.).

---

### Prompt 4: Documentation Finalization
**Role**: User
**Prompt**:
> implement the above given instructions in for the existing project, and create required documentation, .md files asked for in the project folder

**Response Summary**:
*   Verified that all 40 pytest assertions are passing.
*   Created the project's root `README.md` containing local setup steps, architecture, schema tables, endpoint documentation, and the "My AI Usage" section.
*   Created `PROMPTS.md` containing the interactive prompts.
*   Prepared the repository initialization steps and final status check.
