const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const db = require("../config/db");

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const roleMiddleware = require(
  "../middleware/roleMiddleware"
);

const router = express.Router();
const otpStore = new Map();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// ========================================
// SELLER REGISTER
// ========================================

// ========================================
// SELLER REGISTER - SEND OTP
// ========================================

router.post("/register", async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      phone,
      store_name,
    } = req.body;


    // Validate fields
    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !store_name
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All seller fields are required.",
      });
    }


    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters.",
      });
    }


    const cleanEmail =
      email.trim().toLowerCase();


    // Check existing seller
    const [existing] =
      await db.query(
        `
        SELECT id
        FROM sellers
        WHERE email = ?
        `,
        [cleanEmail]
      );


    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "Seller account already exists with this email.",
      });
    }


    // Generate 6-digit OTP
    const otp =
      Math.floor(
        100000 + Math.random() * 900000
      ).toString();


    // Hash password before temporary storage
    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );


    // Store registration data temporarily
    otpStore.set(
      cleanEmail,
      {
        otp,
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        phone: phone.trim(),
        store_name: store_name.trim(),
        expiresAt:
          Date.now() +
          10 * 60 * 1000,
      }
    );


    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: cleanEmail,

      subject:
        "CloudCart Seller Email Verification",

      html: `
        <h2>CloudCart Seller Registration</h2>

        <p>Your email verification OTP is:</p>

        <h1>${otp}</h1>

        <p>
          This OTP will expire in
          10 minutes.
        </p>

        <p>
          Do not share this OTP
          with anyone.
        </p>
      `,
    });


    return res.status(200).json({
      success: true,

      message:
        "OTP sent successfully to your email.",

      email:
        cleanEmail,
    });


  } catch (error) {

    console.error(
      "Seller registration OTP error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to send verification OTP.",

      error:
        error.message,
    });

  }
});
// ========================================
// SELLER VERIFY OTP
// ========================================

router.post("/verify-otp", async (req, res) => {
  try {

    const {
      email,
      otp,
    } = req.body;


    // Validate input
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message:
          "Email and OTP are required.",
      });
    }


    const cleanEmail =
      email.trim().toLowerCase();


    // Get temporary registration data
    const pendingSeller =
      otpStore.get(cleanEmail);


    if (!pendingSeller) {
      return res.status(400).json({
        success: false,
        message:
          "OTP not found. Please register again.",
      });
    }


    // Check OTP expiration
    if (
      Date.now() >
      pendingSeller.expiresAt
    ) {
      otpStore.delete(cleanEmail);

      return res.status(400).json({
        success: false,
        message:
          "OTP has expired. Please register again.",
      });
    }


    // Check OTP
    if (
      pendingSeller.otp !==
      otp.toString().trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid OTP.",
      });
    }


    // Create seller after OTP verification
    const [result] =
      await db.query(
        `
        INSERT INTO sellers
        (
          name,
          email,
          password,
          phone,
          store_name,
          status
        )
        VALUES (?, ?, ?, ?, ?, 'Active')
        `,
        [
          pendingSeller.name,
          pendingSeller.email,
          pendingSeller.password,
          pendingSeller.phone,
          pendingSeller.store_name,
        ]
      );


    // Remove temporary OTP data
    otpStore.delete(cleanEmail);


    return res.status(201).json({
      success: true,
      message:
        "Email verified and seller account created successfully.",
      sellerId:
        result.insertId,
    });


  } catch (error) {

    console.error(
      "Seller OTP verification error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to verify OTP.",
      error:
        error.message,
    });

  }
});


// ========================================
// SELLER LOGIN
// ========================================

router.post("/login", async (req, res) => {
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

    const [rows] =
      await db.query(
        `
        SELECT *
        FROM sellers
        WHERE email = ?
        `,
        [cleanEmail]
      );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    const seller = rows[0];

    const passwordMatch =
      await bcrypt.compare(
        password,
        seller.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    if (seller.status !== "Active") {
      return res.status(403).json({
        success: false,
        message:
          "Seller account is not active.",
      });
    }

    const token =
      jwt.sign(
        {
          id: seller.id,
          email: seller.email,
          role: "seller",
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

    return res.json({
      success: true,
      message:
        "Seller login successful.",
      token,

      seller: {
        id: seller.id,
        name: seller.name,
        email: seller.email,
        phone: seller.phone,
        store_name:
          seller.store_name,
        status: seller.status,
      },
    });

  } catch (error) {
    console.error(
      "Seller login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Seller login failed.",
    });
  }
});


// ========================================
// SELLER PROFILE
// ========================================

router.get(
  "/profile",

  authMiddleware,

  roleMiddleware("seller"),

  async (req, res) => {
    try {

      const [sellers] =
        await db.query(
          `
          SELECT
            id,
            name,
            email,
            phone,
            store_name,
            status,
            created_at
          FROM sellers
          WHERE id = ?
          `,
          [req.user.id]
        );

      if (sellers.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Seller not found.",
        });
      }

      return res.json({
        success: true,
        seller: sellers[0],
      });

    } catch (error) {
      console.error(
        "Seller profile error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to get seller profile.",
      });
    }
  }
);


// ========================================
// EXPORT ROUTER
// ========================================

module.exports = router;