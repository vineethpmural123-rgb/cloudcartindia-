import React, { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  GoogleLogin,
} from "@react-oauth/google";


function CustomerLogin() {

  const navigate = useNavigate();

  const [form, setForm] =
    useState({
      email: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==========================================
  // NORMAL EMAIL LOGIN
  // ==========================================

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setLoading(true);

    try {

     const response = await fetch(
"/api/auth/login",
    
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(form),
    }
  );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Login failed."
        );

      }


      localStorage.setItem(
        "customerToken",
        data.token
      );


      localStorage.setItem(
        "customer",
        JSON.stringify(data.user)
      );


      navigate(
  "/customer/products"
);


    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // GOOGLE LOGIN
  // ==========================================

  const handleGoogleSuccess =
    async (credentialResponse) => {

      setError("");

      setLoading(true);

      try {

      
       const response = await fetch(
  "/api/auth/google",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        credential:
          credentialResponse.credential,
      }),
    }
  );

        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Google login failed."
          );

        }


        localStorage.setItem(
          "customerToken",
          data.token
        );


        localStorage.setItem(
          "customer",
          JSON.stringify(data.user)
        );


        navigate(
  "/customer/products"
);


      } catch (error) {

        setError(
          error.message
        );

      } finally {

        setLoading(false);

      }

    };


  const handleGoogleError = () => {

    setError(
      "Google sign in failed. Please try again."
    );

  };


  return (

    <div style={styles.page}>

      <div style={styles.card}>


        <h1 style={styles.logo}>
          CloudCart
        </h1>


        <p style={styles.subtitle}>
          Customer Login
        </p>


        {error && (

          <div style={styles.error}>
            {error}
          </div>

        )}


        {/* NORMAL LOGIN */}

        <form
          onSubmit={handleSubmit}
        >

          <label
            style={styles.label}
          >
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


          <label
            style={styles.label}
          >
            Password
          </label>


          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            style={styles.input}
          />
          <button
  type="button"
  onClick={() =>
    navigate("/forgot-password", {
      state: {
        userType: "customer",
      },
    })
  }
  style={styles.forgotButton}
>
  Forgot Password?
</button>

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

        </form>


        {/* DIVIDER */}

        <div style={styles.divider}>

          <div
            style={styles.dividerLine}
          />

          <span>
            OR
          </span>

          <div
            style={styles.dividerLine}
          />

        </div>
        {/* GOOGLE LOGIN */}

<div style={styles.googleButton}>

  <GoogleLogin
    onSuccess={handleGoogleSuccess}
    onError={handleGoogleError}
    useOneTap={false}
  />

</div>




        <p style={styles.footer}>

          Don't have an account?{" "}

          <Link
            to="/customer/register"
            style={styles.link}
          >
            Register
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
    fontFamily:
      "Arial, sans-serif",
  },


  card: {
    width: "100%",
    maxWidth: "430px",
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


  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin:
      "25px 0",
    color: "#94a3b8",
    fontSize: "13px",
  },


  dividerLine: {
    flex: 1,
    height: "1px",
    background: "#e2e8f0",
  },


  googleButton: {
    display: "flex",
    justifyContent: "center",
  },


  error: {
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "8px",
    background: "#fee2e2",
    color: "#b91c1c",
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

  forgotButton: {
    display: "block",
    width: "100%",
    border: "none",
    background: "transparent",
    color: "#2563eb",
    textAlign: "right",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "-8px",
    marginBottom: "18px",
  },

};

export default CustomerLogin;

