-- SUPER ADMIN (no tenant)
INSERT INTO users (email, password_hash, full_name, role)
VALUES (
  'superadmin@system.com',
  '$2b$10$abcdefghijklmnopqrstuv', -- bcrypt hash placeholder
  'System Admin',
  'super_admin'
);

-- DEMO TENANT
INSERT INTO tenants (name, subdomain, subscription_plan, max_users, max_projects)
VALUES ('Demo Company', 'demo', 'pro', 10, 20);

-- TENANT ADMIN
INSERT INTO users (tenant_id, email, password_hash, full_name, role)
SELECT id, 'admin@demo.com', '$2b$10$abcdefghijklmnopqrstuv', 'Demo Admin', 'tenant_admin'
FROM tenants WHERE subdomain='demo';
