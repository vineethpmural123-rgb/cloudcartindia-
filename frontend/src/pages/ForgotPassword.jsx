import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const userType =
    location.state?.userType || "customer";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            userType,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to send OTP."
        );
      }

      setMessage("OTP has been sent to your email.");

      navigate("/verify-otp", {
        state: {
          email: email.trim().toLowerCase(),
          userType,
        },
      });
    } catch (error) {
      console.error("Forgot password error:", error);

      setError(
        error.message || "Unable to send OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">

      <div className="forgot-card">

        <div className="forgot-logo">
          CC
        </div>

        <h1>Forgot Password?</h1>

        <p className="forgot-subtitle">
          Enter your registered email address and
          we'll send you an OTP to reset your password.
        </p>

        <form onSubmit={handleSubmit}>

          <label htmlFor="email">
            Email Address
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="Enter your email"
          />

          {error && (
            <p className="forgot-error">
              {error}
            </p>
          )}

          {message && (
            <p className="forgot-success">
              {message}
            </p>
          )}

          <button
            className="send-otp-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>

        </form>

        <button
          className="back-login-btn"
          type="button"
          onClick={() => navigate(-1)}
        >
          ← Back to Login
        </button>

      </div>

    </div>
  );
}

export default ForgotPassword;

