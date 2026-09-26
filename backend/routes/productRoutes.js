const express = require("express");

const {
  addProduct,
  getProducts,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getPendingProducts,
  approveProduct,
  rejectProduct,
} = require("../controllers/productController");

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const roleMiddleware = require(
  "../middleware/roleMiddleware"
);

const router = express.Router();
// =====================================================
// GET ALL PRODUCTS
// PUBLIC - CUSTOMER CAN SEE ALL SELLERS' PRODUCTS
// =====================================================

router.get(
  "/",
  getProducts
);


// =====================================================
// GET MY PRODUCTS
// SELLER ONLY
// IMPORTANT: MUST BE BEFORE "/:id"
// =====================================================

router.get(
  "/my-products",
  authMiddleware,
  roleMiddleware("seller", "admin"),
  getMyProducts
);
// =====================================================
// GET PENDING PRODUCTS
// ADMIN ONLY
// =====================================================

router.get(
  "/pending",
  authMiddleware,
  roleMiddleware("admin"),
  getPendingProducts
);




// =====================================================
// APPROVE PRODUCT
// ADMIN ONLY
// =====================================================

router.put(
  "/:id/approve",
  authMiddleware,
  roleMiddleware("admin"),
  approveProduct
);


// =====================================================
// REJECT PRODUCT
// ADMIN ONLY
// =====================================================

router.put(
  "/:id/reject",
  authMiddleware,
  roleMiddleware("admin"),
  rejectProduct
);




// =====================================================
// GET SINGLE PRODUCT
// PUBLIC
// =====================================================

router.get(
  "/:id",
  getProductById
);


// =====================================================
// ADD PRODUCT
// SELLER ONLY
// =====================================================
router.post(
  "/",
  authMiddleware,
  roleMiddleware("seller", "admin"),
  addProduct
);


// =====================================================
// UPDATE PRODUCT
// SELLER ONLY
// =====================================================

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("seller", "admin"),
  updateProduct
);


// =====================================================
// DELETE PRODUCT
// SELLER ONLY
// =====================================================

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("seller", "admin"),
  deleteProduct
);


module.exports = router;