const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createProject,
  listProjects,
  updateProject,
  deleteProject
} = require("../controllers/projectController");

// API 12 – Create project
router.post("/", auth, createProject);

// API 13 – List projects
router.get("/", auth, listProjects);
// API 14 ✅
router.put("/:projectId", auth, updateProject);
// API 15 ✅ DELETE PROJECT
router.delete("/:projectId", auth, deleteProject);

module.exports = router;
