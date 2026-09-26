import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SellerOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD ORDERS
  // =====================================================

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("sellerToken");

const response = await fetch(
  "/api/orders",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load orders."
        );
      }

      setOrders(data.orders || []);
    } catch (err) {
      console.error("Seller orders error:", err);

      setError(
        err.message || "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("seller");
    localStorage.removeItem("sellerToken");

    navigate("/seller/login");
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    const value = String(
      status || "Pending"
    ).toLowerCase();

    switch (value) {
      case "delivered":
      case "completed":
        return {
          background: "#dcfce7",
          color: "#166534",
        };

      case "cancelled":
        return {
          background: "#fee2e2",
          color: "#b91c1c",
        };

      case "shipped":
      case "out for delivery":
        return {
          background: "#dbeafe",
          color: "#1d4ed8",
        };

      case "confirmed":
      case "processing":
        return {
          background: "#ede9fe",
          color: "#6d28d9",
        };

      default:
        return {
          background: "#fef3c7",
          color: "#92400e",
        };
    }
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div style={styles.page}>

      {/* SIDEBAR */}

      <aside style={styles.sidebar}>

        <h1 style={styles.logo}>
          CloudCart
        </h1>

        <p style={styles.panel}>
          Seller Panel
        </p>

        <button
          style={styles.menuButton}
          onClick={() =>
            navigate("/seller/dashboard")
          }
        >
          Dashboard
        </button>

        <button
          style={styles.menuButton}
          onClick={() =>
            navigate("/seller/products")
          }
        >
          Products
        </button>

        <button
          style={styles.menuButton}
          onClick={() =>
            navigate("/seller/products/add")
          }
        >
          Add Product
        </button>

        <button
          style={{
            ...styles.menuButton,
            ...styles.activeButton,
          }}
        >
          Orders
        </button>

        <button
          style={styles.menuButton}
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

      </aside>

      {/* MAIN */}

      <main style={styles.content}>

        <div style={styles.header}>

          <div>
            <h1 style={styles.title}>
              Orders
            </h1>

            <p style={styles.subtitle}>
              Manage customer orders from
              your CloudCart store.
            </p>
          </div>

          <button
            style={styles.refreshButton}
            onClick={loadOrders}
          >
            ↻ Refresh
          </button>

        </div>

        {/* ERROR */}

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <div style={styles.messageBox}>
            <div style={styles.spinner}>
              ⏳
            </div>

            <h2>
              Loading orders...
            </h2>

            <p>
              Please wait while we load
              orders from the server.
            </p>
          </div>
        ) : orders.length === 0 ? (

          <div style={styles.messageBox}>

            <div style={styles.emptyIcon}>
              📦
            </div>

            <h2>
              No Orders Yet
            </h2>

            <p>
              Orders will appear here when
              customers place orders.
            </p>

          </div>

        ) : (

          <div style={styles.ordersContainer}>

            <div style={styles.orderCount}>
              Total Orders:{" "}
              <strong>
                {orders.length}
              </strong>
            </div>

            {orders.map((order) => {

              const orderStatus =
                order.status ||
                order.order_status ||
                "Pending";

              const customerName =
                order.customer_name ||
                order.customerName ||
                "N/A";

              const customerEmail =
                order.customer_email ||
                order.customerEmail ||
                "N/A";

              const total =
                Number(
                 order.seller_total ||
                  order.total ||
                  0
                );

              const orderDate =
                order.created_at ||
                order.createdAt;

              return (
                <div
                  key={order.id}
                  style={styles.orderCard}
                >

                  {/* HEADER */}

                  <div
                    style={styles.orderHeader}
                  >

                    <div>

                      <h2
                        style={styles.orderTitle}
                      >
                        Order #{order.id}
                      </h2>

                      <p
                        style={styles.orderDate}
                      >
                        {orderDate
                          ? new Date(
                              orderDate
                            ).toLocaleString(
                              "en-IN"
                            )
                          : "Date unavailable"}
                      </p>

                    </div>

                    <span
                      style={{
                        ...styles.status,
                        ...getStatusStyle(
                          orderStatus
                        ),
                      }}
                    >
                      {orderStatus}
                    </span>

                  </div>

                  {/* CUSTOMER */}

                  <div style={styles.section}>

                    <h3>
                      Customer
                    </h3>

                    <p>
                      <strong>
                        Name:
                      </strong>{" "}
                      {customerName}
                    </p>

                    <p>
                      <strong>
                        Email:
                      </strong>{" "}
                      {customerEmail}
                    </p>

                    <p>
                      <strong>
                        Phone:
                      </strong>{" "}
                      {order.phone || "N/A"}
                    </p>

                  </div>

                  {/* TOTAL */}

                  <div
                    style={styles.totalSection}
                  >

                    <span>
                      Total Amount
                    </span>

                    <strong>
                      ₹
                      {total.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>

                  {/* VIEW */}

                  <button
                    style={styles.viewButton}
                    onClick={() =>
                      navigate(
                        `/seller/orders/${order.id}`
                      )
                    }
                  >
                    View Order →
                  </button>

                </div>
              );
            })}

          </div>
        )}

      </main>
    </div>
  );
}


// =====================================================
// STYLES
// =====================================================

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
    fontSize: "30px",
  },

  panel: {
    color: "#9ca3af",
    fontSize: "15px",
    marginTop: 0,
    marginBottom: "10px",
  },

  menuButton: {
    width: "100%",
    padding: "13px 15px",
    border: "none",
    borderRadius: "8px",
    background: "#1f2937",
    color: "white",
    fontSize: "16px",
    textAlign: "left",
    cursor: "pointer",
  },

  activeButton: {
    background: "#2563eb",
  },

  logoutButton: {
    width: "100%",
    padding: "13px 15px",
    border: "none",
    borderRadius: "8px",
    background: "#dc2626",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "20px",
  },

  content: {
    flex: 1,
    padding: "40px",
    minWidth: 0,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
  },

  title: {
    fontSize: "42px",
    margin: 0,
    color: "#111827",
  },

  subtitle: {
    fontSize: "17px",
    color: "#6b7280",
    marginTop: "8px",
  },

  refreshButton: {
    padding: "12px 22px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
  },

  error: {
    padding: "15px 18px",
    background: "#fee2e2",
    color: "#b91c1c",
    borderRadius: "10px",
    marginBottom: "20px",
  },

  messageBox: {
    background: "white",
    padding: "60px 30px",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.06)",
  },

  spinner: {
    fontSize: "35px",
  },

  emptyIcon: {
    fontSize: "50px",
  },

  ordersContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  orderCount: {
    fontSize: "18px",
    color: "#374151",
  },

  orderCard: {
    background: "white",
    padding: "25px",
    borderRadius: "15px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.06)",
  },

  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    borderBottom:
      "1px solid #e5e7eb",
    paddingBottom: "15px",
  },

  orderTitle: {
    margin: 0,
    fontSize: "23px",
    color: "#111827",
  },

  orderDate: {
    color: "#6b7280",
    marginBottom: 0,
  },

  status: {
    padding: "8px 15px",
    borderRadius: "20px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  section: {
    padding: "15px 0",
    color: "#374151",
  },

  totalSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop:
      "1px solid #e5e7eb",
    paddingTop: "18px",
    fontSize: "20px",
  },

  viewButton: {
    marginTop: "20px",
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default SellerOrders;



