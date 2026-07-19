I'll create a comprehensive `architecture.md` file with all the diagrams included. Here's the complete file:

```markdown
# Architecture Document - Car Dealership Inventory System

## 1. System Architecture Overview

```mermaid
graph TB
    subgraph "Presentation Layer"
        UI[React Frontend<br/>Vite + Tailwind CSS]
        UIComponents[Components:<br/>- Login/Register<br/>- Dashboard<br/>- Vehicle Grid<br/>- Admin Panel]
    end
    
    subgraph "API Gateway Layer"
        API[FastAPI Router Layer]
        AuthRouter[Auth Router<br/>/api/auth]
        VehicleRouter[Vehicle Router<br/>/api/vehicles]
        Middleware[JWT Middleware<br/>Role Validation]
    end
    
    subgraph "Business Logic Layer"
        ServiceLayer[Service Layer]
        AuthService[Auth Service]
        VehicleService[Vehicle Service]
        InventoryService[Inventory Service]
    end
    
    subgraph "Data Access Layer"
        RepositoryLayer[Repository Layer]
        UserRepo[User Repository]
        VehicleRepo[Vehicle Repository]
        SQLAlchemyORM[SQLAlchemy ORM]
    end
    
    subgraph "Data Storage Layer"
        Database[(SQLite Database<br/>dealership.db)]
        Users[(Users Table)]
        Vehicles[(Vehicles Table)]
    end
    
    UI --> API
    UIComponents --> UI
    API --> Middleware
    Middleware --> AuthRouter
    Middleware --> VehicleRouter
    AuthRouter --> ServiceLayer
    VehicleRouter --> ServiceLayer
    ServiceLayer --> AuthService
    ServiceLayer --> VehicleService
    ServiceLayer --> InventoryService
    AuthService --> RepositoryLayer
    VehicleService --> RepositoryLayer
    InventoryService --> RepositoryLayer
    RepositoryLayer --> UserRepo
    RepositoryLayer --> VehicleRepo
    UserRepo --> SQLAlchemyORM
    VehicleRepo --> SQLAlchemyORM
    SQLAlchemyORM --> Database
    Database --> Users
    Database --> Vehicles
    
    classDef presentation fill:#e1f5fe,stroke:#01579b
    classDef gateway fill:#f3e5f5,stroke:#4a148c
    classDef business fill:#e8f5e9,stroke:#1b5e20
    classDef data fill:#fff3e0,stroke:#e65100
    classDef storage fill:#fce4ec,stroke:#b71c1c
    
    class UI,UIComponents presentation
    class API,AuthRouter,VehicleRouter,Middleware gateway
    class ServiceLayer,AuthService,VehicleService,InventoryService business
    class RepositoryLayer,UserRepo,VehicleRepo,SQLAlchemyORM data
    class Database,Users,Vehicles storage
```

---

## 2. Data Flow Diagram (DFD) - Level 0

```mermaid
flowchart LR
    subgraph External["External Entities"]
        Customer[Customer]
        Admin[Administrator]
    end
    
    subgraph System["Car Dealership System"]
        subgraph Auth["Authentication Subsystem"]
            Register[User Registration]
            Login[User Login]
            JWT[JWT Token Generator]
        end
        
        subgraph Vehicle["Vehicle Management Subsystem"]
            CreateVeh[Create Vehicle]
            ReadVeh[View/Search Vehicles]
            UpdateVeh[Update Vehicle]
            DeleteVeh[Delete Vehicle]
        end
        
        subgraph Inventory["Inventory Subsystem"]
            Purchase[Purchase Vehicle]
            Restock[Restock Vehicle]
            StockCheck[Stock Validation]
        end
    end
    
    subgraph DB["Data Store"]
        UserDB[(Users DB)]
        VehicleDB[(Vehicles DB)]
    end
    
    Customer -->|Register Request| Register
    Customer -->|Login Credentials| Login
    Customer -->|Browse/Search| ReadVeh
    Customer -->|Purchase Request| Purchase
    
    Admin -->|Login Credentials| Login
    Admin -->|Add Vehicle| CreateVeh
    Admin -->|Update Vehicle| UpdateVeh
    Admin -->|Delete Vehicle| DeleteVeh
    Admin -->|Restock Request| Restock
    
    Register -->|Save User| UserDB
    Login -->|Verify Credentials| UserDB
    Login -->|Generate Token| JWT
    JWT -->|Return Token| Customer
    JWT -->|Return Token| Admin
    
    CreateVeh -->|Save Vehicle| VehicleDB
    ReadVeh -->|Query Vehicles| VehicleDB
    UpdateVeh -->|Update Vehicle| VehicleDB
    DeleteVeh -->|Delete Vehicle| VehicleDB
    
    Purchase -->|Check Stock| StockCheck
    StockCheck -->|Read Stock| VehicleDB
    Purchase -->|Decrement Stock| VehicleDB
    Restock -->|Check Permissions| UserDB
    Restock -->|Increment Stock| VehicleDB
    
    ReadVeh -->|Return Vehicles| Customer
    ReadVeh -->|Return Vehicles| Admin
    Purchase -->|Purchase Success| Customer
    Restock -->|Restock Success| Admin
