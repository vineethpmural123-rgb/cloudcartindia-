const express = require("express");

const db = require("../config/db");

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const roleMiddleware = require(
  "../middleware/roleMiddleware"
);

const router = express.Router();


// ========================================
// GET CUSTOMER PROFILE
// ========================================

router.get(
  "/profile",

  authMiddleware,

  roleMiddleware("customer"),

  async (req, res) => {
    try {

      const [users] = await db.query(
        `
        SELECT
          id,
          name,
          email,
          role,
          status
        FROM users
        WHERE id = ?
        `,
        [req.user.id]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Customer not found.",
        });
      }

      return res.json({
        success: true,
        user: users[0],
      });

    } catch (error) {

      console.error(
        "Get customer profile error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to get customer profile.",
        error: error.message,
      });

    }
  }
);


// ========================================
// GET ALL CUSTOMERS - ADMIN ONLY
// ========================================

router.get(
  "/",

  authMiddleware,

  roleMiddleware("admin"),

  async (req, res) => {

    try {

      const [customers] = await db.query(`
        SELECT
          u.id,
          u.name,
          u.email,
          u.role,
          u.status,

          COUNT(o.id) AS totalOrders,

          COALESCE(
            SUM(o.total_amount),
            0
          ) AS totalSpent

        FROM users u

        LEFT JOIN orders o
          ON o.customer_id = u.id

        WHERE u.role = 'customer'

        GROUP BY
          u.id,
          u.name,
          u.email,
          u.role,
          u.status

        ORDER BY u.id DESC
      `);

      return res.json({
        success: true,
        customers,
      });

    } catch (error) {

      console.error(
        "Get customers error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to get customers.",
        error: error.message,
      });

    }

  }
);


module.exports = router;