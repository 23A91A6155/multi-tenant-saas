const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const user = req.user;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Project name is required"
      });
    }

    const projectId = uuidv4();

    // ✅ CORRECT QUERY (NO created_by)
    const result = await pool.query(
      `
      INSERT INTO projects (id, tenant_id, name, description)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, description, tenant_id, created_at
      `,
      [
        projectId,
        user.tenantId,
        name,
        description || null
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        description: result.rows[0].description,
        tenantId: result.rows[0].tenant_id,
        createdAt: result.rows[0].created_at
      }
    });

  } catch (error) {
    console.error("CREATE PROJECT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
/**
 * API 15: Update Project
 * PUT /api/projects/:projectId
 */
exports.updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description } = req.body;
    const user = req.user;

    // 🔐 Only tenant_admin allowed
    if (user.role !== "tenant_admin") {
      return res.status(403).json({
        success: false,
        message: "Only tenant admin can update project"
      });
    }

    // ❌ Nothing to update
    if (!name && !description) {
      return res.status(400).json({
        success: false,
        message: "No fields to update"
      });
    }

    const fields = [];
    const values = [];
    let index = 1;

    if (name) {
      fields.push(`name = $${index++}`);
      values.push(name);
    }

    if (description) {
      fields.push(`description = $${index++}`);
      values.push(description);
    }

    values.push(projectId);
    values.push(user.tenantId);

    const query = `
      UPDATE projects
      SET ${fields.join(", ")}, updated_at = NOW()
      WHERE id = $${index++} AND tenant_id = $${index}
      RETURNING id, name, description, updated_at
    `;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    return res.json({
      success: true,
      message: "Project updated successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("UPDATE PROJECT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


/**
 * API 13: List Projects (Tenant Scoped)
 * GET /api/projects
 */
exports.listProjects = async (req, res) => {
  try {
    const user = req.user;

    const result = await pool.query(
      `
      SELECT 
        id,
        name,
        description,
        tenant_id,
        created_at
      FROM projects
      WHERE tenant_id = $1
      ORDER BY created_at DESC
      `,
      [user.tenantId]
    );

    return res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error("LIST PROJECTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
/**
 * API: Delete Project
 * DELETE /api/projects/:projectId
 */
exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const user = req.user;

    // 🔐 Only tenant_admin or super_admin
    if (!["tenant_admin", "super_admin"].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    // 🔐 Tenant isolation
    const result = await pool.query(
      `
      DELETE FROM projects
      WHERE id = $1 AND tenant_id = $2
      RETURNING id
      `,
      [projectId, user.tenantId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    return res.json({
      success: true,
      message: "Project deleted successfully"
    });

  } catch (err) {
    console.error("DELETE PROJECT ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
