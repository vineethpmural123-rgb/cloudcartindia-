const express = require("express");

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  createPaymentOrder,
  verifyPayment,
} = require(
  "../controllers/paymentController"
);

const router = express.Router();


// =====================================================
// CREATE RAZORPAY PAYMENT ORDER
// =====================================================

router.post(
  "/create-order",
  authMiddleware,
  createPaymentOrder
);


// =====================================================
// VERIFY RAZORPAY PAYMENT
// =====================================================

router.post(
  "/verify",
  authMiddleware,
  verifyPayment
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;