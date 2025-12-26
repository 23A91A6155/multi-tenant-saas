const router = require("express").Router();
const auth = require("../middleware/authMiddleware");

const {
  addUserToTenant,
  listUsersByTenant,
  updateUser,
  deleteUser        // 👈 ADD
} = require("../controllers/userController");

// API 8
router.post("/tenants/:tenantId/users", auth, addUserToTenant);

// API 9
router.get("/tenants/:tenantId/users", auth, listUsersByTenant);

// API 10
router.put("/users/:userId", auth, updateUser);

// ✅ API 11
router.delete("/users/:userId", auth, deleteUser);

module.exports = router;
