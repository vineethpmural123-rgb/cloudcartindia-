import React, { useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    email,
    userType,
    otp,
  } = location.state || {};

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleReset = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
  "/api/auth/reset-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            userType,
            otp,
            newPassword: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to reset password."
        );
      }

      setSuccess(
        "Password changed successfully."
      );

      setTimeout(() => {
        navigate(
          userType === "seller"
            ? "/seller/login"
            : "/customer/login"
        );
      }, 1500);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>Reset Password</h1>

        <form onSubmit={handleReset}>

          <label>New Password</label>

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Enter new password"
          />

          <label>
            Confirm Password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(
                event.target.value
              )
            }
            placeholder="Confirm new password"
          />

          {error && (
            <p className="error">
              {error}
            </p>
          )}

          {success && (
            <p className="success">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Updating..."
              : "Reset Password"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default ResetPassword;

