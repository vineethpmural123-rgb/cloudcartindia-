const express = require("express");

const bcrypt = require("bcryptjs");

const nodemailer = require("nodemailer");

const jwt = require("jsonwebtoken");

const db = require("../config/db");

const router = express.Router();

const { OAuth2Client } =
  require("google-auth-library");

const JWT_SECRET =
  process.env.JWT_SECRET || "cloudcart-secret";

const otpStore = new Map();

const transporter =
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID;

const googleClient =
  new OAuth2Client(
    GOOGLE_CLIENT_ID
  );


// ========================================
// CUSTOMER REGISTER - SEND OTP
// ========================================

router.post("/register", async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      phone,
    } = req.body;


    // VALIDATION

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


    const cleanName =
      name.trim();

    const cleanEmail =
      email.trim().toLowerCase();


    // CHECK EXISTING CUSTOMER

    const [existing] =
      await db.query(
        `
        SELECT id
        FROM users
        WHERE email = ?
        `,
        [cleanEmail]
      );


    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "Customer account already exists with this email.",
      });
    }


    // CREATE 6 DIGIT OTP

    const otp =
      Math.floor(
        100000 +
        Math.random() * 900000
      ).toString();


    // HASH PASSWORD

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );


    // STORE TEMPORARY REGISTRATION DATA

    otpStore.set(
      cleanEmail,
      {
        otp,
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
        phone:
          phone
            ? phone.trim()
            : null,

        expiresAt:
          Date.now() +
          10 * 60 * 1000,
      }
    );


    // SEND OTP EMAIL

    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: cleanEmail,

      subject:
        "CloudCart Email Verification OTP",

      text:
        `Your CloudCart verification code is: ${otp}. This code expires in 10 minutes.`,
    });


    return res.status(200).json({
      success: true,

      message:
        "OTP sent successfully to your email.",

      email: cleanEmail,
    });


  } catch (error) {

    console.error(
      "Register OTP error:",
      error
    );


    return res.status(500).json({
      success: false,

      message:
        "Failed to send OTP.",

      error: error.message,
    });

  }
});


// ========================================
// FORGOT PASSWORD - SEND RESET OTP
// ========================================

router.post(
  "/forgot-password",
  async (req, res) => {

    try {

      const {
        email,
        userType = "customer",
      } = req.body;


      if (!email) {
        return res.status(400).json({
          success: false,
          message:
            "Email is required.",
        });
      }


      const cleanEmail =
        email.trim().toLowerCase();


      // CUSTOMER PASSWORD RESET ONLY

      if (userType !== "customer") {
        return res.status(400).json({
          success: false,
          message:
            "Invalid user type.",
        });
      }


      // FIND CUSTOMER ACCOUNT

      const [users] =
        await db.query(
          `
          SELECT
            id,
            name,
            email,
            role,
            status
          FROM users
          WHERE email = ?
          AND role = 'customer'
          `,
          [cleanEmail]
        );


      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            "No customer account found with this email.",
        });
      }


      const user = users[0];


      // CHECK ACCOUNT STATUS

      if (
        user.status &&
        user.status !== "Active"
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Customer account is not active.",
        });
      }


      // CREATE 6 DIGIT RESET OTP

      const otp =
        Math.floor(
          100000 +
          Math.random() * 900000
        ).toString();


      // STORE RESET OTP

      otpStore.set(
        `reset:${cleanEmail}`,
        {
          otp,
          email: cleanEmail,
          userType: "customer",

          expiresAt:
            Date.now() +
            10 * 60 * 1000,
        }
      );


      // SEND RESET OTP EMAIL

      await transporter.sendMail({
        from:
          process.env.EMAIL_USER,

        to: cleanEmail,

        subject:
          "CloudCart Password Reset OTP",

        text:
          `Your CloudCart password reset OTP is: ${otp}. This code expires in 10 minutes.`,
      });


      return res.status(200).json({
        success: true,

        message:
          "OTP sent successfully to your email.",

        email: cleanEmail,
      });


    } catch (error) {

      console.error(
        "Forgot password OTP error:",
        error
      );


      return res.status(500).json({
        success: false,

        message:
          "Unable to send OTP.",

        error:
          error.message,
      });
    }
  }
);


// ========================================
// VERIFY PASSWORD RESET OTP
// ========================================

router.post(
  "/verify-reset-otp",
  async (req, res) => {

    try {

      const {
        email,
        otp,
      } = req.body;


      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message:
            "Email and OTP are required.",
        });
      }


      const cleanEmail =
        email.trim().toLowerCase();


      const resetData =
        otpStore.get(
          `reset:${cleanEmail}`
        );


      if (!resetData) {
        return res.status(400).json({
          success: false,
          message:
            "OTP not found. Please request a new OTP.",
        });
      }


      // CHECK OTP EXPIRY

      if (
        Date.now() >
        resetData.expiresAt
      ) {

        otpStore.delete(
          `reset:${cleanEmail}`
        );


        return res.status(400).json({
          success: false,
          message:
            "OTP has expired. Please request a new OTP.",
        });
      }


      // CHECK OTP

      if (
        resetData.otp !== otp
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid OTP.",
        });
      }


      return res.status(200).json({
        success: true,

        message:
          "OTP verified successfully.",
      });


    } catch (error) {

      console.error(
        "Password reset OTP verification error:",
        error
      );


      return res.status(500).json({
        success: false,

        message:
          "OTP verification failed.",

        error:
          error.message,
      });
    }
  }
);


