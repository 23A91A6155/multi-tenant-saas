const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

/**
 * API 8: Add User to Tenant
 * POST /api/tenants/:tenantId/users
 */
exports.addUserToTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { email, password, fullName, role = "user" } = req.body;
    const loggedInUser = req.user;

    // 🔐 Only tenant_admin allowed
    if (loggedInUser.role !== "tenant_admin") {
      return res.status(403).json({
        success: false,
        message: "Only tenant admin can add users"
      });
    }

    // 🔐 Must belong to same tenant
    if (loggedInUser.tenantId !== tenantId) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    // ✅ Validation
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // ✅ Get tenant max users
    const tenantResult = await pool.query(
      `SELECT max_users FROM tenants WHERE id = $1`,
      [tenantId]
    );

    if (tenantResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found"
      });
    }

    const maxUsers = tenantResult.rows[0].max_users;

    // ✅ Current user count
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM users WHERE tenant_id = $1`,
      [tenantId]
    );

    if (Number(countResult.rows[0].count) >= maxUsers) {
      return res.status(403).json({
        success: false,
        message: "Subscription user limit reached"
      });
    }

    // ✅ Email unique per tenant
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

    // ✅ Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

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

  } catch (err) {
    console.error("ADD USER ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
exports.listUsersByTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;

    // 🔐 Only tenant admin
    if (req.user.role !== "tenant_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    const result = await pool.query(
      `
      SELECT id, email, full_name, role, is_active, created_at
      FROM users
      WHERE tenant_id = $1
      ORDER BY created_at DESC
      `,
      [tenantId]
    );

    return res.json({
      success: true,
      data: result.rows
    });

  } catch (err) {
    console.error("LIST USERS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
/**
 * API 10: Update User
 * PUT /api/users/:userId
 */
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const loggedInUser = req.user;
    const { fullName, role, isActive } = req.body;

    // Fetch target user
    const userResult = await pool.query(
      `SELECT id, tenant_id, role FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const targetUser = userResult.rows[0];

    // Must belong to same tenant
    if (loggedInUser.tenantId !== targetUser.tenant_id) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    // Permission rules
    if (
      loggedInUser.role !== "tenant_admin" &&
      loggedInUser.userId !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    // Only tenant_admin can update role / isActive
    if (loggedInUser.role !== "tenant_admin" && (role || isActive !== undefined)) {
      return res.status(403).json({
        success: false,
        message: "Only tenant admin can update role or status"
      });
    }

    const fields = [];
    const values = [];
    let idx = 1;

    if (fullName) {
      fields.push(`full_name = $${idx++}`);
      values.push(fullName);
    }
    if (role) {
      fields.push(`role = $${idx++}`);
      values.push(role);
    }
    if (isActive !== undefined) {
      fields.push(`is_active = $${idx++}`);
      values.push(isActive);
    }

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update"
      });
    }

    values.push(userId);

    const result = await pool.query(
      `
      UPDATE users
      SET ${fields.join(", ")}, updated_at = NOW()
      WHERE id = $${idx}
      RETURNING id, full_name, role, updated_at
      `,
      values
    );

    return res.json({
      success: true,
      message: "User updated successfully",
      data: {
        id: result.rows[0].id,
        fullName: result.rows[0].full_name,
        role: result.rows[0].role,
        updatedAt: result.rows[0].updated_at
      }
    });

  } catch (err) {
    console.error("UPDATE USER ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
/**
 * API 11: Delete User
 * DELETE /api/users/:userId
 */
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const loggedInUser = req.user;

    // 🔐 Only tenant_admin
    if (loggedInUser.role !== "tenant_admin") {
      return res.status(403).json({
        success: false,
        message: "Only tenant admin can delete users"
      });
    }

    // Fetch target user
    const userResult = await pool.query(
      `SELECT id, tenant_id, role FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const targetUser = userResult.rows[0];

    // 🔐 Same tenant check
    if (loggedInUser.tenantId !== targetUser.tenant_id) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    // Optional safety: prevent deleting tenant_admin
    if (targetUser.role === "tenant_admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot delete tenant admin"
      });
    }

    // ✅ Soft delete
    await pool.query(
      `UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1`,
      [userId]
    );

    return res.json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
