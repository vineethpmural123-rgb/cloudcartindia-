import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SellerLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/sellers/login",
        {
          method: "POST",
         headers: {
  "Content-Type": "application/json",
  
},
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Seller login failed."
        );
      }

      // Save seller login information
      localStorage.setItem(
        "sellerToken",
        data.token
      );

      localStorage.setItem(
        "seller",
        JSON.stringify(data.seller)
      );

      // Go to seller dashboard
      navigate("/seller/dashboard");

    } catch (err) {
      console.error(
        "Seller login error:",
        err
      );

      setError(
        err.message ||
          "Unable to login seller."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
        background: "#f5f8fc",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "40px",
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            marginBottom: "10px",
          }}
        >
          CloudCart Seller
        </h1>

        <h2>Seller Login</h2>

        <p>
          Login to manage your store.
        </p>

        {error && (
          <div
            style={{
              padding: "12px",
              marginBottom: "15px",
              background: "#fee2e2",
              color: "#b91c1c",
              borderRadius: "8px",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginTop: "25px",
          }}
        >
          <input
            name="email"
            type="email"
            placeholder="Seller Email"
            value={form.email}
            onChange={handleChange}
            style={{
              padding: "14px",
              fontSize: "16px",
            }}
          />


          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={{
              padding: "14px",
              fontSize: "16px",
            }}
          />
          <button
  type="button"
  onClick={() =>
    navigate("/forgot-password", {
      state: {
        userType: "seller",
      },
    })
  }
  style={{
    border: "none",
    background: "transparent",
    color: "#2563eb",
    textAlign: "right",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "-8px",
  }}
>
  Forgot Password?
</button>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px",
              border: "none",
              borderRadius: "8px",
              background: "#2563eb",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {loading
              ? "Logging in..."
              : "Seller Login"}
          </button>
        </form>

      
        <p style={{ marginTop: "20px" }}>
          Don't have a seller account?{" "}
          <Link to="/seller/register">
            Create Seller Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SellerLogin;