// ========================================
// RESET PASSWORD
// ========================================

router.post(
  "/reset-password",
  async (req, res) => {

    try {

      const {
        email,
        otp,
        newPassword,
      } = req.body;


      if (
        !email ||
        !otp ||
        !newPassword
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Email, OTP and new password are required.",
        });
      }


      if (
        newPassword.length < 8
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Password must contain at least 8 characters.",
        });
      }


      const cleanEmail =
        email.trim().toLowerCase();


      const resetData =
        otpStore.get(
          `reset:${cleanEmail}`
        );


      if (!resetData) {
        return res.status(400).json({
          success: false,

          message:
            "OTP not found. Please request a new OTP.",
        });
      }


      // CHECK OTP EXPIRY

      if (
        Date.now() >
        resetData.expiresAt
      ) {

        otpStore.delete(
          `reset:${cleanEmail}`
        );


        return res.status(400).json({
          success: false,

          message:
            "OTP has expired. Please request a new OTP.",
        });
      }


      // CHECK OTP

      if (
        resetData.otp !== otp
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Invalid OTP.",
        });
      }


      // HASH NEW PASSWORD

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );


      // UPDATE CUSTOMER PASSWORD

      const [result] =
        await db.query(
          `
          UPDATE users
          SET password = ?
          WHERE email = ?
          AND role = 'customer'
          `,
          [
            hashedPassword,
            cleanEmail,
          ]
        );


      if (
        result.affectedRows === 0
      ) {
        return res.status(404).json({
          success: false,

          message:
            "Customer account not found.",
        });
      }


      // REMOVE USED OTP

      otpStore.delete(
        `reset:${cleanEmail}`
      );


      return res.status(200).json({
        success: true,

        message:
          "Password changed successfully.",
      });


    } catch (error) {

      console.error(
        "Reset password error:",
        error
      );


      return res.status(500).json({
        success: false,

        message:
          "Unable to reset password.",
      });
    }
  }
);


// ========================================
// VERIFY EMAIL OTP
// ========================================

router.post(
  "/verify-otp",
  async (req, res) => {

    try {

      const {
        email,
        otp,
      } = req.body;


      if (!email || !otp) {
        return res.status(400).json({
          success: false,

          message:
            "Email and OTP are required.",
        });
      }


      const cleanEmail =
        email.trim().toLowerCase();


      const registration =
        otpStore.get(
          cleanEmail
        );


      if (!registration) {
        return res.status(400).json({
          success: false,

          message:
            "OTP not found. Please register again.",
        });
      }


      // CHECK OTP EXPIRY

      if (
        Date.now() >
        registration.expiresAt
      ) {

        otpStore.delete(
          cleanEmail
        );


        return res.status(400).json({
          success: false,

          message:
            "OTP has expired. Please register again.",
        });
      }


      // CHECK OTP

      if (
        registration.otp !== otp
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Invalid OTP.",
        });
      }


      // CREATE CUSTOMER ACCOUNT

      const [result] =
        await db.query(
          `
          INSERT INTO users
          (
            name,
            email,
            password,
            phone,
            role,
            status
          )
          VALUES (?, ?, ?, ?, 'customer', 'Active')
          `,
          [
            registration.name,
            registration.email,
            registration.password,
            registration.phone,
          ]
        );


      // REMOVE USED OTP

      otpStore.delete(
        cleanEmail
      );


      return res.status(201).json({
        success: true,

        message:
          "Email verified and customer account created successfully.",

        userId:
          result.insertId,
      });


    } catch (error) {

      console.error(
        "OTP verification error:",
        error
      );


      return res.status(500).json({
        success: false,

        message:
          "OTP verification failed.",

        error:
          error.message,
      });
    }
  }
);


// ========================================
// CUSTOMER LOGIN
// ========================================

