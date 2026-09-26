import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SellerEarnings() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // LOAD ORDERS
  // =========================================

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/orders"
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load orders."
        );
      }

      setOrders(data.orders || []);
    } catch (err) {
      console.error("Earnings error:", err);

      setError(
        err.message || "Failed to load earnings."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    localStorage.removeItem("seller");
    localStorage.removeItem("sellerToken");

    navigate("/seller/login");
  };

  // =========================================
  // CALCULATE EARNINGS
  // =========================================

  const deliveredOrders = orders.filter(
    (order) =>
      String(
        order.status ||
          order.order_status ||
          ""
      ).toLowerCase() === "delivered"
  );

  const totalOrders = orders.length;

  const totalEarnings = deliveredOrders.reduce(
    (total, order) => {
      return (
        total +
        Number(
          order.total_amount ||
            order.total ||
            0
        )
      );
    },
    0
  );

  const pendingAmount = orders
    .filter((order) => {
      const status = String(
        order.status ||
          order.order_status ||
          ""
      ).toLowerCase();

      return (
        status !== "delivered" &&
        status !== "cancelled"
      );
    })
    .reduce((total, order) => {
      return (
        total +
        Number(
          order.total_amount ||
            order.total ||
            0
        )
      );
    }, 0);

  const cancelledOrders = orders.filter(
    (order) =>
      String(
        order.status ||
          order.order_status ||
          ""
      ).toLowerCase() === "cancelled"
  ).length;

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.spinner}></div>
        <h2>Loading earnings...</h2>
      </div>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <div style={styles.page}>

      {/* =====================================
          SIDEBAR
      ====================================== */}

      <aside style={styles.sidebar}>

        <div>
          <h1 style={styles.logo}>
            CloudCart
          </h1>

          <p style={styles.panel}>
            Seller Panel
          </p>
        </div>

        <nav style={styles.navigation}>

          <button
            style={styles.menuButton}
            onClick={() =>
              navigate("/seller/dashboard")
            }
          >
            🏠 Dashboard
          </button>

          <button
            style={styles.menuButton}
            onClick={() =>
              navigate("/seller/products")
            }
          >
            📦 Products
          </button>

          <button
            style={styles.menuButton}
            onClick={() =>
              navigate("/seller/products/add")
            }
          >
            ➕ Add Product
          </button>

          <button
            style={styles.menuButton}
            onClick={() =>
              navigate("/seller/inventory")
            }
          >
            📊 Inventory
          </button>

          <button
            style={styles.menuButton}
            onClick={() =>
              navigate("/seller/orders")
            }
          >
            🛒 Orders
          </button>

          <button
            style={{
              ...styles.menuButton,
              ...styles.activeMenu,
            }}
          >
            💰 Earnings
          </button>

          <button
            style={styles.menuButton}
            onClick={() =>
              navigate("/seller/store")
            }
          >
            🏪 My Store
          </button>

          <button
            style={styles.menuButton}
            onClick={() =>
              navigate("/seller/profile")
            }
          >
            👤 Profile
          </button>

        </nav>

        <button
          style={styles.logoutButton}
          onClick={handleLogout}
        >
          Logout
        </button>

      </aside>


      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <main style={styles.content}>

        {/* HEADER */}

        <div style={styles.header}>

          <div>
            <h1 style={styles.title}>
              Earnings
            </h1>

            <p style={styles.subtitle}>
              Track your sales and earnings.
            </p>
          </div>

          <button
            style={styles.refreshButton}
            onClick={loadOrders}
          >
            🔄 Refresh
          </button>

        </div>


        {/* ERROR */}

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}


        {/* =====================================
            STAT CARDS
        ====================================== */}

        <section style={styles.statsGrid}>

          <div style={styles.statCard}>

            <div style={styles.statIcon}>
              💰
            </div>

            <div>
              <p style={styles.statLabel}>
                Total Earnings
              </p>

              <h2 style={styles.statValue}>
                ₹
                {totalEarnings.toLocaleString(
                  "en-IN"
                )}
              </h2>
            </div>

          </div>


          <div style={styles.statCard}>

            <div style={styles.statIcon}>
              📦
            </div>

            <div>
              <p style={styles.statLabel}>
                Total Orders
              </p>

              <h2 style={styles.statValue}>
                {totalOrders}
              </h2>
            </div>

          </div>


          <div style={styles.statCard}>

            <div style={styles.statIcon}>
              ⏳
            </div>

            <div>
              <p style={styles.statLabel}>
                Pending Amount
              </p>

              <h2 style={styles.statValue}>
                ₹
                {pendingAmount.toLocaleString(
                  "en-IN"
                )}
              </h2>
            </div>

          </div>


          <div style={styles.statCard}>

            <div style={styles.statIcon}>
              ❌
            </div>

            <div>
              <p style={styles.statLabel}>
                Cancelled Orders
              </p>

              <h2 style={styles.statValue}>
                {cancelledOrders}
              </h2>
            </div>

          </div>

        </section>


        {/* =====================================
            DELIVERED ORDERS
        ====================================== */}

        <section style={styles.card}>

          <div style={styles.cardHeader}>

            <div>
              <h2 style={styles.cardTitle}>
                Completed Sales
              </h2>

              <p style={styles.cardSubtitle}>
                Earnings from delivered orders.
              </p>
            </div>

            <span style={styles.countBadge}>
              {deliveredOrders.length} Orders
            </span>

          </div>


          {deliveredOrders.length === 0 ? (

            <div style={styles.empty}>

              <div style={styles.emptyIcon}>
                💰
              </div>

              <h3>
                No completed sales yet
              </h3>

              <p>
                Your delivered orders will
                appear here.
              </p>

            </div>

          ) : (

            <div style={styles.ordersList}>

              {deliveredOrders.map(
                (order, index) => {

                  const amount = Number(
                    order.total_amount ||
                      order.total ||
                      0
                  );

                  return (
                    <div
                      key={
                        order.id ||
                        index
                      }
                      style={styles.orderRow}
                    >

                      <div>

                        <h3
                          style={
                            styles.orderTitle
                          }
                        >
                          Order #
                          {order.id}
                        </h3>

                        <p
                          style={
                            styles.orderDate
                          }
                        >
                          {order.created_at ||
                          order.createdAt
                            ? new Date(
                                order.created_at ||
                                  order.createdAt
                              ).toLocaleString()
                            : "Date unavailable"}
                        </p>

                      </div>

                      <div
                        style={
                          styles.orderRight
                        }
                      >

                        <span
                          style={
                            styles.deliveredBadge
                          }
                        >
                          Delivered
                        </span>

                        <strong
                          style={
                            styles.orderAmount
                          }
                        >
                          ₹
                          {amount.toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </section>


        {/* =====================================
            QUICK ACTIONS
        ====================================== */}

        <section style={styles.quickCard}>

          <h2>
            Quick Actions
          </h2>

          <div style={styles.quickGrid}>

            <button
              style={styles.quickButton}
              onClick={() =>
                navigate(
                  "/seller/products"
                )
              }
            >
              📦
              <span>
                Manage Products
              </span>
            </button>

            <button
              style={styles.quickButton}
              onClick={() =>
                navigate(
                  "/seller/orders"
                )
              }
            >
              🛒
              <span>
                Manage Orders
              </span>
            </button>

            <button
              style={styles.quickButton}
              onClick={() =>
                navigate(
                  "/seller/inventory"
                )
              }
            >
              📊
              <span>
                Check Inventory
              </span>
            </button>

            <button
              style={styles.quickButton}
              onClick={() =>
                navigate(
                  "/seller/store"
                )
              }
            >
              🏪
              <span>
                View Store
              </span>
            </button>

          </div>

        </section>

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
    fontFamily:
      "Arial, Helvetica, sans-serif",
    color: "#111827",
  },

  sidebar: {
    width: "250px",
    minHeight: "100vh",
    background: "#111827",
    color: "white",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
  },

  logo: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "800",
  },

  panel: {
    marginTop: "6px",
    color: "#9ca3af",
    fontSize: "15px",
  },

  navigation: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginTop: "25px",
  },

  menuButton: {
    width: "100%",
    padding: "13px 15px",
    border: "none",
    borderRadius: "8px",
    background: "transparent",
    color: "#d1d5db",
    textAlign: "left",
    fontSize: "15px",
    cursor: "pointer",
  },

  activeMenu: {
    background: "#2563eb",
    color: "white",
    fontWeight: "700",
  },

  logoutButton: {
    marginTop: "auto",
    width: "100%",
    padding: "13px",
    border: "none",
    borderRadius: "8px",
    background: "#dc2626",
    color: "white",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },

  content: {
    flex: 1,
    marginLeft: "250px",
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
    margin: 0,
    fontSize: "38px",
  },

  subtitle: {
    marginTop: "7px",
    color: "#6b7280",
    fontSize: "16px",
  },

  refreshButton: {
    padding: "12px 18px",
    border: "1px solid #d1d5db",
    borderRadius: "9px",
    background: "white",
    color: "#111827",
    fontWeight: "700",
    cursor: "pointer",
  },

  error: {
    padding: "15px",
    marginBottom: "25px",
    borderRadius: "9px",
    background: "#fee2e2",
    color: "#b91c1c",
    fontWeight: "600",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },

  statCard: {
    background: "white",
    borderRadius: "15px",
    padding: "25px",
    display: "flex",
    alignItems: "center",
    gap: "18px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.06)",
    border:
      "1px solid #e5e7eb",
  },

  statIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "12px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
  },

  statLabel: {
    margin: 0,
    color: "#6b7280",
    fontSize: "13px",
  },

  statValue: {
    margin: "5px 0 0",
    fontSize: "24px",
  },

  card: {
    background: "white",
    borderRadius: "16px",
    padding: "28px",
    marginBottom: "25px",
    border:
      "1px solid #e5e7eb",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.05)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  cardTitle: {
    margin: 0,
    fontSize: "22px",
  },

  cardSubtitle: {
    margin: "5px 0 0",
    color: "#6b7280",
  },

  countBadge: {
    padding: "8px 12px",
    borderRadius: "20px",
    background: "#eff6ff",
    color: "#2563eb",
    fontWeight: "700",
    fontSize: "13px",
  },

  ordersList: {
    display: "flex",
    flexDirection: "column",
  },

  orderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    padding: "18px 0",
    borderBottom:
      "1px solid #e5e7eb",
  },

  orderTitle: {
    margin: 0,
    fontSize: "16px",
  },

  orderDate: {
    margin: "5px 0 0",
    color: "#6b7280",
    fontSize: "13px",
  },

  orderRight: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  deliveredBadge: {
    padding: "6px 10px",
    borderRadius: "20px",
    background: "#dcfce7",
    color: "#166534",
    fontSize: "12px",
    fontWeight: "700",
  },

  orderAmount: {
    fontSize: "17px",
  },

  empty: {
    padding: "50px 20px",
    textAlign: "center",
    color: "#6b7280",
  },

  emptyIcon: {
    fontSize: "50px",
    marginBottom: "10px",
  },

  quickCard: {
    background: "white",
    padding: "28px",
    borderRadius: "16px",
    border:
      "1px solid #e5e7eb",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.05)",
  },

  quickGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: "15px",
    marginTop: "20px",
  },

  quickButton: {
    padding: "20px",
    border:
      "1px solid #e5e7eb",
    borderRadius: "12px",
    background: "#f8fafc",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  spinner: {
    width: "40px",
    height: "40px",
    border:
      "4px solid #dbeafe",
    borderTop:
      "4px solid #2563eb",
    borderRadius: "50%",
    marginBottom: "15px",
    animation:
      "spin 1s linear infinite",
  },

};

export default SellerEarnings;



