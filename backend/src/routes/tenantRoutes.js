const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  getTenantById,
  updateTenant,
  listTenants,
  addUserToTenant
} = require("../controllers/tenantController");

// API 7: List all tenants (super_admin)
router.get("/", auth, listTenants);

// API 5: Get tenant by ID
router.get("/:tenantId", auth, getTenantById);

// API 6: Update tenant
router.put("/:tenantId", auth, updateTenant);

// ✅ API 8: Add user to tenant (tenant_admin)
router.post("/:tenantId/users", auth, addUserToTenant);

module.exports = router;
