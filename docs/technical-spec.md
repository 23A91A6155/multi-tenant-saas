# Technical Specification

## 1. Project Structure

This section defines the complete folder structure for both backend and frontend components of the Multi-Tenant SaaS Project Management Platform. The structure is designed to maintain clean separation of concerns, scalability, and ease of maintenance.

---

## 1.1 Backend Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── tenant.controller.js
│   │   ├── user.controller.js
│   │   ├── project.controller.js
│   │   └── task.controller.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── tenant.routes.js
│   │   ├── user.routes.js
│   │   ├── project.routes.js
│   │   └── task.routes.js
│   │
│   ├── models/
│   │   ├── tenant.model.js
│   │   ├── user.model.js
│   │   ├── project.model.js
│   │   ├── task.model.js
│   │   └── auditLog.model.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── tenant.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── utils/
│   │   ├── jwt.util.js
│   │   ├── password.util.js
│   │   └── auditLogger.util.js
│   │
│   ├── config/
│   │   ├── database.js
│   │   ├── env.js
│   │   └── cors.js
│   │
│   ├── app.js
│   └── server.js
│
├── migrations/
│   ├── 001_create_tenants.sql
│   ├── 002_create_users.sql
│   ├── 003_create_projects.sql
│   ├── 004_create_tasks.sql
│   └── 005_create_audit_logs.sql
│
├── seeds/
│   └── seed_data.sql
│
├── tests/
│   ├── auth.test.js
│   ├── tenant.test.js
│   ├── project.test.js
│   └── task.test.js
│
├── Dockerfile
├── package.json
└── .env
```

### Purpose of Major Backend Folders

* **controllers/**: Contains business logic for handling API requests and responses.
* **routes/**: Defines API endpoints and maps them to controllers.
* **models/**: Represents database tables and schema mappings.
* **middleware/**: Handles authentication, authorization, tenant isolation, and error handling.
* **utils/**: Utility functions such as JWT handling, password hashing, and audit logging.
* **config/**: Centralized configuration for database, environment variables, and CORS.
* **migrations/**: SQL migration files for creating and updating database schema.
* **seeds/**: Initial seed data for development and testing.
* **tests/**: Automated tests for API endpoints and business logic.

---

## 1.2 Frontend Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Projects.jsx
│   │   ├── ProjectDetails.jsx
│   │   └── Users.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── utils/
│   │   └── authHelper.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── public/
│   └── index.html
│
├── Dockerfile
├── package.json
└── .env
```

### Purpose of Major Frontend Folders

* **components/**: Reusable UI components.
* **pages/**: Application pages corresponding to routes.
* **services/**: API communication layer.
* **context/**: Global state management (authentication).
* **utils/**: Helper functions for frontend logic.

---

## 2. Development Setup Guide

### 2.1 Prerequisites

* Node.js v18 or higher
* npm or yarn
* Docker and Docker Compose
* PostgreSQL (Dockerized)

---

### 2.2 Environment Variables

#### Backend (.env)

```
PORT=5000
DATABASE_URL=postgresql://user:password@database:5432/saas_db
JWT_SECRET=dev_secret_key
JWT_EXPIRES_IN=24h
```

#### Frontend (.env)

```
VITE_API_URL=http://backend:5000
```

---

### 2.3 Installation Steps

1. Clone the repository
2. Create required .env files
3. Build and start services using Docker Compose

```
docker-compose up -d
```

---

### 2.4 How to Run Locally

* Backend runs on: [http://localhost:5000](http://localhost:5000)
* Frontend runs on: [http://localhost:3000](http://localhost:3000)
* Database runs on: port 5432

---

### 2.5 How to Run Tests

```
npm test
```

---

## Conclusion

This technical specification provides a clear blueprint for project structure and development workflow. It ensures consistency, scalability, and ease of collaboration throughout the development lifecycle.
