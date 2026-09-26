import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function SellerVerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email) {
      setError(
        "Email information is missing. Please register again."
      );
      return;
    }

    if (otp.length !== 6) {
      setError(
        "Please enter the 6-digit OTP."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/sellers/verify-otp",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
          "OTP verification failed."
        );
      }

      setSuccess(
        "Email verified successfully! Seller account created."
      );

      setTimeout(() => {
        navigate("/seller/login");
      }, 1500);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <h1 style={styles.logo}>
          CloudCart Seller
        </h1>

        <h2 style={styles.title}>
          Verify Your Email
        </h2>

        <p style={styles.subtitle}>
          We sent a 6-digit OTP to:
        </p>

        <p style={styles.email}>
          {email}
        </p>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {success && (
          <div style={styles.success}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            value={otp}
            onChange={(e) =>
              setOtp(
                e.target.value.replace(/\D/g, "")
              )
            }
            placeholder="Enter 6-digit OTP"
            maxLength="6"
            style={styles.input}
          />

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading
              ? "Verifying..."
              : "Verify OTP"}
          </button>

        </form>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f8fc",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "450px",
    background: "white",
    padding: "40px",
    borderRadius: "20px",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
    textAlign: "center",
  },

  logo: {
    color: "#2563eb",
    marginBottom: "20px",
  },

  title: {
    marginBottom: "10px",
  },

  subtitle: {
    color: "#64748b",
  },

  email: {
    fontWeight: "bold",
    marginBottom: "25px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px",
    fontSize: "20px",
    textAlign: "center",
    letterSpacing: "5px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  button: {
    width: "100%",
    padding: "15px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  error: {
    background: "#fee2e2",
    color: "#dc2626",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  success: {
    background: "#dcfce7",
    color: "#15803d",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
};

export default SellerVerifyOtp;



