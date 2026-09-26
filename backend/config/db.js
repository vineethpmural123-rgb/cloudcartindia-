const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "cloudcart_app",
  password: process.env.DB_PASSWORD || "Appu@123",
  database: process.env.DB_NAME || "cloudcart",
  port: process.env.DB_PORT || 3306,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;