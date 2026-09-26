const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.error("Email configuration error:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});




// ========================================
// SELLER REGISTER
// ========================================

const registerSeller = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      store_name,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !store_name
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, password and store name are required.",
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

    // CHECK EXISTING SELLER
    const [existingSeller] =
      await db.query(
        `
        SELECT id
        FROM sellers
        WHERE email = ?
        `,
        [cleanEmail]
      );

    if (existingSeller.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "Seller account already exists with this email.",
      });
    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // GENERATE 6-DIGIT OTP
    const otp =
      Math.floor(
        100000 + Math.random() * 900000
      ).toString();

    // OTP EXPIRES IN 10 MINUTES
    const otpExpiry =
      new Date(Date.now() + 10 * 60 * 1000);

    // CREATE SELLER
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
          status,
          otp,
          otp_expiry
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          name.trim(),
          cleanEmail,
          hashedPassword,
          phone
            ? phone.trim()
            : null,
          store_name.trim(),
          "Pending",
          otp,
          otpExpiry,
        ]
      );

    // SEND OTP EMAIL
console.log("Sending OTP to:", cleanEmail);
console.log("Generated OTP:", otp);

const info = await transporter.sendMail({
  from: `"CloudCart Seller" <${process.env.EMAIL_USER}>`,
  to: cleanEmail,
  subject: "CloudCart Seller Email Verification",
  text: `Your CloudCart Seller OTP is: ${otp}. This OTP expires in 10 minutes.`,
  html: `
    <h2>CloudCart Seller Verification</h2>
    <p>Your OTP is:</p>
    <h1>${otp}</h1>
    <p>This OTP expires in 10 minutes.</p>
  `,
});

console.log("Email sent successfully!");
console.log("Message ID:", info.messageId);
console.log("Accepted:", info.accepted);
console.log("Rejected:", info.rejected);

    return res.status(201).json({
      success: true,
      message:
        "Seller registered successfully. OTP sent to your email.",
      sellerId: result.insertId,
      email: cleanEmail,
    });

  } catch (error) {
    console.error(
      "Seller register error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create seller account.",
      error: error.message,
    });
  }
};
// ========================================
// VERIFY SELLER OTP
// ========================================

const verifySellerOTP = async (req, res) => {
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

    const [sellers] =
      await db.query(
        `
        SELECT *
        FROM sellers
        WHERE email = ?
        `,
        [cleanEmail]
      );

    if (sellers.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Seller not found.",
      });
    }

    const seller = sellers[0];

    // CHECK OTP
    if (seller.otp !== otp) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid OTP.",
      });
    }

    // CHECK OTP EXPIRY
    if (
      !seller.otp_expiry ||
      new Date() > new Date(seller.otp_expiry)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "OTP has expired.",
      });
    }

    // ACTIVATE SELLER
    await db.query(
      `
      UPDATE sellers
      SET
        status = 'Active',
        otp = NULL,
        otp_expiry = NULL
      WHERE id = ?
      `,
      [seller.id]
    );

    return res.json({
      success: true,
      message:
        "Email verified successfully.",
    });

  } catch (error) {
    console.error(
      "Verify OTP error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "OTP verification failed.",
      error: error.message,
    });
  }
};


// ========================================
// SELLER LOGIN
// ========================================

const loginSeller = async (req, res) => {
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

    // ========================================
    // FIND SELLER
    // ========================================

    const [sellers] =
      await db.query(
        `
        SELECT *
        FROM sellers
        WHERE email = ?
        `,
        [cleanEmail]
      );

    if (sellers.length === 0) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    const seller = sellers[0];

    // ========================================
    // CHECK STATUS
    // ========================================

    if (seller.status !== "Active") {
      return res.status(403).json({
        success: false,
        message:
          "Seller account is not active.",
      });
    }

    // ========================================
    // CHECK PASSWORD
    // ========================================

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

    // ========================================
    // CREATE JWT
    // ========================================

    const token = jwt.sign(
      {
        id: seller.id,
        email: seller.email,
        role: "seller",
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

    delete seller.password;

    // ========================================
    // RESPONSE
    // ========================================

    return res.json({
      success: true,
      message:
        "Seller login successful.",
      token,
      seller,
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
      error: error.message,
    });
  }
};


// ========================================
// GET SELLER PROFILE
// ========================================

const getSellerProfile = async (req, res) => {
  try {
    const sellerId =
      req.seller.id;

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
        [sellerId]
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
      "Get seller profile error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load seller profile.",
      error: error.message,
    });
  }
};


module.exports = {
  registerSeller,
  verifySellerOTP,
  loginSeller,
  getSellerProfile,
};