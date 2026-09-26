const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const transporter = require("../config/email");
const db = require("../config/db");

// ======================================================
// 1. SEND OTP
// POST /api/auth/forgot-password
// ======================================================

const sendForgotPasswordOTP = async (req, res) => {
  try {
    const { email, userType } = req.body;

    if (!email || !userType) {
      return res.status(400).json({
        message: "Email and user type are required.",
      });
    }

    if (!["customer", "seller"].includes(userType)) {
      return res.status(400).json({
        message: "Invalid user type.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // ==================================================
    // FIND USER IN MYSQL
    // ==================================================

    const [users] = await db.query(
      `
      SELECT id, name, email, role
      FROM users
      WHERE email = ?
        AND role = ?
      LIMIT 1
      `,
      [normalizedEmail, userType]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "No account found with this email.",
      });
    }

    // ==================================================
    // GENERATE 6 DIGIT OTP
    // ==================================================

    const otp = crypto
      .randomInt(100000, 1000000)
      .toString();

    // Hash OTP
    const otpHash = await bcrypt.hash(otp, 10);

    // OTP valid for 10 minutes
    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // ==================================================
    // DELETE OLD OTP
    // ==================================================

    await db.query(
      `
      DELETE FROM password_resets
      WHERE email = ?
        AND user_type = ?
      `,
      [normalizedEmail, userType]
    );

    // ==================================================
    // SAVE NEW OTP
    // ==================================================

    await db.query(
      `
      INSERT INTO password_resets
      (
        email,
        user_type,
        otp_hash,
        expires_at,
        attempts
      )
      VALUES (?, ?, ?, ?, 0)
      `,
      [
        normalizedEmail,
        userType,
        otpHash,
        expiresAt,
      ]
    );

    // ==================================================
    // SEND EMAIL
    // ==================================================

    await transporter.sendMail({
      from: `"CloudCart" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject: "CloudCart Password Reset OTP",

      html: `
        <div style="font-family: Arial, sans-serif;">

          <h2>CloudCart Password Reset</h2>

          <p>Your password reset OTP is:</p>

          <h1 style="letter-spacing: 8px;">
            ${otp}
          </h1>

          <p>
            This OTP will expire in 10 minutes.
          </p>

          <p>
            If you did not request a password reset,
            you can safely ignore this email.
          </p>

        </div>
      `,
    });

    return res.status(200).json({
      message: "OTP sent successfully.",
    });

  } catch (error) {
    console.error(
      "Forgot password error:",
      error
    );

    return res.status(500).json({
      message: "Unable to send OTP.",
      error: error.message,
    });
  }
};


// ======================================================
// 2. VERIFY OTP
// POST /api/auth/verify-otp
// ======================================================

const verifyOTP = async (req, res) => {
  try {
    const {
      email,
      userType,
      otp,
    } = req.body;

    if (!email || !userType || !otp) {
      return res.status(400).json({
        message:
          "Email, user type and OTP are required.",
      });
    }

    if (!["customer", "seller"].includes(userType)) {
      return res.status(400).json({
        message: "Invalid user type.",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    // ==================================================
    // GET OTP FROM MYSQL
    // ==================================================

    const [rows] = await db.query(
      `
      SELECT *
      FROM password_resets
      WHERE email = ?
        AND user_type = ?
      ORDER BY id DESC
      LIMIT 1
      `,
      [normalizedEmail, userType]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        message:
          "OTP not found or already expired.",
      });
    }

    const resetRequest = rows[0];

    // ==================================================
    // CHECK EXPIRATION
    // ==================================================

    if (
      new Date(resetRequest.expires_at).getTime() <
      Date.now()
    ) {
      await db.query(
        `
        DELETE FROM password_resets
        WHERE id = ?
        `,
        [resetRequest.id]
      );

      return res.status(400).json({
        message: "OTP has expired.",
      });
    }

    // ==================================================
    // MAXIMUM 5 ATTEMPTS
    // ==================================================

    if (resetRequest.attempts >= 5) {
      await db.query(
        `
        DELETE FROM password_resets
        WHERE id = ?
        `,
        [resetRequest.id]
      );

      return res.status(429).json({
        message:
          "Too many incorrect attempts. Please request a new OTP.",
      });
    }

    // ==================================================
    // COMPARE OTP
    // ==================================================

    const validOTP = await bcrypt.compare(
      otp.toString(),
      resetRequest.otp_hash
    );

    if (!validOTP) {
      await db.query(
        `
        UPDATE password_resets
        SET attempts = attempts + 1
        WHERE id = ?
        `,
        [resetRequest.id]
      );

      return res.status(400).json({
        message: "Invalid OTP.",
      });
    }

    return res.status(200).json({
      message: "OTP verified successfully.",
      verified: true,
    });

  } catch (error) {
    console.error(
      "OTP verification error:",
      error
    );

    return res.status(500).json({
      message: "Unable to verify OTP.",
      error: error.message,
    });
  }
};


// ======================================================
// 3. RESET PASSWORD
// POST /api/auth/reset-password
// ======================================================

const resetPassword = async (req, res) => {
  try {
    const {
      email,
      userType,
      otp,
      newPassword,
    } = req.body;

    if (
      !email ||
      !userType ||
      !otp ||
      !newPassword
    ) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    if (!["customer", "seller"].includes(userType)) {
      return res.status(400).json({
        message: "Invalid user type.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message:
          "Password must contain at least 8 characters.",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    // ==================================================
    // GET OTP
    // ==================================================

    const [rows] = await db.query(
      `
      SELECT *
      FROM password_resets
      WHERE email = ?
        AND user_type = ?
      ORDER BY id DESC
      LIMIT 1
      `,
      [normalizedEmail, userType]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        message: "OTP not found or expired.",
      });
    }

    const resetRequest = rows[0];

    // ==================================================
    // CHECK EXPIRATION
    // ==================================================

    if (
      new Date(resetRequest.expires_at).getTime() <
      Date.now()
    ) {
      await db.query(
        `
        DELETE FROM password_resets
        WHERE id = ?
        `,
        [resetRequest.id]
      );

      return res.status(400).json({
        message: "OTP has expired.",
      });
    }

    // ==================================================
    // CHECK ATTEMPTS
    // ==================================================

    if (resetRequest.attempts >= 5) {
      await db.query(
        `
        DELETE FROM password_resets
        WHERE id = ?
        `,
        [resetRequest.id]
      );

      return res.status(429).json({
        message:
          "Too many incorrect attempts. Please request a new OTP.",
      });
    }

    // ==================================================
    // VERIFY OTP
    // ==================================================

    const validOTP = await bcrypt.compare(
      otp.toString(),
      resetRequest.otp_hash
    );

    if (!validOTP) {
      await db.query(
        `
        UPDATE password_resets
        SET attempts = attempts + 1
        WHERE id = ?
        `,
        [resetRequest.id]
      );

      return res.status(400).json({
        message: "Invalid OTP.",
      });
    }

    // ==================================================
    // HASH NEW PASSWORD
    // ==================================================

    const hashedPassword = await bcrypt.hash(
      newPassword,
      12
    );

    // ==================================================
    // UPDATE MYSQL USERS TABLE
    // ==================================================

    const [result] = await db.query(
      `
      UPDATE users
      SET password = ?
      WHERE email = ?
        AND role = ?
      `,
      [
        hashedPassword,
        normalizedEmail,
        userType,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // ==================================================
    // DELETE USED OTP
    // ==================================================

    await db.query(
      `
      DELETE FROM password_resets
      WHERE id = ?
      `,
      [resetRequest.id]
    );

    return res.status(200).json({
      message:
        "Password reset successfully.",
    });

  } catch (error) {
    console.error(
      "Reset password error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to reset password.",
      error: error.message,
    });
  }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
  sendForgotPasswordOTP,
  verifyOTP,
  resetPassword,
};