```

---

## 3. Data Flow Diagram (DFD) - Level 1 - Authentication Flow

```mermaid
sequenceDiagram
    participant User as User
    participant FE as Frontend
    participant Auth as Auth Router
    participant Service as Auth Service
    participant Repo as User Repository
    participant DB as Database
    participant JWT as JWT Generator
    
    Note over User,JWT: Registration Flow
    
    User->>FE: Submit Registration Form
    FE->>Auth: POST /api/auth/register
    Auth->>Service: register_user(data)
    Service->>Repo: create_user(data)
    Repo->>DB: INSERT INTO users
    DB-->>Repo: User Created
    Repo-->>Service: User Object
    Service-->>Auth: Success Response
    Auth-->>FE: 201 Created
    FE-->>User: Registration Success
    
    Note over User,JWT: Login Flow
    
    User->>FE: Submit Login Form
    FE->>Auth: POST /api/auth/login
    Auth->>Service: authenticate_user(data)
    Service->>Repo: get_user_by_email(email)
    Repo->>DB: SELECT * FROM users WHERE email=?
    DB-->>Repo: User Data
    Repo-->>Service: User Object
    Service->>Service: Verify Password
    Service->>JWT: create_access_token(user)
    JWT-->>Service: JWT Token
    Service-->>Auth: Token Response
    Auth-->>FE: 200 OK + Token
    FE-->>User: Login Success + Redirect
