const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "database",   // 🔥 FIX
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "multitenant",
  port: 5432,
});

pool.on("connect", () => {
  console.log("✅ Database connected");
});

module.exports = pool;
