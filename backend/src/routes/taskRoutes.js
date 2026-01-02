const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const taskController = require("../controllers/taskController");

// Create task under project
router.post(
  "/projects/:projectId/tasks",
  auth,
  taskController.createTask
);

// Get tasks for project
router.get(
  "/projects/:projectId/tasks",
  auth,
  taskController.getTasksByProject
);

// Update task
router.put(
  "/tasks/:taskId",
  auth,
  taskController.updateTask
);

// Delete task
router.delete(
  "/tasks/:taskId",
  auth,
  taskController.deleteTask
);
router.use((req, res, next) => {
  console.log("TASK ROUTE HIT:", req.method, req.originalUrl);
  next();
});

module.exports = router;
