const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/authController");

router.post("/register-tenant", controller.registerTenant);
router.post("/login", controller.login);
router.get("/me", auth, controller.getCurrentUser);
router.post("/logout", auth, controller.logout);

module.exports = router;