```

---

## 4. Component Architecture Diagram

```mermaid
graph TB
    subgraph Frontend["Frontend Application (React)"]
        subgraph UI["UI Components"]
            Login[Login Page]
            Register[Register Page]
            Nav[Navbar]
            Dashboard[Dashboard]
            VehicleGrid[Vehicle Grid]
            SearchBar[Search/Filter Bar]
            AdminPanel[Admin Panel]
            PurchaseBtn[Purchase Button]
            RestockBtn[Restock Button]
            EditModal[Edit Modal]
            AddModal[Add Vehicle Modal]
        end
        
        subgraph State["State Management"]
            AuthContext[Auth Context]
            VehicleContext[Vehicle Context]
            CartContext[Cart Context]
        end
        
        subgraph Services["API Services"]
            AuthServiceFE[Auth Service]
            VehicleServiceFE[Vehicle Service]
            InventoryServiceFE[Inventory Service]
        end
        
        subgraph Utils["Utilities"]
            Axios[Axios Interceptors]
            Validators[Form Validators]
            Helpers[Helper Functions]
        end
    end
    
    subgraph Backend["Backend Application (FastAPI)"]
        subgraph Router["API Routers"]
            AuthRouterBE[Auth Router<br/>/api/auth]
            VehicleRouterBE[Vehicle Router<br/>/api/vehicles]
        end
        
        subgraph Middleware["Middleware"]
            AuthMiddleware[JWT Authentication]
            RoleMiddleware[Role Authorization]
            ErrorHandler[Error Handler]
        end
        
        subgraph Service["Services"]
            AuthServiceBE[Auth Service]
            VehicleServiceBE[Vehicle Service]
            InventoryServiceBE[Inventory Service]
        end
        
        subgraph Repository["Repositories"]
            UserRepoBE[User Repository]
            VehicleRepoBE[Vehicle Repository]
        end
        
        subgraph DB["Database Layer"]
            SQLAlchemy[SQLAlchemy ORM]
            Models[SQLAlchemy Models]
        end
    end
    
    Login --> AuthServiceFE
    Register --> AuthServiceFE
    Dashboard --> VehicleGrid
    VehicleGrid --> SearchBar
    VehicleGrid --> AdminPanel
    AdminPanel --> AddModal
    AdminPanel --> EditModal
    AdminPanel --> RestockBtn
    PurchaseBtn --> AuthContext
    RestockBtn --> AuthContext
    
    AuthServiceFE --> Axios
    VehicleServiceFE --> Axios
    InventoryServiceFE --> Axios
    
    Axios --> AuthRouterBE
    Axios --> VehicleRouterBE
    
    AuthRouterBE --> AuthMiddleware
    VehicleRouterBE --> AuthMiddleware
    AuthMiddleware --> RoleMiddleware
    RoleMiddleware --> ErrorHandler
    
    AuthRouterBE --> AuthServiceBE
    VehicleRouterBE --> VehicleServiceBE
    
    AuthServiceBE --> UserRepoBE
    VehicleServiceBE --> VehicleRepoBE
    InventoryServiceBE --> VehicleRepoBE
    
    UserRepoBE --> SQLAlchemy
    VehicleRepoBE --> SQLAlchemy
    SQLAlchemy --> Models
    Models --> DB
    
    classDef frontend fill:#e3f2fd,stroke:#1565c0
    classDef backend fill:#f3e5f5,stroke:#6a1b9a
    classDef database fill:#e8f5e9,stroke:#2e7d32
    
    class Login,Register,Nav,Dashboard,VehicleGrid,SearchBar,AdminPanel,PurchaseBtn,RestockBtn,EditModal,AddModal,AuthContext,VehicleContext,CartContext,AuthServiceFE,VehicleServiceFE,InventoryServiceFE,Axios,Validators,Helpers frontend
    class AuthRouterBE,VehicleRouterBE,AuthMiddleware,RoleMiddleware,ErrorHandler,AuthServiceBE,VehicleServiceBE,InventoryServiceBE,UserRepoBE,VehicleRepoBE backend
    class SQLAlchemy,Models,DB database
