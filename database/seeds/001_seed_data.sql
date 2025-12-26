-- SUPER ADMIN (platform level)
INSERT INTO users (id, email, password, full_name, role)
VALUES (
  gen_random_uuid(),
  'superadmin@platform.com',
  'SuperAdmin@123',
  'Super Admin',
  'super_admin'
);

-- TENANT
INSERT INTO tenants (id, name, subdomain, subscription_plan, max_users, max_projects)
VALUES (
  gen_random_uuid(),
  'Demo Tenant',
  'demo',
  'free',
  5,
  5
);

-- TENANT ADMIN
INSERT INTO users (id, tenant_id, email, password, full_name, role)
SELECT
  gen_random_uuid(),
  id,
  'admin@demo.com',
  'Admin@123',
  'Demo Admin',
  'tenant_admin'
FROM tenants
WHERE subdomain = 'demo';

-- REGULAR USER
INSERT INTO users (id, tenant_id, email, password, full_name, role)
SELECT
  gen_random_uuid(),
  id,
  'user@demo.com',
  'User@123',
  'Demo User',
  'user'
FROM tenants
WHERE subdomain = 'demo';

-- PROJECT
INSERT INTO projects (id, tenant_id, name)
SELECT
  gen_random_uuid(),
  id,
  'Demo Project'
FROM tenants
WHERE subdomain = 'demo';

-- TASK
INSERT INTO tasks (id, project_id, title, status)
SELECT
  gen_random_uuid(),
  id,
  'Initial Task',
  'open'
FROM projects
LIMIT 1;
