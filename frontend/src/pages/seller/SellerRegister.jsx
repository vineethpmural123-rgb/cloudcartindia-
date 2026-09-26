import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SellerRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    store_name: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.phone ||
      !form.store_name
    ) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      console.log("Sending seller registration:", form);

      const response = await fetch(
        "/api/sellers/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      console.log("Seller registration response:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            data.error ||
            `Registration failed. Status: ${response.status}`
        );
      }

      setSuccess(
  "OTP sent to your email. Please verify your email."
);

// Go to OTP verification page with email
setTimeout(() => {
  navigate("/seller/verify-otp", {
    state: {
      email: form.email,
    },
  });
}, 1000);

    } catch (error) {
      console.error(
        "Seller registration error:",
        error
      );

      setError(
        error.message ||
          "Failed to create seller account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f8fc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          background: "white",
          padding: "45px",
          borderRadius: "20px",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1>CloudCart Seller</h1>

        <h2>Create Seller Account</h2>

        <p>
          Register your store on CloudCart.
        </p>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#dc2626",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: "#dcfce7",
              color: "#15803d",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <input
            type="text"
            name="name"
            placeholder="Seller Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Seller Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
          />

          <input
            type="text"
            name="store_name"
            placeholder="Store Name"
            value={form.store_name}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "16px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {loading
              ? "Creating Account..."
              : "Create Seller Account"}
          </button>
        </form>

        <p style={{ marginTop: "25px" }}>
          Already have a seller account?{" "}
          <Link to="/seller/login">
            Seller Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SellerRegister;



