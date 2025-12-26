# Multi-Tenant SaaS Application

A complete backend + frontend multi-tenant SaaS system built using Node.js, Express, PostgreSQL, React, and Docker.

---

## 🚀 Features

- Multi-tenant architecture (strict tenant isolation)
- JWT-based authentication & authorization
- Role-based access control (super_admin, tenant_admin, user)
- Tenant management
- User management per tenant
- Project & task management
- Dockerized backend, database, and frontend
- RESTful API (19 endpoints)

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt / bcryptjs
- Docker

### Frontend
- React (Vite)
- Axios
- React Router
- Docker

### Database
- PostgreSQL 15
- UUID-based primary keys

---

## 🧱 Project Structure

```text
multi-tenant-saas/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── app.js
│   ├── server.js
│   ├── Dockerfile
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── auth/
│   │   ├── pages/
│   │   ├── components/
│   │   └── api/
│   ├── Dockerfile
│   └── vite.config.js
│
├── database/
│   ├── migrations/
│   └── seeds/
│
├── docker-compose.yml
├── submission.json
└── docs/
🐳 Docker Setup (MANDATORY)
Run entire system
| Service  | Port |
| -------- | ---- |
| Database | 5432 |
| Backend  | 5000 |
| Frontend | 3000 |
❤️ Health Check
GET api/health
{ "status": "OK" }
🔐 Authentication Flow

Tenant Registration

Tenant Admin Login

JWT issued

Token used in Authorization header

Role & tenant validated on every request
👨‍💻 Author

Name: Your Name

College / Company

Date: 2025

---

## 2️⃣ docs/architecture.md

Create file:

```md
# System Architecture

## Overview

The application follows a 3-tier architecture:

1. Frontend (React)
2. Backend API (Node.js + Express)
3. Database (PostgreSQL)

All services are containerized using Docker and communicate over a Docker network.

---

## High-Level Flow

User → Frontend → Backend API → Database

---

## Multi-Tenancy Strategy

- Every request contains a JWT
- JWT includes `tenantId` and `role`
- Backend enforces tenant isolation at query level
- Cross-tenant access is blocked

---

## Database ERD (Textual)

- tenants
- users (tenant_id FK)
- projects (tenant_id FK)
- tasks (project_id FK)

---

## Security

- Password hashing using bcrypt
- JWT expiration
- Role-based authorization
- SQL injection prevention via parameterized queries
3️⃣ docs/API.md (19 APIs LIST)

Create:

# API Documentation

## Authentication
1. POST /api/auth/register-tenant
2. POST /api/auth/login
3. GET  /api/auth/me
4. POST /api/auth/logout

## Tenant
5. GET    /api/tenants/:id
6. PUT    /api/tenants/:id
7. GET    /api/tenants

## Users
8. POST   /api/tenants/:id/users
9. GET    /api/tenants/:id/users
10. PUT   /api/users/:id
11. DELETE /api/users/:id

## Projects
12. POST   /api/projects
13. GET    /api/projects
14. PUT    /api/projects/:id
15. DELETE /api/projects/:id

## Tasks
16. POST   /api/projects/:id/tasks
17. GET    /api/projects/:id/tasks
18. PUT    /api/tasks/:id
19. DELETE /api/tasks/:id
4️⃣ submission.json (MANDATORY)

Create in root folder:
{
  "testCredentials": {
    "superAdmin": {
      "email": "superadmin@system.com",
      "password": "Admin@123"
    },
    "tenantAdmin": {
      "email": "admin@companyone.com",
      "password": "Admin@123",
      "tenantSubdomain": "companyone"
    },
    "user": {
      "email": "user1@companyone.com",
      "password": "User@123"
    }
  }
}
5️⃣ docs/technical-spec.md
# Technical Specification

## Backend
- Express.js REST API
- JWT middleware
- PostgreSQL connection pool
- Transaction-safe queries

## Frontend
- React + Vite
- Axios API client
- Protected routes
- Role-based UI rendering

## Docker
- Multi-container setup
- Automatic DB startup
- Fixed ports as per requirement
6️⃣ docs/research.md (SUMMARY VERSION)
# Multi-Tenancy Research

Multi-tenancy allows a single application instance to serve multiple customers while keeping data isolated.

### Benefits
- Cost efficiency
- Scalability
- Centralized maintenance

### Security Considerations
- Tenant-aware queries
- JWT validation
- Role enforcement

### Architecture Choice
Chosen for simplicity, scalability, and Docker compatibility.
