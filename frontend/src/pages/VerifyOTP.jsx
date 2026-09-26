import React, { useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./VerifyOTP.css";

function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
const userType = "customer";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (event) => {
    event.preventDefault();

    setError("");

    if (!otp || otp.length !== 6) {
      setError("Enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
  "/api/auth/verify-otp",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            userType,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "OTP verification failed."
        );
      }

      navigate("/reset-password", {
        state: {
          email,
          userType,
          otp,
        },
      });

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>Verify OTP</h1>

        <p>
          Enter the OTP sent to:
        </p>

        <strong>{email}</strong>

        <form onSubmit={handleVerify}>

          <label>OTP</label>

          <input
            type="text"
            maxLength="6"
            value={otp}
            onChange={(event) =>
              setOtp(
                event.target.value.replace(
                  /\D/g,
                  ""
                )
              )
            }
            placeholder="Enter 6-digit OTP"
          />

          {error && (
            <p className="error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
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

export default VerifyOTP;

