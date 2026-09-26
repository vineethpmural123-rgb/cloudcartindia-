const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =====================================================
// CREATE RAZORPAY ORDER
// =====================================================

const createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid payment amount is required.",
      });
    }

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: `cloudcart_${Date.now()}`,
    };

    const razorpayOrder =
      await razorpay.orders.create(options);

    return res.status(201).json({
      success: true,
      order: razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error(
      "Create payment order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to create payment order.",
    });
  }
};


// =====================================================
// VERIFY PAYMENT
// =====================================================

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body =
      razorpay_order_id +
      "|" +
      razorpay_payment_id;

    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(body)
        .digest("hex");

    if (
      expectedSignature !==
      razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment verification failed.",
      });
    }

    return res.json({
      success: true,
      message:
        "Payment verified successfully.",
      paymentId: razorpay_payment_id,
    });

  } catch (error) {
    console.error(
      "Payment verification error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to verify payment.",
    });
  }
};


module.exports = {
  createPaymentOrder,
  verifyPayment,
};