const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  createTask,
  listTasks,
  updateTask,
  deleteTask
} = require("../controllers/taskController");

router.post("/projects/:projectId/tasks", auth, createTask);
router.get("/projects/:projectId/tasks", auth, listTasks);
router.put("/tasks/:taskId", auth, updateTask);
router.delete("/tasks/:taskId", auth, deleteTask);

module.exports = router;
