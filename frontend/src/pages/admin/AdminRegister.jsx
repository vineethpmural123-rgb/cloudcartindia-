import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  UserPlus,
} from "lucide-react";

import "./AdminLogin.css";

function AdminRegister() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================
  // CREATE ADMIN ACCOUNT
  // =========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanName = name.trim();
    const cleanEmail =
      email.trim().toLowerCase();

    // =======================================
    // VALIDATION
    // =======================================

    if (
      !cleanName ||
      !cleanEmail ||
      !password ||
      !confirmPassword
    ) {
      setError(
        "Please fill in all fields."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (
      password !== confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

   // =======================================
// CREATE ADMIN USING BACKEND
// =======================================

try {
  const response = await fetch(
    "/api/admin/register",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name: cleanName,
        email: cleanEmail,
        password: password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    setError(
      data.message ||
        "Failed to create admin account."
    );
    return;
  }

  setSuccess(
    "Admin account created successfully."
  );

  setTimeout(() => {
    navigate("/admin/login");
  }, 1000);

} catch (error) {
  console.error(
    "Admin register error:",
    error
  );

  setError(
    "Unable to connect to the server."
  );
}
  };

  return (
    <main className="admin-login-page">

      {/* =====================================
          BACK
      ===================================== */}

      <Link
        to="/"
        className="admin-login-back"
      >
        <ArrowLeft size={18} />
        Back to Store
      </Link>

      {/* =====================================
          CARD
      ===================================== */}

      <section className="admin-login-card">

        {/* LOGO */}

        <div className="admin-login-logo">

          <div className="admin-login-logo-icon">
            <ShieldCheck size={28} />
          </div>

          <div>
            <strong>
              CloudCart
            </strong>

            <span>
              Admin Panel
            </span>
          </div>

        </div>

        {/* HEADER */}

        <div className="admin-login-header">

          <h1>
            Create Admin Account
          </h1>

          <p>
            Create the administrator account
            for your CloudCart store.
          </p>

        </div>

        {/* FORM */}

        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >

          {/* NAME */}

          <div className="admin-login-field">

            <label htmlFor="admin-name">
              Admin Name
            </label>

            <div className="admin-login-input">

              <User size={19} />

              <input
                id="admin-name"
                type="text"
                value={name}
                onChange={(event) => {
                  setName(
                    event.target.value
                  );
                  setError("");
                }}
                placeholder="Enter admin name"
              />

            </div>

          </div>

          {/* EMAIL */}

          <div className="admin-login-field">

            <label htmlFor="admin-register-email">
              Admin Email
            </label>

            <div className="admin-login-input">

              <Mail size={19} />

              <input
                id="admin-register-email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(
                    event.target.value
                  );
                  setError("");
                }}
                placeholder="Enter admin email"
              />

            </div>

          </div>

          {/* PASSWORD */}

          <div className="admin-login-field">

            <label htmlFor="admin-register-password">
              Password
            </label>

            <div className="admin-login-input">

              <Lock size={19} />

              <input
                id="admin-register-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(event) => {
                  setPassword(
                    event.target.value
                  );
                  setError("");
                }}
                placeholder="Minimum 6 characters"
              />

              <button
                type="button"
                className="admin-password-toggle"
                onClick={() =>
                  setShowPassword(
                    (previous) =>
                      !previous
                  )
                }
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>

            </div>

          </div>

          {/* CONFIRM PASSWORD */}

          <div className="admin-login-field">

            <label htmlFor="admin-confirm-password">
              Confirm Password
            </label>

            <div className="admin-login-input">

              <Lock size={19} />

              <input
                id="admin-confirm-password"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(
                    event.target.value
                  );
                  setError("");
                }}
                placeholder="Confirm password"
              />

              <button
                type="button"
                className="admin-password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    (previous) =>
                      !previous
                  )
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>

            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div
              style={{
                padding: "13px 16px",
                background: "#dcfce7",
                border: "1px solid #bbf7d0",
                color: "#15803d",
                borderRadius: "9px",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              {success}
            </div>
          )}

          {/* BUTTON */}

          <button
            type="submit"
            className="admin-login-button"
          >
            <UserPlus size={19} />
            Create Admin Account
          </button>

        </form>

        {/* INFO */}

        <div className="admin-login-info">

          <strong>
            Administrator Account
          </strong>

          <span>
            This account will have access
            to the CloudCart Admin Panel.
          </span>

        </div>

        {/* LOGIN */}

        <div className="customer-login-link">

          Already have an admin account?

          <Link to="/admin/login">
            Admin Login
          </Link>

        </div>

      </section>

    </main>
  );
}

export default AdminRegister;



