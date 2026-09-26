import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ShoppingBag,
  Store,
  CheckCircle,
} from "lucide-react";

import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    accountType: "customer",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.terms) {
      setError("Please accept the Terms & Conditions.");
      return;
    }

    /*
      TEMPORARY FRONTEND STORAGE

      Later we will replace this with:
      POST /api/auth/register

      and save the account in PostgreSQL.
    */

    const users = JSON.parse(localStorage.getItem("cloudcart_users")) || [];

    const existingUser = users.find(
      (user) =>
        user.email.toLowerCase() === formData.email.toLowerCase()
    );

    if (existingUser) {
      setError("An account with this email already exists.");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      accountType: formData.accountType,
      password: formData.password,
    };

    localStorage.setItem(
      "cloudcart_users",
      JSON.stringify([...users, newUser])
    );

    alert("Account created successfully!");

    navigate("/login");
  };

  return (
    <div className="register-page">

      {/* HEADER */}

      <header className="register-header">
        <Link to="/" className="register-logo">
          <ShoppingBag size={30} />
          <span>CloudCart</span>
        </Link>

        <div className="header-login">
          Already have an account?
          <Link to="/login">Sign in</Link>
        </div>
      </header>


      {/* STEP BAR */}

      <div className="register-steps">

        <div className="step active">
          <span>1</span>
          Account
        </div>

        <div className="step-line"></div>

        <div className="step">
          <span>2</span>
          Details
        </div>

        <div className="step-line"></div>

        <div className="step">
          <span>3</span>
          Complete
        </div>

      </div>


      {/* MAIN */}

      <main className="register-main">

        <div className="register-card">

          <div className="register-title">

            <div className="title-icon">
              <ShoppingBag size={25} />
            </div>

            <h1>Create your CloudCart account</h1>

            <p>
              Join CloudCart and start shopping from trusted sellers.
            </p>

          </div>


          <form onSubmit={handleSubmit}>

            {/* NAME */}

            <div className="field">

              <label>Full Name</label>

              <div className="input-box">

                <User size={19} />

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="field">

              <label>Email Address</label>

              <div className="input-box">

                <Mail size={19} />

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />

              </div>

            </div>


            {/* PHONE */}

            <div className="field">

              <label>Phone Number</label>

              <div className="input-box">

                <Phone size={19} />

                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                />

              </div>

            </div>


            {/* ACCOUNT TYPE */}

            <div className="field">

              <label>Account Type</label>

              <div className="account-types">

                <button
                  type="button"
                  className={
                    formData.accountType === "customer"
                      ? "account-type selected"
                      : "account-type"
                  }
                  onClick={() =>
                    setFormData({
                      ...formData,
                      accountType: "customer",
                    })
                  }
                >

                  <User size={22} />

                  <div>
                    <strong>Customer</strong>
                    <small>Buy products</small>
                  </div>

                  {formData.accountType === "customer" && (
                    <CheckCircle className="selected-icon" size={19} />
                  )}

                </button>


                <button
                  type="button"
                  className={
                    formData.accountType === "seller"
                      ? "account-type selected"
                      : "account-type"
                  }
                  onClick={() =>
                    setFormData({
                      ...formData,
                      accountType: "seller",
                    })
                  }
                >

                  <Store size={22} />

                  <div>
                    <strong>Seller</strong>
                    <small>Sell products</small>
                  </div>

                  {formData.accountType === "seller" && (
                    <CheckCircle className="selected-icon" size={19} />
                  )}

                </button>

              </div>

            </div>


            {/* PASSWORD */}

            <div className="field">

              <label>Password</label>

              <div className="input-box">

                <Lock size={19} />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="eye-button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

              <small className="hint">
                Password must contain at least 6 characters.
              </small>

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="field">

              <label>Confirm Password</label>

              <div className="input-box">

                <Lock size={19} />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Enter your password again"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="eye-button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
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
              <div className="register-error">
                {error}
              </div>
            )}


            {/* TERMS */}

            <label className="terms">

              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
              />

              <span>
                I agree to the CloudCart{" "}
                <a href="#terms">Terms & Conditions</a>{" "}
                and Privacy Policy.
              </span>

            </label>


            {/* BUTTON */}

            <button
              type="submit"
              className="create-account-button"
            >
              Create your CloudCart account
            </button>

          </form>


          {/* LOGIN */}

          <div className="already-account">

            Already have a CloudCart account?

            <Link to="/login">
              Sign in
            </Link>

          </div>

        </div>

      </main>


      <footer className="register-footer">
        © 2026 CloudCart. All rights reserved.
      </footer>

    </div>
  );
}

export default Register;
