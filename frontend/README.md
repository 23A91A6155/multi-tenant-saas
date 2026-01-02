🧩 Multi-Tenant SaaS Application
A full-stack Multi-Tenant SaaS Application built with Node.js, Express, PostgreSQL, React, and Docker, implementing secure authentication, role-based access control, tenant isolation, and project/task management.
This project is developed as per company/mentor requirements and is fully functional in both local development and Dockerized environments.
📌 Key Features
🔐 Authentication & Authorization
JWT-based authentication
Secure password hashing using bcrypt
Role-based access control:
Super Admin
Tenant Admin
User
🏢 Multi-Tenancy
Each tenant has isolated data
Users, projects, and tasks are strictly scoped to their tenant
Subdomain-based tenant login
👥 User Management
Tenant Admin can:
Add users
View users
Delete users
Role enforcement at API & UI level
📁 Project Management
Create projects per tenant
List projects
Delete projects
Dashboard shows total projects count
✅ Task Management
Create tasks under a project
View tasks per project
Update task status
Delete tasks
🖥️ Frontend (React)
Login & Register pages
Protected routes
Dashboard with summary cards
Projects page
Users page with Add / Delete
Navbar with logout
Token-based API calls
🐳 Docker Support
Database (PostgreSQL)
Backend (Node + Express)
Frontend (React)
All services run using docker-compose
🛠️ Tech Stack
Backend
Node.js
Express.js
PostgreSQL
JWT
bcryptjs
pg (node-postgres)
Frontend
React (Vite)
React Router DOM
Axios
DevOps
Docker
Docker Compose
📂 Project Structure
Copy code

multi-tenant-saas/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── utils/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── auth/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── api/
│   │   └── App.jsx
│   └── package.json
│
├── database/
│   ├── migrations/
│   └── seeds/
│
├── docker-compose.yml
└── README.md
🚀 How to Run (Local – Without Docker)
1️⃣ Start Database
Use PostgreSQL via Docker or local installation.
2️⃣ Backend
Copy code
Bash
cd backend
npm install
npm run dev
Backend runs on:
Copy code

http://localhost:5000
Health check:
Copy code

GET /health
3️⃣ Frontend
Copy code
Bash
cd frontend
npm install
npm run dev
Frontend runs on:
Copy code

http://localhost:5173
🐳 How to Run (Docker – Recommended)
From project root:
Copy code
Bash
docker compose up -d
Ports
Service
Port
Database
5432
Backend
5000
Frontend
3000
🔑 Test Credentials (Seed Data)
Tenant Admin
Copy code

Email: admin@companyone.com
Password: Test@123
Subdomain: companyone
Role: tenant_admin
Regular User
Copy code

Email: user@companyone.com
Password: User@123
Subdomain: companyone
Role: user
🔗 API Endpoints (Major)
Auth
POST /api/auth/login
GET /api/auth/me
POST /api/auth/logout
Tenants
GET /api/tenants/:tenantId
PUT /api/tenants/:tenantId
GET /api/tenants
Users
GET /api/tenants/:tenantId/users
POST /api/tenants/:tenantId/users
DELETE /api/users/:userId
Projects
POST /api/projects
GET /api/projects
DELETE /api/projects/:id
Tasks
POST /api/projects/:id/tasks
GET /api/projects/:id/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id
🔒 Security Practices
Password hashing with bcrypt
JWT expiration handling
Tenant isolation enforced at query level
Role validation middleware
Protected frontend routes
🧪 Testing
APIs tested via Postman
Frontend tested manually
Role-based access verified
Cross-tenant access blocked
📊 Evaluation Notes (For Mentor)
✔ Multi-tenant isolation implemented
✔ Role-based access control
✔ Secure authentication
✔ RESTful API design
✔ Dockerized services
✔ Clean project structure
✔ Frontend & backend fully integrated
📽️ Demo & Submission
Demo video can be recorded showing:
Login
User creation
Project creation
Task creation
Tenant isolation
👨‍💻 Author
Project Developed By:
[Akhila Paraselli]
Multi-Tenant SaaS Full Stack Project
