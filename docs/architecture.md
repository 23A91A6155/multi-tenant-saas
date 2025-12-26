# System Architecture Document

## 1. Overview

This document describes the high-level system architecture for the Multi-Tenant SaaS Project Management Platform. The architecture is designed to be modular, scalable, secure, and easy to maintain. It follows a standard three-tier architecture consisting of a frontend client, backend API, and database layer, with clear separation of concerns and strict tenant isolation.

---

## 2. High-Level System Architecture

### 2.1 Architecture Description

The system follows a client–server model:

* **Client (Frontend):** A web-based user interface built using React. It handles user interactions, form submissions, and role-based UI rendering.
* **Backend API:** A RESTful API built using Node.js with Express (or FastAPI). It handles authentication, authorization, business logic, and tenant isolation.
* **Database:** PostgreSQL is used as the primary relational database. All tenant data is stored in shared tables using a `tenant_id` column.
* **Authentication Layer:** JWT-based authentication is used to secure API access.
* **Deployment Layer:** Docker and Docker Compose are used for containerization and environment consistency.

---

### 2.2 System Architecture Flow

1. A user accesses the application through a web browser.
2. The frontend sends authentication requests to the backend API.
3. Upon successful login, the backend issues a JWT containing user role and tenant information.
4. The frontend includes the JWT in the Authorization header for all subsequent API requests.
5. The backend validates the JWT and enforces role-based access control.
6. Database queries are filtered using `tenant_id` to ensure data isolation.

---

## 3. System Architecture Diagram

The system architecture diagram visually represents the interaction between components:

* Browser
* React Frontend
* Backend API (Auth, Tenant, Project, Task modules)
* PostgreSQL Database
* JWT Authentication Flow

**Diagram File:**

```
docs/images/system-architecture.png
```

This diagram should show request and response flow, including JWT token exchange.

---

## 4. Database Architecture

### 4.1 Database Design Overview

The platform uses a **Shared Database + Shared Schema** multi-tenancy approach. Each table contains a `tenant_id` column to logically separate tenant data.

### 4.2 Key Tables

* **tenants** – Stores tenant (organization) details
* **users** – Stores user information and roles
* **projects** – Stores project details
* **tasks** – Stores task details and assignments
* **audit_logs** – Stores system activity logs

---

### 4.3 Entity Relationship Diagram (ERD)

The ERD defines relationships between entities such as tenants, users, projects, and tasks.

**ERD File:**

```
docs/images/database-erd.png
```

The ERD includes:

* Primary keys (PK)
* Foreign keys (FK)
* `tenant_id` usage
* One-to-many relationships

---

## 5. API Architecture

### 5.1 API Design Principles

* RESTful API design
* Stateless communication
* JWT-based authentication
* Role-based authorization
* Tenant-based data filtering

---

### 5.2 API Endpoints Overview

| Module  | Endpoint           | Method | Auth Required | Role               |
| ------- | ------------------ | ------ | ------------- | ------------------ |
| Auth    | /api/auth/login    | POST   | No            | All                |
| Auth    | /api/auth/register | POST   | No            | All                |
| Tenant  | /api/tenants       | POST   | Yes           | Super Admin        |
| Tenant  | /api/tenants       | GET    | Yes           | Super Admin        |
| User    | /api/users         | POST   | Yes           | Tenant Admin       |
| User    | /api/users         | GET    | Yes           | Tenant Admin       |
| Project | /api/projects      | POST   | Yes           | Tenant Admin       |
| Project | /api/projects      | GET    | Yes           | Tenant Admin, User |
| Task    | /api/tasks         | POST   | Yes           | Tenant Admin, User |
| Task    | /api/tasks         | GET    | Yes           | Tenant Admin, User |
| Task    | /api/tasks/:id     | PUT    | Yes           | Tenant Admin, User |
| Task    | /api/tasks/:id     | DELETE | Yes           | Tenant Admin       |

---

## 6. Security Architecture

* JWT validation middleware for all protected routes
* Role-based access control enforcement
* Tenant-based query filtering
* Secure password hashing
* Audit logging for critical actions

---

## 7. Scalability Considerations

* Stateless backend allows horizontal scaling
* Database indexing on `tenant_id`
* Container-based deployment supports scaling
* Clear module separation for maintainability

---

## Conclusion

This architecture provides a solid foundation for building a secure, scalable, and maintainable multi-tenant SaaS platform. It aligns with industry best practices and fully supports the functional and non-functional requirements defined in the PRD.
