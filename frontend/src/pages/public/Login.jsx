import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    // Temporary frontend login
    // Backend authentication will be connected later.

    login({
      id: 1,
      name: "Customer",
      email: email || "customer@cloudcart.com",
      role: "CUSTOMER",
    });

    // Go to customer dashboard
    navigate("/customer/dashboard");
  };

  return (
    <main className="auth-page">

      <div className="auth-container">

        {/* LEFT SIDE */}

        <div className="auth-info">

          <Link to="/" className="auth-logo">
            🛒 CloudCart
          </Link>

          <div className="auth-info-content">

            <span className="auth-badge">
              ✨ CLOUD E-COMMERCE
            </span>

            <h1>
              Welcome
              <br />
              back 👋
            </h1>

            <p>
              Login to continue shopping on
              CloudCart.
            </p>

          </div>

        </div>

        {/* LOGIN CARD */}

        <div className="login-card">

          <div className="login-header">

            <h2>
              Login to CloudCart
            </h2>

            <p>
              Enter your details to continue
            </p>

          </div>

          <form onSubmit={handleLogin}>

            {/* EMAIL */}

            <div className="form-group">

              <label>
                Email Address
              </label>

              <div className="input-wrapper">

                <Mail size={19} />

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="form-group">

              <div className="password-label">

                <label>
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-password"
                >
                  Forgot password?
                </button>

              </div>

              <div className="input-wrapper">

                <Lock size={19} />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* REMEMBER */}

            <label className="remember-me">

              <input type="checkbox" />

              <span>
                Remember me
              </span>

            </label>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-submit"
            >
              Login to CloudCart
              <ArrowRight size={18} />
            </button>

          </form>

          {/* REGISTER */}

          <div className="register-link">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create Account
            </Link>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Login;
