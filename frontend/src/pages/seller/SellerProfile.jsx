import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SellerProfile() {
  const navigate = useNavigate();

  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("sellerToken");

      if (!token) {
        navigate("/seller/login");
        return;
      }

      const response = await fetch(
        "/api/sellers/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load seller profile."
        );
      }

      setSeller(data.seller);
    } catch (err) {
      console.error(
        "Seller profile error:",
        err
      );

      setError(
        err.message ||
          "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("seller");
    localStorage.removeItem("sellerToken");

    navigate("/seller/login");
  };

  return (
    <div style={styles.page}>

      {/* SIDEBAR */}

      <div style={styles.sidebar}>

        <h2 style={styles.logo}>
          CloudCart
        </h2>

        <p style={styles.panelTitle}>
          Seller Panel
        </p>

        <button
          style={styles.sideButton}
          onClick={() =>
            navigate("/seller/dashboard")
          }
        >
          Dashboard
        </button>

        <button
          style={styles.sideButton}
          onClick={() =>
            navigate("/seller/products")
          }
        >
          Products
        </button>

        <button
          style={styles.sideButton}
          onClick={() =>
            navigate("/seller/add-product")
          }
        >
          Add Product
        </button>

        <button
          style={styles.sideButton}
          onClick={() =>
            navigate("/seller/orders")
          }
        >
          Orders
        </button>

        <button
          style={{
            ...styles.sideButton,
            ...styles.activeButton,
          }}
          onClick={() =>
            navigate("/seller/profile")
          }
        >
          Profile
        </button>

        <button
          style={styles.logoutButton}
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

      {/* CONTENT */}

      <div style={styles.content}>

        <div style={styles.header}>
          <div>
            <h1 style={styles.heading}>
              Seller Profile
            </h1>

            <p style={styles.subtitle}>
              Manage your CloudCart seller account.
            </p>
          </div>

          <button
            style={styles.dashboardButton}
            onClick={() =>
              navigate("/seller/dashboard")
            }
          >
            Dashboard
          </button>
        </div>

        {loading && (
          <div style={styles.card}>
            <h2>
              Loading profile...
            </h2>
          </div>
        )}

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          seller && (
            <div style={styles.profileCard}>

              <div style={styles.avatar}>
                {seller.name
                  ? seller.name
                      .charAt(0)
                      .toUpperCase()
                  : "S"}
              </div>

              <h2 style={styles.name}>
                {seller.name}
              </h2>

              <p style={styles.store}>
                {seller.store_name}
              </p>

              <div style={styles.details}>

                <div style={styles.row}>
                  <span>Name</span>
                  <strong>
                    {seller.name}
                  </strong>
                </div>

                <div style={styles.row}>
                  <span>Email</span>
                  <strong>
                    {seller.email}
                  </strong>
                </div>

                <div style={styles.row}>
                  <span>Phone</span>
                  <strong>
                    {seller.phone || "Not provided"}
                  </strong>
                </div>

                <div style={styles.row}>
                  <span>Store</span>
                  <strong>
                    {seller.store_name}
                  </strong>
                </div>

                <div style={styles.row}>
                  <span>Status</span>
                  <strong style={styles.active}>
                    {seller.status}
                  </strong>
                </div>

                <div style={styles.row}>
                  <span>Seller ID</span>
                  <strong>
                    {seller.id}
                  </strong>
                </div>

              </div>

            </div>
          )}

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background: "#f5f7fb",
    fontFamily: "Arial, sans-serif",
  },

  sidebar: {
    width: "240px",
    minHeight: "100vh",
    background: "#111827",
    color: "white",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    boxSizing: "border-box",
  },

  logo: {
    margin: 0,
    fontSize: "28px",
  },

  panelTitle: {
    margin: "0 0 10px 0",
    fontSize: "18px",
    color: "#d1d5db",
  },

  sideButton: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#111827",
    fontSize: "17px",
    cursor: "pointer",
  },

  activeButton: {
    background: "#2563eb",
    color: "#ffffff",
  },

  logoutButton: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "8px",
    background: "#dc2626",
    color: "#ffffff",
    fontSize: "17px",
    cursor: "pointer",
    marginTop: "10px",
  },

  content: {
    flex: 1,
    padding: "40px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  heading: {
    margin: 0,
    fontSize: "42px",
    color: "#111827",
  },

  subtitle: {
    fontSize: "19px",
    color: "#4b5563",
  },

  dashboardButton: {
    padding: "14px 22px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    background: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  card: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "15px",
  },

  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "15px",
    borderRadius: "8px",
  },

  profileCard: {
    maxWidth: "700px",
    background: "#ffffff",
    padding: "40px",
    borderRadius: "15px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.08)",
  },

  avatar: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    background: "#2563eb",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "40px",
    fontWeight: "bold",
    marginBottom: "20px",
  },

  name: {
    margin: 0,
    fontSize: "30px",
  },

  store: {
    color: "#6b7280",
    fontSize: "18px",
  },

  details: {
    marginTop: "30px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "16px 0",
    borderBottom:
      "1px solid #e5e7eb",
    gap: "20px",
  },

  active: {
    color: "#16a34a",
  },
};

export default SellerProfile;



