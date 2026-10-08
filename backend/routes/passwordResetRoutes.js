const express = require("express");

const {
  sendForgotPasswordOTP,
  verifyOTP,
  resetPassword,
} = require("../controllers/passwordResetController");

const router = express.Router();

router.post(
  "/forgot-password",
  sendForgotPasswordOTP
);

router.post(
  "/verify-reset-otp",
  verifyOTP
);

router.post(
  "/reset-password",
  resetPassword
);

module.exports = router;
