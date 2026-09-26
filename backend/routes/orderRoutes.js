const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");



const router = express.Router();


// =====================================================
// CREATE ORDER
// CUSTOMER ONLY
// =====================================================

router.post(
  "/",
  authMiddleware,
  roleMiddleware("customer"),
  createOrder
);


// =====================================================
// GET ALL ORDERS
// AUTHENTICATED USERS
// =====================================================

router.get(
  "/",
  authMiddleware,
  getOrders
);


// =====================================================
// GET SINGLE ORDER
// AUTHENTICATED USERS
// =====================================================

router.get(
  "/:id",
  authMiddleware,
  getOrderById
);


// =====================================================
// CANCEL ORDER
// CUSTOMER ONLY
// =====================================================

router.put(
  "/:id/cancel",
  authMiddleware,
  roleMiddleware("customer"),
  cancelOrder
);


// =====================================================
// UPDATE ORDER STATUS
// SELLER ONLY
// =====================================================

router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware("admin"),
  updateOrderStatus
);


module.exports = router;