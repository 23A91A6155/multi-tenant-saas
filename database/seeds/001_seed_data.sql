-- SUPER ADMIN
INSERT INTO users (id, email, password, full_name, role)
VALUES (
  gen_random_uuid(),
  'superadmin@system.com',
  '$2b$10$C1zP8ZQ9QvJ4bC2m2n9v1uY0RZ5hQmWZ5Z7b2z2Y0qjz3k7jK8e9K',
  'Super Admin',
  'super_admin'
);

-- TENANT
INSERT INTO tenants (id, name, subdomain)
VALUES (
  gen_random_uuid(),
  'Company One',
  'companyone'
);

-- TENANT ADMIN
INSERT INTO users (id, tenant_id, email, password, full_name, role)
SELECT
  gen_random_uuid(),
  id,
  'admin@companyone.com',
  '$2b$10$C1zP8ZQ9QvJ4bC2m2n9v1uY0RZ5hQmWZ5Z7b2z2Y0qjz3k7jK8e9K',
  'Company Admin',
  'tenant_admin'
FROM tenants WHERE subdomain='companyone';
