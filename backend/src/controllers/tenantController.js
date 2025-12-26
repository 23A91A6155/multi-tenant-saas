const pool = require("../config/db");

/**
 * API 5: Get Tenant By ID
 */
exports.getTenantById = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const user = req.user;

    if (user.role !== "super_admin" && user.tenantId !== tenantId) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    const result = await pool.query(
      `
      SELECT id, name, subdomain, subscription_plan, max_users, max_projects
      FROM tenants
      WHERE id = $1
      `,
      [tenantId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found"
      });
    }

    return res.json({
      success: true,
      data: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        subdomain: result.rows[0].subdomain,
        subscriptionPlan: result.rows[0].subscription_plan,
        maxUsers: result.rows[0].max_users,
        maxProjects: result.rows[0].max_projects
      }
    });
  } catch (err) {
    console.error("GET TENANT ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/**
 * API 6: Update Tenant
 */
exports.updateTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const user = req.user;
    const { name, status, subscriptionPlan, maxUsers, maxProjects } = req.body;

    // tenant_admin can ONLY update name
    if (user.role === "tenant_admin") {
      if (!name || status || subscriptionPlan || maxUsers || maxProjects) {
        return res.status(403).json({
          success: false,
          message: "Tenant admin can only update name"
        });
      }
    }

    // Nothing to update
    if (!name && !status && !subscriptionPlan && !maxUsers && !maxProjects) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update"
      });
    }

    const fields = [];
    const values = [];
    let idx = 1;

    if (name) {
      fields.push(`name = $${idx++}`);
      values.push(name);
    }
    if (status) {
      fields.push(`status = $${idx++}`);
      values.push(status);
    }
    if (subscriptionPlan) {
      fields.push(`subscription_plan = $${idx++}`);
      values.push(subscriptionPlan);
    }
    if (maxUsers) {
      fields.push(`max_users = $${idx++}`);
      values.push(maxUsers);
    }
    if (maxProjects) {
      fields.push(`max_projects = $${idx++}`);
      values.push(maxProjects);
    }

    values.push(tenantId);

    const query = `
      UPDATE tenants
      SET ${fields.join(", ")}, updated_at = NOW()
      WHERE id = $${idx}
      RETURNING id, name, updated_at
    `;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found"
      });
    }

    return res.json({
      success: true,
      message: "Tenant updated successfully",
      data: result.rows[0]
    });

  } catch (err) {
    console.error("UPDATE TENANT ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/**
 * API 7: List All Tenants (super_admin)
 */
exports.listTenants = async (req, res) => {
  try {
    if (req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Not super_admin"
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { status, subscriptionPlan } = req.query;

    let where = [];
    let values = [];
    let index = 1;

    if (status) {
      where.push(`status = $${index++}`);
      values.push(status);
    }

    if (subscriptionPlan) {
      where.push(`subscription_plan = $${index++}`);
      values.push(subscriptionPlan);
    }

    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM tenants ${whereClause}`,
      values
    );

    const totalTenants = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalTenants / limit);

    const tenantsResult = await pool.query(
      `
      SELECT 
        t.id,
        t.name,
        t.subdomain,
        t.status,
        t.subscription_plan,
        t.created_at,
        (SELECT COUNT(*) FROM users u WHERE u.tenant_id = t.id) AS total_users,
        (SELECT COUNT(*) FROM projects p WHERE p.tenant_id = t.id) AS total_projects
      FROM tenants t
      ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT $${index++} OFFSET $${index}
      `,
      [...values, limit, offset]
    );

    return res.json({
      success: true,
      data: {
        tenants: tenantsResult.rows.map(t => ({
          id: t.id,
          name: t.name,
          subdomain: t.subdomain,
          status: t.status,
          subscriptionPlan: t.subscription_plan,
          totalUsers: Number(t.total_users),
          totalProjects: Number(t.total_projects),
          createdAt: t.created_at
        })),
        pagination: {
          currentPage: page,
          totalPages,
          totalTenants,
          limit
        }
      }
    });

  } catch (error) {
    console.error("LIST TENANTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

/**
 * API 8: Add User to Tenant
 */
exports.addUserToTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { email, password, fullName, role = "user" } = req.body;
    const user = req.user;

    // 🔐 Only tenant_admin
    if (user.role !== "tenant_admin") {
      return res.status(403).json({
        success: false,
        message: "Only tenant admin can add users"
      });
    }

    // 🔐 Tenant isolation
    if (user.tenantId !== tenantId) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    // ✅ Validate input
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: "Email, password and fullName are required"
      });
    }

    // 🔍 Check user limit
    const limitResult = await pool.query(
      `SELECT max_users FROM tenants WHERE id = $1`,
      [tenantId]
    );

    const maxUsers = limitResult.rows[0].max_users;

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM users WHERE tenant_id = $1`,
      [tenantId]
    );

    if (parseInt(countResult.rows[0].count) >= maxUsers) {
      return res.status(403).json({
        success: false,
        message: "User limit reached"
      });
    }

    // 🔍 Check email uniqueness per tenant
    const existingUser = await pool.query(
      `SELECT id FROM users WHERE tenant_id = $1 AND email = $2`,
      [tenantId, email]
    );

    if (existingUser.rowCount > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already exists in this tenant"
      });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    // ➕ Insert user
    const result = await pool.query(
      `
      INSERT INTO users (id, tenant_id, email, password, full_name, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, full_name, role, tenant_id, is_active, created_at
      `,
      [userId, tenantId, email, hashedPassword, fullName, role]
    );

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: result.rows[0].id,
        email: result.rows[0].email,
        fullName: result.rows[0].full_name,
        role: result.rows[0].role,
        tenantId: result.rows[0].tenant_id,
        isActive: result.rows[0].is_active,
        createdAt: result.rows[0].created_at
      }
    });

  } catch (error) {
    console.error("ADD USER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
