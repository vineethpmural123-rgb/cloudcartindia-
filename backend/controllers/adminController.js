const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ========================================
// ADMIN REGISTER
// ========================================

// ========================================
// ADMIN REGISTER
// ========================================

const registerAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    // ========================================
    // VALIDATION
    // ========================================

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters.",
      });
    }

    const cleanEmail =
      email.trim().toLowerCase();

    // ========================================
    // CHECK EXISTING ADMIN
    // ========================================

    const [existingAdmins] =
      await db.query(
        `
        SELECT id
        FROM users
        WHERE email = ?
          AND role = 'admin'
        `,
        [cleanEmail]
      );

    if (existingAdmins.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "Admin account already exists with this email.",
      });
    }

    // ========================================
    // HASH PASSWORD
    // ========================================

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // ========================================
    // CREATE ADMIN IN USERS TABLE
    // ========================================

    const [result] =
      await db.query(
        `
        INSERT INTO users
        (
          name,
          email,
          password,
          role,
          status
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          name.trim(),
          cleanEmail,
          hashedPassword,
          "admin",
          "Active",
        ]
      );

    return res.status(201).json({
      success: true,
      message:
        "Admin account created successfully.",
      adminId: result.insertId,
    });

  } catch (error) {
    console.error(
      "Admin register error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create admin account.",
      error: error.message,
    });
  }
};

// ========================================
// ADMIN LOGIN
// ========================================

const loginAdmin = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // ========================================
    // VALIDATION
    // ========================================

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    const cleanEmail =
      email.trim().toLowerCase();

    // ========================================
    // FIND ADMIN
    // ========================================

   const [admins] =
  await db.query(
    `
    SELECT *
    FROM users
    WHERE email = ?
      AND role = 'admin'
    `,
    [cleanEmail]
  );
    if (admins.length === 0) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    const admin = admins[0];
    console.log("ADMIN FOUND:", admin.email);
console.log("ADMIN STATUS:", admin.status);
    // ========================================
    // CHECK STATUS
    // ========================================

    if (admin.status !== "Active") {
      return res.status(403).json({
        success: false,
        message:
          "Admin account is not active.",
      });
    }

    // ========================================
    // CHECK PASSWORD
    // ========================================

    const passwordMatch =
      await bcrypt.compare(
        password,
        admin.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // ========================================
    // CREATE JWT TOKEN
    // ========================================

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: "admin",
      },
      process.env.JWT_SECRET ||
        "cloudcart_secret_key",
      {
        expiresIn: "1d",
      }
    );

    // ========================================
    // REMOVE PASSWORD
    // ========================================

    delete admin.password;

    // ========================================
    // RESPONSE
    // ========================================

    return res.json({
      success: true,
      message:
        "Admin login successful.",
      token,
      admin,
    });

  } catch (error) {
    console.error(
      "Admin login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Admin login failed.",
      error: error.message,
    });
  }
};

// ========================================
// GET PENDING PRODUCTS
// ========================================

const getPendingProducts = async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT 
        p.*,
        s.name AS sellerName
      FROM products p
      LEFT JOIN sellers s ON p.seller_id = s.id
      WHERE p.status = 'Pending'
      ORDER BY p.id DESC
    `);

    return res.json({
      success: true,
      products,
    });

  } catch (error) {
    console.error("Get pending products error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get pending products.",
    });
  }
};


// ========================================
// APPROVE PRODUCT
// ========================================

const approveProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `
      UPDATE products
      SET status = 'Approved'
      WHERE id = ?
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.json({
      success: true,
      message: "Product approved successfully.",
    });

  } catch (error) {
    console.error("Approve product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to approve product.",
    });
  }
};


// ========================================
// REJECT PRODUCT
// ========================================

const rejectProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `
      UPDATE products
      SET status = 'Rejected'
      WHERE id = ?
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.json({
      success: true,
      message: "Product rejected.",
    });

  } catch (error) {
    console.error("Reject product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject product.",
    });
  }
};

// ========================================
// GET ALL PRODUCTS
// ========================================

const getAllProducts = async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT
        p.*,
        s.name AS sellerName
      FROM products p
      LEFT JOIN sellers s ON p.seller_id = s.id
      ORDER BY p.id DESC
    `);

    return res.json({
      success: true,
      products,
    });

  } catch (error) {
    console.error("Get products error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get products.",
    });
  }
};

// ========================================
// GET ALL CUSTOMERS
// ========================================




const getAllCustomers = async (req, res) => {
  try {
    const [customers] = await db.query(`
      SELECT
        u.id,
        u.name,
        u.email,
        u.phone,
        u.status,
        COUNT(o.id) AS totalOrders,
        COALESCE(SUM(o.total_amount), 0) AS totalSpent
      FROM users u
      LEFT JOIN orders o
        ON o.user_id = u.id
      WHERE u.role = 'customer'
      GROUP BY
        u.id,
        u.name,
        u.email,
        u.phone,
        u.status
    `);

    return res.json({
      success: true,
      customers,
    });

  } catch (error) {
    console.error("Get customers error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get customers.",
      error: error.message,
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAllProducts,
  getPendingProducts,
  approveProduct,
  rejectProduct,
  getAllCustomers,
};