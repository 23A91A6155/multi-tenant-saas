const { v4: uuidv4 } = require("uuid");
const { generateToken } = require("../utils/jwt");
const bcrypt = require("bcryptjs");

/**
 * API 1: Register Tenant
 */
exports.registerTenant = async (req, res) => {
  const { tenantName, subdomain, adminEmail, adminPassword, adminFullName } = req.body;

  if (!tenantName || !subdomain || !adminEmail || !adminPassword || !adminFullName) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  return res.status(201).json({
    success: true,
    message: "Tenant registered successfully",
    data: {
      tenantId: uuidv4(),
      subdomain,
      adminUser: {
        id: uuidv4(),
        email: adminEmail,
        fullName: adminFullName,
        role: "tenant_admin"
      }
    }
  });
};

/**
 * API 2: Login
 */
const pool = require("../config/db");

exports.login = async (req, res) => {
  try {
    const { email, password, subdomain } = req.body;

    if (!email || !password || !subdomain) {
      return res.status(400).json({
        success: false,
        message: "Email, password and subdomain are required"
      });
    }

    const result = await pool.query(
      `
      SELECT 
        u.id,
        u.email,
        u.password,
        u.role,
        u.tenant_id,
        t.subdomain
      FROM users u
      JOIN tenants t ON u.tenant_id = t.id
      WHERE u.email = $1 AND t.subdomain = $2
      `,
      [email, subdomain]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = generateToken({
  userId: user.id,
  email: user.email,
  role: user.role,
  tenantId: user.tenant_id
});

    return res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          tenantId: user.tenant_id,
          subdomain: user.subdomain
        }
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};



/**
 * API 3: Get Current User
 */
exports.getCurrentUser = async (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.user.userId,
      email: req.user.email,
      fullName: "Demo Admin",
      role: req.user.role,
      isActive: true,
      tenant: {
        id: req.user.tenantId,
        name: "Demo Company",
        subdomain: "demo",
        subscriptionPlan: "free",
        maxUsers: 5,
        maxProjects: 5
      }
    }
  });
};

/**
 * API 4: Logout
 */
exports.logout = async (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully"
  });
};
