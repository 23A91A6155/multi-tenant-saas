const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

/**
 * API 16: Create Task
 * POST /api/projects/:projectId/tasks
 */
exports.createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status = "todo" } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required"
      });
    }

    const taskId = uuidv4();

    const result = await pool.query(
      `
      INSERT INTO tasks (id, project_id, title, description, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, project_id, title, description, status, created_at
      `,
      [taskId, projectId, title, description || null, status]
    );

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: result.rows[0]
    });

  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/**
 * API 17: List Tasks
 * GET /api/projects/:projectId/tasks
 */
exports.listTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const result = await pool.query(
      `
      SELECT id, title, description, status, created_at
      FROM tasks
      WHERE project_id = $1
      ORDER BY created_at DESC
      `,
      [projectId]
    );

    return res.json({
      success: true,
      data: result.rows
    });

  } catch (err) {
    console.error("LIST TASKS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/**
 * API 18: Update Task
 * PUT /api/tasks/:taskId
 */
exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, status } = req.body;

    const result = await pool.query(
      `
      UPDATE tasks
      SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        status = COALESCE($3, status),
        updated_at = NOW()
      WHERE id = $4
      RETURNING id, title, description, status, updated_at
      `,
      [title || null, description || null, status || null, taskId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    return res.json({
      success: true,
      message: "Task updated successfully",
      data: result.rows[0]
    });

  } catch (err) {
    console.error("UPDATE TASK ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/**
 * API 19: Delete Task
 * DELETE /api/tasks/:taskId
 */
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const result = await pool.query(
      `
      DELETE FROM tasks
      WHERE id = $1
      RETURNING id
      `,
      [taskId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    return res.json({
      success: true,
      message: "Task deleted successfully"
    });

  } catch (err) {
    console.error("DELETE TASK ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
