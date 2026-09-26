import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  LogIn,
} from "lucide-react";

import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================================
  // ADMIN LOGIN
  // =========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const enteredEmail =
      email.trim().toLowerCase();

    const enteredPassword =
      password.trim();

    // =======================================
    // EMPTY CHECK
    // =======================================

    if (
      !enteredEmail ||
      !enteredPassword
    ) {
      setError(
        "Please enter email and password."
      );

      return;
    }

    setLoading(true);

    // =======================================
    // ADMIN LOGIN USING BACKEND
    // =======================================

    try {
      const response = await fetch(
  "/api/admin/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email: enteredEmail,
            password: enteredPassword,
          }),
        }
      );

      const data =
        await response.json();

      // =====================================
      // LOGIN FAILED
      // =====================================

      if (
        !response.ok ||
        !data.success
      ) {
        setError(
          data.message ||
            "Invalid admin email or password."
        );

        setLoading(false);

        return;
      }

      // =====================================
      // LOGIN SUCCESS
      // =====================================

      localStorage.setItem(
        "adminToken",
        data.token
      );

      localStorage.setItem(
        "adminLoggedIn",
        "true"
      );
localStorage.setItem(
  "adminUser",
  JSON.stringify(data.admin)
);

      // =====================================
      // GO TO ADMIN DASHBOARD
      // =====================================

      navigate(
        "/admin/dashboard",
        {
          replace: true,
        }
      );

    } catch (error) {
      console.error(
        "Admin login error:",
        error
      );

      setError(
        "Unable to connect to the server."
      );

      setLoading(false);
    }
  };

  // =========================================
  // PAGE
  // =========================================

  return (
    <main className="admin-login-page">

      {/* BACK TO STORE */}

      <Link
        to="/customer/login"
        className="admin-login-back"
      >
        <ArrowLeft size={18} />
        Back to Store
      </Link>

      {/* LOGIN CARD */}

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
            Admin Login
          </h1>

          <p>
            Sign in to manage your
            CloudCart store.
          </p>

        </div>

        {/* FORM */}

        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >

          {/* EMAIL */}

          <div className="admin-login-field">

            <label htmlFor="admin-email">
              Admin Email
            </label>

            <div className="admin-login-input">

              <Mail size={19} />

              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(
                    event.target.value
                  );

                  setError("");
                }}
                placeholder="Enter admin email"
                autoComplete="username"
              />

            </div>

          </div>

          {/* PASSWORD */}

          <div className="admin-login-field">

            <label htmlFor="admin-password">
              Password
            </label>

            <div className="admin-login-input">

              <Lock size={19} />

              <input
                id="admin-password"
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
                placeholder="Enter admin password"
                autoComplete="current-password"
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
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
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

          {/* ERROR */}

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            <LogIn size={19} />

            {loading
              ? "Logging in..."
              : "Login as Admin"}
          </button>

        </form>

        {/* ADMIN INFORMATION */}

        <div className="admin-login-info">

          <strong>
            Authorized Admin Only
          </strong>

          <span>
            Only the CloudCart administrator
            can access the Admin Panel.
          </span>

        </div>

        

        {/* CUSTOMER LOGIN */}

        <div className="customer-login-link">

          Customer?

          <Link to="/customer/login">
            Go to Customer Login
          </Link>

        </div>

      </section>

    </main>
  );
}

export default AdminLogin;



