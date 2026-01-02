const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");

/**
 * CREATE TASK
 * POST /api/projects/:projectId/tasks
 */
exports.createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, status = "todo" } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Task title is required"
      });
    }

    const result = await pool.query(
      `
      INSERT INTO tasks (id, project_id, title, status)
      VALUES (gen_random_uuid(), $1, $2, $3)
      RETURNING id, title, status, project_id, created_at
      `,
      [projectId, title, status]
    );

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: result.rows[0]
    });

  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
/**
 * LIST TASKS BY PROJECT
 * GET /api/projects/:projectId/tasks
 */
exports.getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM tasks
      WHERE project_id = $1
      ORDER BY created_at DESC
      `,
      [projectId]
    );

    res.json({
      success: true,
      data: result.rows
    });

  } catch (err) {
    console.error("LIST TASKS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/**
 * UPDATE TASK
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
        status = COALESCE($3, status)
      WHERE id = $4
      RETURNING *
      `,
      [title, description, status, taskId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {
    console.error("UPDATE TASK ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/**
 * DELETE TASK
 * DELETE /api/tasks/:taskId
 */
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const result = await pool.query(
      `DELETE FROM tasks WHERE id = $1`,
      [taskId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.json({
      success: true,
      message: "Task deleted successfully"
    });

  } catch (err) {
    console.error("DELETE TASK ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
