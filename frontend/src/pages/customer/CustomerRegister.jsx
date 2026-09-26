import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function CustomerRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ==========================================
  // HANDLE FORM CHANGE
  // ==========================================

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };


  // ==========================================
  // REGISTER AND SEND OTP
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {

      const response =
        await fetch(
          "/api/auth/register",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(form),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to send OTP."
        );

      }


      setSuccess(
        "OTP sent to your email. Please check your inbox."
      );


      setOtpSent(true);


    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // VERIFY OTP
  // ==========================================

  const handleVerifyOtp =
    async (e) => {

      e.preventDefault();

      setError("");
      setSuccess("");
      setLoading(true);

      try {

        const response =
          await fetch(
            "/api/auth/verify-otp",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  email: form.email,
                  otp: otp,
                }),
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "OTP verification failed."
          );

        }


        setSuccess(
          "Email verified successfully! Redirecting to login..."
        );


        setTimeout(() => {

          navigate(
            "/customer/login"
          );

        }, 1500);


      } catch (error) {

        setError(
          error.message
        );

      } finally {

        setLoading(false);

      }

    };


  return (

    <div style={styles.page}>

      <div style={styles.card}>


        <h1 style={styles.logo}>
          CloudCart
        </h1>


        {!otpSent ? (

          <>

            <p style={styles.subtitle}>
              Create Customer Account
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


            <form
              onSubmit={handleSubmit}
            >

              <label style={styles.label}>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                style={styles.input}
              />


              <label style={styles.label}>
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                style={styles.input}
              />


              <label style={styles.label}>
                Phone
              </label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                style={styles.input}
              />


              <label style={styles.label}>
                Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                minLength="6"
                required
                style={styles.input}
              />


              <button
                type="submit"
                disabled={loading}
                style={styles.button}
              >

                {loading
                  ? "Sending OTP..."
                  : "Create Account"}

              </button>

            </form>

          </>

        ) : (

          <>

            <p style={styles.subtitle}>
              Verify Your Email
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


            <p style={styles.otpText}>

              Enter the 6-digit verification code
              sent to:

              <br />

              <strong>
                {form.email}
              </strong>

            </p>


            <form
              onSubmit={handleVerifyOtp}
            >

              <label style={styles.label}>
                Verification Code
              </label>


              <input
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value)
                }
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                required
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

          </>

        )}


        <p style={styles.footer}>

          Already have an account?{" "}

          <Link
            to="/customer/login"
            style={styles.link}
          >
            Login
          </Link>

        </p>


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
    background: "#f5f7fb",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },


  card: {
    width: "100%",
    maxWidth: "450px",
    background: "#ffffff",
    padding: "40px",
    borderRadius: "18px",
    boxShadow:
      "0 10px 35px rgba(0,0,0,0.08)",
  },


  logo: {
    textAlign: "center",
    color: "#2563eb",
    marginBottom: "8px",
  },


  subtitle: {
    textAlign: "center",
    color: "#64748b",
    marginBottom: "30px",
  },


  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#334155",
  },


  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px",
    marginBottom: "18px",
    border:
      "1px solid #cbd5e1",
    borderRadius: "9px",
    fontSize: "15px",
    outline: "none",
  },


  button: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "9px",
    background: "#2563eb",
    color: "white",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
  },


  error: {
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "8px",
    background: "#fee2e2",
    color: "#b91c1c",
  },


  success: {
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "8px",
    background: "#dcfce7",
    color: "#15803d",
  },


  otpText: {
    textAlign: "center",
    color: "#475569",
    lineHeight: "1.6",
    marginBottom: "25px",
  },


  footer: {
    textAlign: "center",
    marginTop: "25px",
    color: "#64748b",
  },


  link: {
    color: "#2563eb",
    fontWeight: "700",
    textDecoration: "none",
  },

};


export default CustomerRegister;



