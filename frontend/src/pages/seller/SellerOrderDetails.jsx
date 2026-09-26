import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function SellerOrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("Pending");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================
  // LOAD ORDER
  // =========================================

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem(
  "sellerToken"
);

const response = await fetch(
  `/api/orders/${id}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load order."
        );
      }

      setOrder({
  ...data.order,
  items: data.items || [],
});

      setStatus(
        data.order.status ||
          data.order.order_status ||
          "Pending"
      );
    } catch (err) {
      console.error(
        "Order details error:",
        err
      );

      setError(
        err.message ||
          "Failed to load order."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  // =========================================
  // UPDATE ORDER STATUS
  // =========================================

  const handleStatusUpdate = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");
     
      const token = localStorage.getItem(
  "sellerToken"
);
      const response = await fetch(
        `/api/orders/${id}/status`,
        {
          method: "PUT",

          headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
},

          body: JSON.stringify({
            order_status: status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to update order status."
        );
      }

      setOrder((previous) => ({
        ...previous,
        status: status,
        order_status: status,
      }));

      setSuccess(
        "Order status updated successfully."
      );
    } catch (err) {
      console.error(
        "Update status error:",
        err
      );

      setError(
        err.message ||
          "Failed to update order status."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    localStorage.removeItem("seller");
    localStorage.removeItem(
      "sellerToken"
    );

    navigate("/seller/login");
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div style={styles.center}>
        <h2>Loading order...</h2>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error && !order) {
    return (
      <div style={styles.center}>
        <h2>Unable to load order</h2>

        <p style={styles.errorText}>
          {error}
        </p>

        <button
          style={styles.backButton}
          onClick={() =>
            navigate("/seller/orders")
          }
        >
          Back to Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={styles.center}>
        <h2>Order not found</h2>

        <button
          style={styles.backButton}
          onClick={() =>
            navigate("/seller/orders")
          }
        >
          Back to Orders
        </button>
      </div>
    );
  }

  // =========================================
  // ORDER ITEMS
  // =========================================

  const items =
    order.items ||
    order.order_items ||
    [];

  const total = Number(
    order.total_amount ||
      order.total ||
      0
  );


  // =========================================
  // PAGE
  // =========================================

  return (
    <div style={styles.page}>

      {/* SIDEBAR */}

      <div style={styles.sidebar}>

        <h1 style={styles.logo}>
          CloudCart
        </h1>

        <p style={styles.panel}>
          Seller Panel
        </p>

        <button
          style={styles.menuButton}
          onClick={() =>
            navigate(
              "/seller/dashboard"
            )
          }
        >
          Dashboard
        </button>

        <button
          style={styles.menuButton}
          onClick={() =>
            navigate(
              "/seller/products"
            )
          }
        >
          Products
        </button>

        <button
          style={styles.menuButton}
          onClick={() =>
            navigate(
  "/seller/products/add"
)
          }
        >
          Add Product
        </button>

        <button
          style={styles.menuButton}
          onClick={() =>
            navigate(
              "/seller/orders"
            )
          }
        >
          Orders
        </button>

        <button
          style={styles.menuButton}
          onClick={() =>
            navigate(
              "/seller/profile"
            )
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

        <button
          style={styles.backButton}
          onClick={() =>
            navigate(
              "/seller/orders"
            )
          }
        >
          ← Back to Orders
        </button>

        {/* HEADER */}

        <div style={styles.header}>

          <div>

            <h1 style={styles.title}>
              Order #{order.id}
            </h1>

            <p style={styles.subtitle}>
              Order details and customer
              information
            </p>

          </div>

          <div
            style={styles.status}
          >
            {status}
          </div>

        </div>

        {/* SUCCESS */}

        {success && (
          <div style={styles.success}>
            {success}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {/* =====================================
            ORDER STATUS
        ====================================== */}

        <div style={styles.statusCard}>

          <h2>
            Order Status
          </h2>

          <p style={styles.statusDescription}>
            Update the current status of
            this customer order.
          </p>

          <div
            style={styles.statusControls}
          >

            <select
              value={status}
              onChange={(e) => {
                setStatus(
                  e.target.value
                );
                setSuccess("");
              }}
              style={styles.select}
            >

              <option value="Pending">
                Pending
              </option>

              <option value="Confirmed">
                Confirmed
              </option>

              <option value="Processing">
                Processing
              </option>

              <option value="Shipped">
                Shipped
              </option>

              <option value="Out for Delivery">
                Out for Delivery
              </option>

              <option value="Delivered">
                Delivered
              </option>

              <option value="Cancelled">
                Cancelled
              </option>

            </select>

            <button
              style={
                saving
                  ? styles.disabledButton
                  : styles.saveButton
              }
              disabled={saving}
              onClick={
                handleStatusUpdate
              }
            >
              {saving
                ? "Saving..."
                : "Save Status"}
            </button>

          </div>

        </div>

        {/* CUSTOMER INFORMATION */}

        <div style={styles.card}>

          <h2>
            Customer Information
          </h2>

          <div
            style={styles.infoGrid}
          >

            <div>
              <strong>
                Name
              </strong>

              <p>
                {order.customer_name ||
                  order.customerName ||
                  "N/A"}
              </p>
            </div>

            <div>
              <strong>
                Email
              </strong>

              <p>
                {order.customer_email ||
                  order.customerEmail ||
                  "N/A"}
              </p>
            </div>

            <div>
              <strong>
                Phone
              </strong>

              <p>
                {order.phone ||
                  "N/A"}
              </p>
            </div>

            <div>
              <strong>
                Address
              </strong>

              <p>
                {order.address ||
                  order.shipping_address ||
                  "N/A"}
              </p>
            </div>

            <div>
              <strong>
                City
              </strong>

              <p>
                {order.city ||
                  "N/A"}
              </p>
            </div>

            <div>
              <strong>
                State
              </strong>

              <p>
                {order.state ||
                  "N/A"}
              </p>
            </div>

            <div>
              <strong>
                Pincode
              </strong>

              <p>
                {order.pincode ||
                  "N/A"}
              </p>
            </div>

          </div>

        </div>

        {/* ORDER INFORMATION */}

        <div style={styles.card}>

          <h2>
            Order Information
          </h2>

          <div
            style={styles.infoGrid}
          >

            <div>
              <strong>
                Order ID
              </strong>

              <p>
                #{order.id}
              </p>
            </div>

            <div>
              <strong>
                Status
              </strong>

              <p>
                {status}
              </p>
            </div>

            <div>
              <strong>
                Payment Method
              </strong>

              <p>
                {order.payment_method ||
                  order.paymentMethod ||
                  "N/A"}
              </p>
            </div>

            <div>
              <strong>
                Payment Status
              </strong>

              <p>
                {order.payment_status ||
                  "N/A"}
              </p>
            </div>

            <div>
              <strong>
                Order Date
              </strong>

              <p>
                {order.created_at ||
                order.createdAt
                  ? new Date(
                      order.created_at ||
                        order.createdAt
                    ).toLocaleString()
                  : "N/A"}
              </p>
            </div>

          </div>

        </div>

        {/* PRODUCTS */}

        <div style={styles.card}>

          <h2>
            Products
          </h2>

          {items.length === 0 ? (

            <p>
              No product items found
              for this order.
            </p>

          ) : (

            <div>

              {items.map(
                (item, index) => (

                  <div
                    key={
                      item.id ||
                      item.product_id ||
                      index
                    }
                    style={styles.item}
                  >

                    <div>

                      <h3>
                        {item.product_name ||
                          item.name ||
                          "Product"}
                      </h3>

                      <p>
                        Quantity:{" "}
                        {item.quantity ||
                          1}
                      </p>

                      <p>
                        Product ID:{" "}
                        {item.product_id ||
                          item.productId ||
                          "N/A"}
                      </p>

                    </div>

                    <strong>
                      ₹
                      {Number(
                        item.price ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>

                )
              )}

            </div>

          )}

        </div>

        {/* TOTAL */}

        <div style={styles.totalCard}>

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

      </div>

    </div>
  );
}


// =========================================
// STYLES
// =========================================

const styles = {

  page: {
    minHeight: "100vh",
    display: "flex",
    background: "#f5f7fb",
    fontFamily:
      "Arial, sans-serif",
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

  backButton: {
    padding: "12px 20px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    background: "white",
    color: "#111827",
    fontSize: "16px",
    cursor: "pointer",
    marginBottom: "25px",
  },

  header: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  title: {
    fontSize: "42px",
    margin: "0",
    color: "#111827",
  },

  subtitle: {
    fontSize: "18px",
    color: "#6b7280",
  },

  status: {
    padding: "12px 22px",
    borderRadius: "25px",
    background: "#fef3c7",
    color: "#92400e",
    fontWeight: "bold",
    fontSize: "17px",
  },

  statusCard: {
    background: "white",
    padding: "30px",
    borderRadius: "15px",
    marginBottom: "25px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.08)",
  },

  statusDescription: {
    color: "#6b7280",
  },

  statusControls: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginTop: "20px",
  },

  select: {
    padding: "13px 15px",
    borderRadius: "8px",
    border:
      "1px solid #d1d5db",
    fontSize: "16px",
    minWidth: "220px",
  },

  saveButton: {
    padding: "13px 25px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
  },

  disabledButton: {
    padding: "13px 25px",
    border: "none",
    borderRadius: "8px",
    background: "#9ca3af",
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "not-allowed",
  },

  success: {
    padding: "15px",
    background: "#dcfce7",
    color: "#166534",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  error: {
    padding: "15px",
    background: "#fee2e2",
    color: "#b91c1c",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "15px",
    marginBottom: "25px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.08)",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, 1fr)",
    gap: "25px",
    marginTop: "20px",
  },

  item: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    padding: "20px 0",
    borderBottom:
      "1px solid #e5e7eb",
  },

  totalCard: {
    background: "#2563eb",
    color: "white",
    padding: "25px 30px",
    borderRadius: "15px",
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    fontSize: "24px",
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily:
      "Arial, sans-serif",
  },

  errorText: {
    color: "#b91c1c",
    marginBottom: "20px",
  },

};

export default SellerOrderDetails;



