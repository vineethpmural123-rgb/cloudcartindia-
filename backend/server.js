const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

// ======================================================
// ROUTES
// ======================================================
const paymentRoutes = require("./routes/paymentRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const customerRoutes = require("./routes/customerRoutes");
// ======================================================
// APP
// ======================================================

const app = express();

// ======================================================
// MIDDLEWARE
// ======================================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",

  "https://www.cloudcartindia.online",
  "https://cloudcartindia.online",

  // New CloudCart Load Balancer
  "https://cloudcart-alb-563992341.ap-south-1.elb.amazonaws.com",

  // Old Load Balancer - keep temporarily
  "http://af534a32b6ae4467fa7e27987894cbfd-1492799833.ap-south-1.elb.amazonaws.com",

  "http://65.0.107.40:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("CORS Origin:", origin);

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("CORS blocked:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },

    credentials: true,

    methods: [
      "GET",
      "HEAD",
      "PUT",
      "PATCH",
      "POST",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);
app.use(express.json());

// ======================================================
// HOME
// ======================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CloudCart Backend is running",
  });
});


const passwordResetRoutes =
  require("./routes/passwordResetRoutes");
// ======================================================
// DATABASE TEST
// ======================================================

app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT 1 AS connected"
    );

    res.json({
      success: true,
      message: "CloudCart MySQL connected",
      database: rows[0].connected === 1,
    });
  } catch (error) {
    console.error(
      "Database test error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// ======================================================
// PRODUCT API
// ======================================================

app.use(
  "/api/products",
  productRoutes
);


// ======================================================
// ORDER API
// ======================================================

app.use(
  "/api/orders",
  orderRoutes
);

// ======================================================
// SELLER API
// ======================================================

app.use(
  "/api/sellers",
  sellerRoutes
);

// ======================================================
// CUSTOMER AUTH API
// ======================================================

app.use(
  "/api/auth",
  authRoutes
);

// ======================================================
// CUSTOMER USER API
// ======================================================

app.use(
  "/api/users",
  userRoutes
);


// ======================================================
// CUSTOMER API
// ======================================================

app.use(
  "/api/customers",
  customerRoutes
);

// ======================================================
// PAYMENT API
// ======================================================

app.use(
  "/api/payment",
  paymentRoutes
);

// ======================================================
// ADMIN API
// ======================================================

app.use(
  "/api/admin",
  adminRoutes
);
app.use(
  "/api/auth",
  passwordResetRoutes
);


// ======================================================
// 404 API
// ======================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found.",
    path: req.originalUrl,
  });
});

// ======================================================
// ERROR HANDLER
// ======================================================

app.use(
  (error, req, res, next) => {
    console.error(
      "Server error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
);



// ======================================================
// SERVER
// ======================================================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `CloudCart backend running on http://localhost:${PORT}`
  );
});

