const express = require("express");

const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  getAllProducts,
  getPendingProducts,
  approveProduct,
  rejectProduct,
  getAllCustomers,
} = require("../controllers/adminController");

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const roleMiddleware = require(
  "../middleware/roleMiddleware"
);

// ========================================
// ADMIN REGISTER
// ========================================

router.post(
  "/register",
  registerAdmin
);


// ========================================
// ADMIN LOGIN
// ========================================

router.post(
  "/login",
  loginAdmin
);


// ========================================
// GET ALL PRODUCTS
// ADMIN ONLY
// ========================================

router.get(
  "/products",
  authMiddleware,
  roleMiddleware("admin"),
  getAllProducts
);

// ========================================
// GET PENDING PRODUCTS
// ADMIN ONLY
// ========================================

router.get(
  "/products/pending",
  authMiddleware,
  roleMiddleware("admin"),
  getPendingProducts
);


// ========================================
// APPROVE PRODUCT
// ADMIN ONLY
// ========================================

router.put(
  "/products/:id/approve",
  authMiddleware,
  roleMiddleware("admin"),
  approveProduct
);


// ========================================
// REJECT PRODUCT
// ADMIN ONLY
// ========================================

router.put(
  "/products/:id/reject",
  authMiddleware,
  roleMiddleware("admin"),
  rejectProduct
);

// ========================================
// GET ALL CUSTOMERS
// ADMIN ONLY
// ========================================

router.get(
  "/customers",
  authMiddleware,
  roleMiddleware("admin"),
  getAllCustomers
);



module.exports = router;