```

---

## 5. ER Diagram - Database Schema

```mermaid
erDiagram
    USERS ||--o{ VEHICLES : "manages"
    USERS {
        int id PK
        string username UK
        string email UK
        string password_hash
        string role
        datetime created_at
    }
    
    VEHICLES {
        int id PK
        string make
        string model
        string category
        float price
        int quantity
        datetime created_at
        int admin_id FK
    }
    
    USERS ||--o{ PURCHASES : "makes"
    VEHICLES ||--o{ PURCHASES : "has"
    
    PURCHASES {
        int id PK
        int user_id FK
        int vehicle_id FK
        int quantity
        float total_price
        datetime purchase_date
    }
```

---

## 6. Sequence Diagram - Vehicle Purchase Flow

```mermaid
sequenceDiagram
    participant User as Customer
    participant FE as React Frontend
    participant Router as Vehicle Router
    participant Auth as JWT Middleware
    participant Service as Vehicle Service
    participant Inventory as Inventory Service
    participant Repo as Vehicle Repository
    participant DB as SQLite Database
    
    User->>FE: Click "Purchase" Button
    FE->>FE: Check Authentication Token
    FE->>Router: POST /api/vehicles/{id}/purchase
    Router->>Auth: Validate JWT Token
    Auth->>Auth: Decode & Verify Token
    Auth-->>Router: Token Valid (User ID)
    Router->>Service: purchase_vehicle(vehicle_id, user_id)
    Service->>Repo: get_vehicle_by_id(vehicle_id)
    Repo->>DB: SELECT * FROM vehicles WHERE id=?
    DB-->>Repo: Vehicle Data
    Repo-->>Service: Vehicle Object
    
    Service->>Inventory: check_availability(vehicle_id)
    Inventory->>Repo: get_quantity(vehicle_id)
    Repo->>DB: SELECT quantity FROM vehicles WHERE id=?
    DB-->>Repo: Quantity: 5
    Repo-->>Inventory: Quantity: 5
    Inventory-->>Service: Available: True
    
    Service->>Inventory: decrement_stock(vehicle_id, 1)
    Inventory->>Repo: update_quantity(vehicle_id, 4)
    Repo->>DB: UPDATE vehicles SET quantity=4 WHERE id=?
    DB-->>Repo: Update Success
    Repo-->>Inventory: Success
    Inventory-->>Service: Success
    
    Service-->>Router: Purchase Successful
    Router-->>FE: 200 OK + Updated Vehicle
    FE->>FE: Update UI (quantity-- )
    FE-->>User: Purchase Confirmation
```

---

## 7. State Transition Diagram - Vehicle Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Draft: Admin Creates Vehicle
    
    Draft --> Available: Admin Sets Quantity > 0
    Draft --> Discontinued: Admin Deletes
    
    Available --> Reserved: Customer Purchases
    Reserved --> Available: Stock Remains > 0
    Reserved --> OutOfStock: Quantity = 0
    
    OutOfStock --> Available: Admin Restocks
    
    Available --> Discontinued: Admin Deletes
    OutOfStock --> Discontinued: Admin Deletes
    Reserved --> Discontinued: Admin Deletes
    
    Discontinued --> [*]
    
    note right of Available
        Vehicle is in inventory
        with quantity > 0
    end note
    
    note right of Reserved
        Purchase request
        reduces quantity by 1
    end note
    
    note right of OutOfStock
        Quantity = 0
        Purchase disabled
    end note
```

---

## 8. Security Architecture Diagram

```mermaid
flowchart TB
    subgraph Client["Client Side Security"]
        SecureStorage[Secure Storage<br/>LocalStorage/SessionStorage]
        HTTPS[HTTPS Encryption]
        InputValidation[Input Validation]
        CSP[Content Security Policy]
    end
    
    subgraph API["API Security Layer"]
        RateLimiting[Rate Limiting]
        CORS[CORS Configuration]
        SecurityHeaders[Security Headers]
    end
    
    subgraph Auth["Authentication Layer"]
        JWTValidation[JWT Validation]
        TokenExpiry[Token Expiry Check]
        RefreshToken[Refresh Token]
        SessionMgmt[Session Management]
    end
    
    subgraph Authorization["Authorization Layer"]
        RBAC[Role-Based Access Control]
        PermissionCheck[Permission Verification]
        AdminOnly[Admin-Only Endpoints]
    end
    
    subgraph Validation["Input Validation"]
        SchemaValidation[Pydantic Schema Validation]
        SQLInjection[SQL Injection Prevention]
        XSSProtection[XSS Protection]
        DataSanitization[Data Sanitization]
    end
    
    subgraph Data["Data Security"]
        PasswordHashing[Password Hashing<br/>bcrypt]
        EncryptedStorage[Encrypted Storage]
        TransactionSafety[Transaction Safety]
    end
    
    Client --> API
    API --> Auth
    Auth --> Authorization
    Authorization --> Validation
    Validation --> Data
    
    classDef client fill:#e3f2fd,stroke:#1565c0
    classDef api fill:#f3e5f5,stroke:#6a1b9a
    classDef auth fill:#e8f5e9,stroke:#2e7d32
    classDef authorization fill:#fff3e0,stroke:#e65100
    classDef validation fill:#fce4ec,stroke:#b71c1c
    classDef data fill:#f1f8e9,stroke:#33691e
    
    class SecureStorage,HTTPS,InputValidation,CSP client
    class RateLimiting,CORS,SecurityHeaders api
    class JWTValidation,TokenExpiry,RefreshToken,SessionMgmt auth
    class RBAC,PermissionCheck,AdminOnly authorization
    class SchemaValidation,SQLInjection,XSSProtection,DataSanitization validation
    class PasswordHashing,EncryptedStorage,TransactionSafety data
```

---

## 9. Deployment Architecture

```mermaid
graph TB
    subgraph Development["Development Environment"]
        DevFrontend[React Dev Server<br/>localhost:5173]
        DevBackend[FastAPI Dev Server<br/>localhost:8000]
        DevDB[(SQLite<br/>dealership.db)]
        DevTests[Pytest Test Suite]
    end
    
    subgraph Production["Production Environment"]
        subgraph Web["Web Tier"]
            Nginx[Nginx<br/>Reverse Proxy]
            FrontendBuild[React Build<br/>Static Files]
        end
        
        subgraph App["Application Tier"]
            Gunicorn[Gunicorn<br/>WSGI Server]
            FastAPI[FastAPI Application]
        end
        
        subgraph Data["Data Tier"]
            ProdDB[(PostgreSQL/MySQL<br/>Production Database)]
        end
    end
    
    subgraph CI_CD["CI/CD Pipeline"]
        GitHub[GitHub Repository]
        Tests[Automated Tests]
        Build[Build Step]
        Deploy[Deploy to Production]
    end
    
    Developer --> GitHub
    GitHub --> Tests
    Tests --> Build
    Build --> Deploy
    
    Deploy --> Nginx
    Deploy --> FastAPI
    Deploy --> ProdDB
    
    Nginx --> FrontendBuild
    Nginx --> Gunicorn
    Gunicorn --> FastAPI
    FastAPI --> ProdDB
    
    DevBackend --> DevDB
    DevFrontend --> DevBackend
    DevTests --> DevBackend
    
    classDef dev fill:#e8eaf6,stroke:#283593
    classDef prod fill:#e0f2f1,stroke:#004d40
    classDef ci fill:#fff3e0,stroke:#e65100
    
    class DevFrontend,DevBackend,DevDB,DevTests dev
    class Nginx,FrontendBuild,Gunicorn,FastAPI,ProdDB prod
    class GitHub,Tests,Build,Deploy ci
```

---

## 10. API Flow Diagram

```mermaid
flowchart LR
    subgraph Request["API Request Flow"]
        direction TB
        
        REQ[HTTP Request]
        VERB[HTTP Verb]
        PATH[URL Path]
        BODY[Request Body]
        HEADERS[Headers<br/>- Authorization<br/>- Content-Type]
    end
    
    subgraph Processing["Request Processing"]
        direction TB
        
        ROUTE[Route Handler]
        DEP[Parameter<br/>Dependency Injection]
        AUTH[JWT Validation]
        ROLE[Role Check]
        VALIDATE[Schema Validation]
        SERVICE[Service Call]
    end
    
    subgraph Response["API Response"]
        direction TB
        
        RES[HTTP Response]
        STATUS[Status Code]
        DATA[JSON Response]
        TOKEN[JWT Token<br/>(on login)]
        ERROR[Error Message]
    end
    
    REQ --> ROUTE
    VERB --> ROUTE
    PATH --> ROUTE
    BODY --> VALIDATE
    HEADERS --> AUTH
    
    ROUTE --> DEP
    DEP --> AUTH
    AUTH --> ROLE
    ROLE --> VALIDATE
    VALIDATE --> SERVICE
    
    SERVICE --> RES
    RES --> STATUS
    RES --> DATA
    RES --> TOKEN
    RES --> ERROR
    
    classDef req fill:#e3f2fd,stroke:#1565c0
    classDef proc fill:#f3e5f5,stroke:#6a1b9a
    classDef res fill:#e8f5e9,stroke:#2e7d32
    
    class REQ,VERB,PATH,BODY,HEADERS req
    class ROUTE,DEP,AUTH,ROLE,VALIDATE,SERVICE proc
    class RES,STATUS,DATA,TOKEN,ERROR res
```

---

## 11. Folder Structure Diagram

```mermaid
graph TB
    subgraph Project["Car Dealership Inventory System"]
        Root[📁 Project Root]
        
        subgraph Backend["📁 backend"]
            BEApp[📁 app]
            BEMain[📄 main.py]
            BEConfig[📄 config.py]
            BEDB[(📄 dealership.db)]
            BEPytest[📄 pytest.ini]
            BEReq[📄 requirements.txt]
            
            subgraph BEAppContent["📁 app content"]
                BEInit[📄 __init__.py]
                
                subgraph Auth[📁 auth]
                    AuthInit[📄 __init__.py]
                    JWT[📄 jwt.py]
                    Password[📄 password.py]
                end
                
                subgraph Database[📁 database]
                    DBInit[📄 __init__.py]
                    DBConn[📄 database.py]
                end
                
                subgraph Models[📁 models]
                    ModelInit[📄 __init__.py]
                    User[📄 user.py]
                    Vehicle[📄 vehicle.py]
                end
                
                subgraph Schemas[📁 schemas]
                    SchemaInit[📄 __init__.py]
                    UserSchema[📄 user.py]
                    VehicleSchema[📄 vehicle.py]
                end
                
                subgraph Repository[📁 repository]
                    RepoInit[📄 __init__.py]
                    UserRepo[📄 user_repo.py]
                    VehicleRepo[📄 vehicle_repo.py]
                end
                
                subgraph Services[📁 services]
                    ServInit[📄 __init__.py]
                    UserService[📄 user_service.py]
                    VehicleService[📄 vehicle_service.py]
                end
                
                subgraph Routers[📁 routers]
                    RouterInit[📄 __init__.py]
                    AuthRouter[📄 auth_router.py]
                    VehicleRouter[📄 vehicle_router.py]
                end
                
                subgraph Tests[📁 tests]
                    TestInit[📄 __init__.py]
                    Conftest[📄 conftest.py]
                    TestAuth[📄 test_auth.py]
                    TestVehicles[📄 test_vehicles.py]
                    TestInventory[📄 test_inventory.py]
                end
            end
        end
        
        subgraph Frontend["📁 frontend"]
            SRC[📁 src]
            
            subgraph SRCContent["📁 src content"]
                Components[📁 components]
                Pages[📁 pages]
                Context[📁 context]
                Services[📁 services]
                Utils[📁 utils]
                Styles[📁 styles]
                
                App[📄 App.jsx]
                Main[📄 main.jsx]
            end
            
            FEConfig[📄 vite.config.js]
            FEPackage[📄 package.json]
        end
        
        subgraph Docs["📁 docs"]
            README[📄 README.md]
            PRD[📄 PRD.md]
            IMPL[📄 implementation_plan.md]
            ARCH[📄 architecture.md]
            PROMPTS[📄 prompts.md]
        end
    end
    
    classDef root fill:#e8eaf6,stroke:#283593
    classDef backend fill:#e3f2fd,stroke:#1565c0
    classDef frontend fill:#f3e5f5,stroke:#6a1b9a
    classDef docs fill:#e8f5e9,stroke:#2e7d32
    
    class Root root
    class Backend,BEApp,BEAppContent,Auth,Database,Models,Schemas,Repository,Services,Routers,Tests,BEMain,BEConfig,BEDB,BEPytest,BEReq backend
    class Frontend,SRC,SRCContent,Components,Pages,Context,Services,Utils,Styles,App,Main,FEConfig,FEPackage frontend
    class Docs,README,PRD,IMPL,ARCH,PROMPTS docs
```

---

## 12. Component Interaction Diagram - Admin Operations

```mermaid
sequenceDiagram
    participant Admin
    participant FE_Admin as Admin Panel
    participant FE_Service as Vehicle Service
    participant Router as Vehicle Router
    participant Middleware as Auth Middleware
    participant Service as Vehicle Service
    participant Repo as Vehicle Repo
    participant DB as Database
    
    Note over Admin,DB: Add Vehicle Flow
    
    Admin->>FE_Admin: Fill Vehicle Form
    Admin->>FE_Admin: Click "Add Vehicle"
    FE_Admin->>FE_Service: createVehicle(data)
    FE_Service->>FE_Service: Attach JWT Token
    FE_Service->>Router: POST /api/vehicles
    Router->>Middleware: Validate Token
    Middleware->>Middleware: Verify Admin Role
    Middleware-->>Router: Authorized
    Router->>Service: create_vehicle(data)
    Service->>Service: Validate Data
    Service->>Repo: create(data)
    Repo->>DB: INSERT INTO vehicles
    DB-->>Repo: Success
    Repo-->>Service: Vehicle Created
    Service-->>Router: Success
    Router-->>FE_Service: 201 Created
    FE_Service-->>FE_Admin: Vehicle Added
    FE_Admin-->>Admin: Success Message
    
    Note over Admin,DB: Update Vehicle Flow
    
    Admin->>FE_Admin: Click "Edit" on Vehicle
    FE_Admin->>FE_Admin: Open Edit Modal
    Admin->>FE_Admin: Modify Details
    Admin->>FE_Admin: Click "Save"
    FE_Admin->>FE_Service: updateVehicle(id, data)
    FE_Service->>Router: PUT /api/vehicles/{id}
    Router->>Middleware: Validate Admin Role
    Middleware-->>Router: Authorized
    Router->>Service: update_vehicle(id, data)
    Service->>Repo: update(id, data)
    Repo->>DB: UPDATE vehicles
    DB-->>Repo: Success
    Repo-->>Service: Updated
    Service-->>Router: Success
    Router-->>FE_Service: 200 OK
    FE_Service-->>FE_Admin: Vehicle Updated
    FE_Admin-->>Admin: Success Message
```

---

## 13. Error Handling Flow

```mermaid
flowchart TB
    REQ[API Request]
    REQ --> VALIDATE[Validate Input]
    
    VALIDATE -->|Invalid| VAL_ERR[Validation Error<br/>400 Bad Request]
    VALIDATE -->|Valid| AUTH[JWT Authentication]
    
    AUTH -->|No Token| AUTH_ERR[Authentication Error<br/>401 Unauthorized]
    AUTH -->|Invalid Token| TOKEN_ERR[Invalid Token<br/>403 Forbidden]
    AUTH -->|Valid| ROLE[Role Check]
    
    ROLE -->|Insufficient| ROLE_ERR[Permission Denied<br/>403 Forbidden]
    ROLE -->|Authorized| SERVICE[Service Layer]
    
    SERVICE -->|Not Found| NOTFOUND[Resource Not Found<br/>404 Not Found]
    SERVICE -->|Duplicate| DUPLICATE[Duplicate Resource<br/>409 Conflict]
    SERVICE -->|Business Rule| BUS_ERR[Business Rule Violation<br/>400 Bad Request]
    SERVICE -->|Success| SUCCESS[Success Response<br/>200/201]
    
    VAL_ERR --> RESPONSE[Error Response<br/>JSON Error Message]
    AUTH_ERR --> RESPONSE
    TOKEN_ERR --> RESPONSE
    ROLE_ERR --> RESPONSE
    NOTFOUND --> RESPONSE
    DUPLICATE --> RESPONSE
    BUS_ERR --> RESPONSE
    SUCCESS --> SUCCESS_RESPONSE[Success Response<br/>JSON Data]
    
    classDef error fill:#ffebee,stroke:#c62828
    classDef success fill:#e8f5e9,stroke:#2e7d32
    classDef process fill:#e3f2fd,stroke:#1565c0
    
    class VAL_ERR,AUTH_ERR,TOKEN_ERR,ROLE_ERR,NOTFOUND,DUPLICATE,BUS_ERR,RESPONSE error
    class SUCCESS,SUCCESS_RESPONSE success
    class REQ,VALIDATE,AUTH,ROLE,SERVICE process
```

---

## 14. Technical Architecture Summary

### Architecture Patterns Used:
1. **Layered Architecture**: Presentation → Business Logic → Data Access → Database
2. **Repository Pattern**: Abstracts data access logic
3. **Service Layer Pattern**: Encapsulates business logic
4. **Dependency Injection**: Via FastAPI's dependency system
5. **JWT Authentication**: Stateless authentication
6. **RBAC**: Role-based access control

### Key Design Decisions:
- **SQLAlchemy ORM**: Database abstraction for future migrations
- **Pydantic Schemas**: Type validation and serialization
- **Async Support**: FastAPI's native async capabilities
- **Test-First Development**: All features TDD compliant
- **Component-Based UI**: Reusable React components

### Performance Considerations:
- Database indexing on frequently queried fields
- Connection pooling for database connections
- Efficient query optimization
- Client-side caching via React context
- Lazy loading for images and components

### Security Measures:
- JWT with expiration time
- bcrypt password hashing
- SQL injection prevention (ORM)
- XSS protection
- CORS configuration
- Rate limiting

### Scalability Considerations:
- Stateless API design enables horizontal scaling
- Database can be migrated to PostgreSQL/MySQL
- Frontend can be served via CDN
- API can be containerized with Docker
- Load balancer ready architecture

---

## 15. Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React + Vite | UI Framework |
| | Tailwind CSS | Styling |
| | Axios | API Client |
| | React Router | Navigation |
| **Backend** | FastAPI | API Framework |
| | SQLAlchemy | ORM |
| | Pydantic | Data Validation |
| | JWT | Authentication |
| | Passlib | Password Hashing |
| **Database** | SQLite | Development |
| | PostgreSQL/MySQL | Production |
| **Testing** | Pytest | Backend Testing |
| | HTTPX | Async Testing |
| **Documentation** | Swagger/OpenAPI | API Documentation |

---

## 16. Communication Flow Summary

```mermaid
flowchart LR
    subgraph Client["Client (React)"]
        UI[User Interface]
        State[State Management]
        API_Services[API Services]
    end
    
    subgraph Network["Network"]
        HTTP[HTTP/HTTPS]
        JWT[Bearer Token]
        JSON[JSON Payloads]
    end
    
    subgraph Server["Server (FastAPI)"]
        API_Endpoints[API Endpoints]
        Middleware[Middleware]
        Services[Services]
        Repositories[Repositories]
        Database[Database]
    end
    
    UI --> State
    State --> API_Services
    API_Services --> HTTP
    HTTP --> API_Endpoints
    API_Endpoints --> Middleware
    Middleware --> Services
    Services --> Repositories
    Repositories --> Database
    
    Database --> Repositories
    Repositories --> Services
    Services --> Middleware
    Middleware --> API_Endpoints
    API_Endpoints --> HTTP
    HTTP --> API_Services
    API_Services --> State
    State --> UI
    
    classDef client fill:#e3f2fd,stroke:#1565c0
    classDef network fill:#fff3e0,stroke:#e65100
    classDef server fill:#e8f5e9,stroke:#2e7d32
    
    class UI,State,API_Services client
    class HTTP,JWT,JSON network
    class API_Endpoints,Middleware,Services,Repositories,Database server
```

---

## 17. Data Validation Flow

```mermaid
flowchart TB
    subgraph FE["Frontend Validation"]
        F_Input[Form Input]
        F_Validate[Client Validation<br/>- Required Fields<br/>- Email Format<br/>- Password Strength<br/>- Price Format]
        F_Submit[Submit to API]
    end
    
    subgraph API["API Validation"]
        A_Receive[Receive Request]
        A_Schema[Schema Validation<br/>- Pydantic Models<br/>- Field Types<br/>- Constraints]
        A_Business[Business Logic<br/>- Stock Availability<br/>- Role Verification<br/>- Duplicate Check]
    end
    
    subgraph DB["Database Validation"]
        DB_Constraints[Database Constraints<br/>- Primary Key<br/>- Unique Constraints<br/>- Foreign Key<br/>- Not Null]
        DB_Triggers[Triggers/Rules<br/>- Quantity >= 0<br/>- Auto Timestamps]
    end
    
    F_Input --> F_Validate
    F_Validate -->|Valid| F_Submit
    F_Validate -->|Invalid| F_Input
    
    F_Submit --> A_Receive
    A_Receive --> A_Schema
    A_Schema -->|Valid| A_Business
    A_Schema -->|Invalid| A_Receive
    
    A_Business -->|Valid| DB_Constraints
    A_Business -->|Invalid| A_Receive
    
    DB_Constraints --> DB_Triggers
    DB_Triggers -->|Success| Success[Success Response]
    DB_Triggers -->|Failed| Error[Error Response]
    
    classDef frontend fill:#e3f2fd,stroke:#1565c0
    classDef api fill:#f3e5f5,stroke:#6a1b9a
    classDef db fill:#e8f5e9,stroke:#2e7d32
    classDef result fill:#fff3e0,stroke:#e65100
    
    class F_Input,F_Validate,F_Submit frontend
    class A_Receive,A_Schema,A_Business api
    class DB_Constraints,DB_Triggers db
    class Success,Error result
```

---

**Document Version:** 1.0  
**Last Updated:** 2026-07-19  
**Author:** Jannat Shaikh
```

This `architecture.md` file contains all the visual diagrams including:

1. **System Architecture Overview** - High-level architecture showing all layers
2. **Data Flow Diagram (DFD) Level 0** - External entities and system processes
3. **DFD Level 1 - Authentication Flow** - Detailed sequence for auth
4. **Component Architecture Diagram** - Frontend and backend component breakdown
5. **ER Diagram** - Database schema with relationships
6. **Sequence Diagram** - Vehicle purchase flow
7. **State Transition Diagram** - Vehicle lifecycle
8. **Security Architecture Diagram** - Security layers and measures
9. **Deployment Architecture** - Development and production environments
10. **API Flow Diagram** - Request processing lifecycle
11. **Folder Structure Diagram** - Complete project structure
12. **Component Interaction Diagram** - Admin operations flow
13. **Error Handling Flow** - Error processing pipeline
14. **Communication Flow Summary** - System communication
15. **Data Validation Flow** - Multi-layer validation

