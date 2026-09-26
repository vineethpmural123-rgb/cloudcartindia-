import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SellerDashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD DASHBOARD DATA
  // =====================================================

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("sellerToken");

const [productsResponse, ordersResponse] =
  await Promise.all([
   fetch("/api/products/my-products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

    fetch("/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  ]);

      const productsData = await productsResponse.json();
      const ordersData = await ordersResponse.json();

      if (!productsResponse.ok || !productsData.success) {
        throw new Error(
          productsData.message ||
            "Failed to load products."
        );
      }

      if (!ordersResponse.ok || !ordersData.success) {
        throw new Error(
          ordersData.message ||
            "Failed to load orders."
        );
      }

      setProducts(productsData.products || []);
      setOrders(ordersData.orders || []);
    } catch (err) {
      console.error(
        "Dashboard loading error:",
        err
      );

      setError(
        err.message ||
          "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
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
  // STATISTICS
  // =====================================================

  const totalProducts = products.length;

  const totalOrders = orders.length;

  const pendingOrders = orders.filter((order) => {
    const status = String(
      order.status ||
        order.order_status ||
        ""
    ).toLowerCase();

    return (
      status === "pending" ||
      status === "placed"
    );
  }).length;

  const totalSales = orders.reduce(
    (total, order) => {
      const status = String(
        order.status ||
          order.order_status ||
          ""
      ).toLowerCase();

      if (status === "cancelled") {
        return total;
      }

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

  // =====================================================
  // RECENT ORDERS
  // =====================================================

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        Number(b.id || 0) -
        Number(a.id || 0)
    )
    .slice(0, 5);

  // =====================================================
  // LOW STOCK
  // =====================================================

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.stock || 0) <= 5
  );

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div style={styles.page}>

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <div style={styles.sidebar}>

        <h1 style={styles.logo}>
          CloudCart
        </h1>

        <p style={styles.panel}>
          Seller Panel
        </p>

        {/* DASHBOARD */}

        <button
          type="button"
          style={{
            ...styles.menuButton,
            ...styles.activeButton,
          }}
          onClick={() =>
            navigate("/seller/dashboard")
          }
        >
          Dashboard
        </button>

        {/* PRODUCTS */}

        <button
          type="button"
          style={styles.menuButton}
          onClick={() =>
            navigate("/seller/products")
          }
        >
          Products
        </button>

        {/* ADD PRODUCT */}

        <button
          type="button"
          style={styles.menuButton}
          onClick={() =>
            navigate("/seller/products/add")
          }
        >
          Add Product
        </button>

        {/* ORDERS */}

        <button
          type="button"
          style={styles.menuButton}
          onClick={() =>
            navigate("/seller/orders")
          }
        >
          Orders
        </button>

        {/* PROFILE */}

        <button
          type="button"
          style={styles.menuButton}
          onClick={() =>
            navigate("/seller/profile")
          }
        >
          Profile
        </button>

        {/* LOGOUT */}

        <button
          type="button"
          style={styles.logoutButton}
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div style={styles.content}>

        {/* HEADER */}

        <div style={styles.header}>

          <div>
            <h1 style={styles.title}>
              Seller Dashboard
            </h1>

            <p style={styles.subtitle}>
              Welcome to your CloudCart
              seller account.
            </p>
          </div>

          <button
            type="button"
            style={styles.refreshButton}
            onClick={loadDashboard}
          >
            Refresh
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
          <div style={styles.loading}>
            <h2>
              Loading dashboard...
            </h2>
          </div>
        ) : (
          <>

            {/* =================================================
                STAT CARDS
            ================================================= */}

            <div style={styles.cards}>

              <div style={styles.card}>

                <p style={styles.cardLabel}>
                  Total Products
                </p>

                <h2 style={styles.cardNumber}>
                  {totalProducts}
                </h2>

                <button
                  type="button"
                  style={styles.cardButton}
                  onClick={() =>
                    navigate(
                      "/seller/products"
                    )
                  }
                >
                  View Products
                </button>

              </div>

              <div style={styles.card}>

                <p style={styles.cardLabel}>
                  Total Orders
                </p>

                <h2 style={styles.cardNumber}>
                  {totalOrders}
                </h2>

                <button
                  type="button"
                  style={styles.cardButton}
                  onClick={() =>
                    navigate(
                      "/seller/orders"
                    )
                  }
                >
                  View Orders
                </button>

              </div>

              <div style={styles.card}>

                <p style={styles.cardLabel}>
                  Pending Orders
                </p>

                <h2 style={styles.cardNumber}>
                  {pendingOrders}
                </h2>

                <button
                  type="button"
                  style={styles.cardButton}
                  onClick={() =>
                    navigate(
                      "/seller/orders"
                    )
                  }
                >
                  Manage Orders
                </button>

              </div>

              <div style={styles.card}>

                <p style={styles.cardLabel}>
                  Total Sales
                </p>

                <h2 style={styles.salesNumber}>
                  ₹
                  {totalSales.toLocaleString(
                    "en-IN"
                  )}
                </h2>

                <p style={styles.smallText}>
                  Excluding cancelled orders
                </p>

              </div>

            </div>

            {/* =================================================
                RECENT ORDERS
            ================================================= */}

            <div style={styles.section}>

              <div style={styles.sectionHeader}>

                <h2>
                  Recent Orders
                </h2>

                <button
                  type="button"
                  style={styles.viewAllButton}
                  onClick={() =>
                    navigate(
                      "/seller/orders"
                    )
                  }
                >
                  View All
                </button>

              </div>

              {recentOrders.length === 0 ? (

                <div style={styles.emptyBox}>

                  <div style={styles.emptyIcon}>
                    📦
                  </div>

                  <h3>
                    No Orders Yet
                  </h3>

                  <p>
                    Customer orders will
                    appear here.
                  </p>

                </div>

              ) : (

                <div style={styles.ordersTable}>

                  <div style={styles.tableHeader}>

                    <strong>
                      Order
                    </strong>

                    <strong>
                      Customer
                    </strong>

                    <strong>
                      Amount
                    </strong>

                    <strong>
                      Status
                    </strong>

                  </div>

                  {recentOrders.map(
                    (order) => {

                      const status =
                        order.status ||
                        order.order_status ||
                        "Pending";

                      return (
                        <div
                          key={order.id}
                          style={styles.tableRow}
                        >

                          <span>
                            #{order.id}
                          </span>

                          <span>
                            {order.customer_name ||
                              order.customerName ||
                              "N/A"}
                          </span>

                          <strong>
                            ₹
                            {Number(
                              order.total_amount ||
                                order.total ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                          <span
                            style={styles.status}
                          >
                            {status}
                          </span>

                        </div>
                      );
                    }
                  )}

                </div>

              )}

            </div>

            {/* =================================================
                LOW STOCK
            ================================================= */}

            <div style={styles.section}>

              <div style={styles.sectionHeader}>

                <h2>
                  Low Stock Products
                </h2>

                <button
                  type="button"
                  style={styles.viewAllButton}
                  onClick={() =>
                    navigate(
                      "/seller/products"
                    )
                  }
                >
                  View Products
                </button>

              </div>

              {lowStockProducts.length === 0 ? (

                <div style={styles.emptyBox}>

                  <h3>
                    All products have
                    sufficient stock
                  </h3>

                  <p>
                    No products currently
                    have 5 or fewer items.
                  </p>

                </div>

              ) : (

                <div style={styles.stockList}>

                  {lowStockProducts
                    .slice(0, 5)
                    .map((product) => (

                      <div
                        key={product.id}
                        style={styles.stockItem}
                      >

                        <div>

                          <strong>
                            {product.name}
                          </strong>

                          <p>
                            Stock remaining:
                          </p>

                        </div>

                        <span
                          style={
                            styles.stockBadge
                          }
                        >
                          {product.stock}
                        </span>

                      </div>

                    ))}

                </div>

              )}

            </div>

          </>
        )}

      </div>
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
    margin: "0",
    fontSize: "32px",
  },

  panel: {
    fontSize: "20px",
    marginTop: "0",
    marginBottom: "10px",
  },

  menuButton: {
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "8px",
    background: "white",
    color: "#111827",
    fontSize: "18px",
    cursor: "pointer",
  },

  activeButton: {
    background: "#2563eb",
    color: "white",
  },

  logoutButton: {
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "8px",
    background: "#dc2626",
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
    marginTop: "20px",
  },

  content: {
    flex: 1,
    padding: "40px",
    overflowX: "auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  title: {
    fontSize: "42px",
    margin: "0",
    color: "#111827",
  },

  subtitle: {
    fontSize: "19px",
    color: "#6b7280",
  },

  refreshButton: {
    padding: "13px 25px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
  },

  error: {
    padding: "15px",
    marginBottom: "20px",
    background: "#fee2e2",
    color: "#b91c1c",
    borderRadius: "8px",
  },

  loading: {
    background: "white",
    padding: "60px",
    borderRadius: "15px",
    textAlign: "center",
  },

  cards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "30px",
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "15px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.07)",
  },

  cardLabel: {
    color: "#6b7280",
    fontSize: "16px",
    margin: "0",
  },

  cardNumber: {
    fontSize: "40px",
    margin: "15px 0",
    color: "#111827",
  },

  salesNumber: {
    fontSize: "30px",
    margin: "15px 0",
    color: "#2563eb",
  },

  smallText: {
    color: "#6b7280",
    fontSize: "13px",
  },

  cardButton: {
    border: "none",
    background: "transparent",
    color: "#2563eb",
    fontWeight: "bold",
    cursor: "pointer",
    padding: "0",
  },

  section: {
    background: "white",
    padding: "25px",
    borderRadius: "15px",
    marginBottom: "25px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.07)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  viewAllButton: {
    border: "none",
    background: "#2563eb",
    color: "white",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  emptyBox: {
    textAlign: "center",
    padding: "35px",
    color: "#6b7280",
  },

  emptyIcon: {
    fontSize: "45px",
  },

  ordersTable: {
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    overflow: "hidden",
  },

  tableHeader: {
    display: "grid",
    gridTemplateColumns:
      "1fr 2fr 1fr 1fr",
    padding: "15px",
    background: "#f3f4f6",
  },

  tableRow: {
    display: "grid",
    gridTemplateColumns:
      "1fr 2fr 1fr 1fr",
    padding: "18px 15px",
    borderTop:
      "1px solid #e5e7eb",
    alignItems: "center",
  },

  status: {
    display: "inline-block",
    width: "fit-content",
    padding: "6px 12px",
    borderRadius: "20px",
    background: "#fef3c7",
    color: "#92400e",
    fontWeight: "bold",
    fontSize: "13px",
  },

  stockList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  stockItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    border:
      "1px solid #e5e7eb",
    borderRadius: "10px",
  },

  stockBadge: {
    padding: "8px 14px",
    borderRadius: "20px",
    background: "#fee2e2",
    color: "#b91c1c",
    fontWeight: "bold",
  },
};

export default SellerDashboard;