router.post("/login", async (req, res) => {
  try {

    const {
      email,
      password,
    } = req.body;


    // ------------------------------------
    // VALIDATION
    // ------------------------------------

    if (!email || !password) {
      return res.status(400).json({
        success: false,

        message:
          "Email and password are required.",
      });
    }


    const cleanEmail =
      email.trim().toLowerCase();


    // ------------------------------------
    // FIND CUSTOMER
    // ------------------------------------

    const [users] =
      await db.query(
        `
        SELECT *
        FROM users
        WHERE email = ?
        `,
        [cleanEmail]
      );


    if (users.length === 0) {
      return res.status(401).json({
        success: false,

        message:
          "Invalid email or password.",
      });
    }


    const user = users[0];


    // ------------------------------------
    // CHECK ROLE
    // ------------------------------------

    if (
      user.role &&
      user.role !== "customer"
    ) {
      return res.status(403).json({
        success: false,

        message:
          "This account is not a customer account.",
      });
    }


    // ------------------------------------
    // CHECK STATUS
    // ------------------------------------

    if (
      user.status &&
      user.status !== "Active"
    ) {
      return res.status(403).json({
        success: false,

        message:
          "Customer account is not active.",
      });
    }


    // ------------------------------------
    // CHECK PASSWORD
    // ------------------------------------

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!passwordMatch) {
      return res.status(401).json({
        success: false,

        message:
          "Invalid email or password.",
      });
    }


    // ------------------------------------
    // CREATE TOKEN
    // ------------------------------------

    const token =
      jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: "customer",
        },

        JWT_SECRET,

        {
          expiresIn: "1d",
        }
      );


    // ------------------------------------
    // RESPONSE
    // ------------------------------------

    return res.json({
      success: true,

      message:
        "Customer login successful.",

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: "customer",
        status: user.status,
      },
    });


  } catch (error) {

    console.error(
      "Customer login error:",
      error
    );


    return res.status(500).json({
      success: false,

      message:
        "Customer login failed.",

      error:
        error.message,
    });
  }
});


// ========================================
// GOOGLE CUSTOMER LOGIN
// ========================================

router.post("/google", async (req, res) => {
  try {

    const {
      credential,
    } = req.body;


    if (!credential) {
      return res.status(400).json({
        success: false,

        message:
          "Google credential is required.",
      });
    }


    // Verify Google token

    const ticket =
      await googleClient.verifyIdToken({
        idToken: credential,
        audience: GOOGLE_CLIENT_ID,
      });


    const payload =
      ticket.getPayload();


    const {
      sub,
      email,
      name,
      email_verified,
    } = payload;


    // Check verified email

    if (
      !email ||
      !email_verified
    ) {
      return res.status(401).json({
        success: false,

        message:
          "Google email is not verified.",
      });
    }


    const cleanEmail =
      email.trim().toLowerCase();


    // Find existing customer

    const [users] =
      await db.query(
        `
        SELECT *
        FROM users
        WHERE email = ?
        `,
        [cleanEmail]
      );


    let user;


    // If customer already exists

    if (users.length > 0) {

      user = users[0];


      // Check customer role

      if (
        user.role &&
        user.role !== "customer"
      ) {
        return res.status(403).json({
          success: false,

          message:
            "This Google account is not a customer account.",
        });
      }


      // Check status

      if (
        user.status &&
        user.status !== "Active"
      ) {
        return res.status(403).json({
          success: false,

          message:
            "Customer account is not active.",
        });
      }


    } else {

      // Create new customer from Google

      const [result] =
        await db.query(
          `
          INSERT INTO users
          (
            name,
            email,
            password,
            phone,
            role,
            status
          )
          VALUES (?, ?, ?, ?, 'customer', 'Active')
          `,
          [
            name ||
              "Google Customer",

            cleanEmail,

            null,

            null,
          ]
        );


      const [newUsers] =
        await db.query(
          `
          SELECT *
          FROM users
          WHERE id = ?
          `,
          [result.insertId]
        );


      user =
        newUsers[0];
    }


    // Create CloudCart JWT

    const token =
      jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: "customer",
          googleId: sub,
        },

        JWT_SECRET,

        {
          expiresIn: "1d",
        }
      );


    // Send login response

    return res.json({
      success: true,

      message:
        "Google login successful.",

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: "customer",
        status: user.status,
      },
    });


  } catch (error) {

    console.error(
      "Google login error:",
      error
    );


    return res.status(500).json({
      success: false,

      message:
        "Google login failed.",

      error:
        error.message,
    });
  }
});


// ========================================
// ADMIN LOGIN
// ========================================

router.post(
  "/admin/login",
  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body;


      if (!email || !password) {
        return res.status(400).json({
          success: false,

          message:
            "Email and password are required.",
        });
      }


      const cleanEmail =
        email.trim().toLowerCase();


      // FIND ADMIN

      const [users] =
        await db.query(
          `
          SELECT *
          FROM users
          WHERE email = ?
          AND role = 'admin'
          `,
          [cleanEmail]
        );


      if (users.length === 0) {
        return res.status(401).json({
          success: false,

          message:
            "Invalid admin email or password.",
        });
      }


      const admin =
        users[0];


      // CHECK PASSWORD

      const passwordMatch =
        await bcrypt.compare(
          password,
          admin.password
        );


      if (!passwordMatch) {
        return res.status(401).json({
          success: false,

          message:
            "Invalid admin email or password.",
        });
      }


      // CREATE TOKEN

      const token =
        jwt.sign(
          {
            id: admin.id,
            email: admin.email,
            role: "admin",
          },

          JWT_SECRET,

          {
            expiresIn: "1d",
          }
        );


      return res.json({
        success: true,

        message:
          "Admin login successful.",

        token,

        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: "admin",
          status: admin.status,
        },
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
      });
    }
  }
);


module.exports = router;