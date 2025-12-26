const { verifyToken } = require("../utils/jwt");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("AUTH HEADER:", req.headers.authorization);

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Authorization token missing"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};
