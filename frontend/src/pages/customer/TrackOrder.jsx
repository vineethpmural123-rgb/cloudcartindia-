import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Package,
  CheckCircle,
  Truck,
  Clock,
  XCircle,
  RefreshCw,
} from "lucide-react";

function TrackOrder() {

  const { id } = useParams();

  const [order, setOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [cancelling, setCancelling] =
    useState(false);

  const [message, setMessage] =
    useState("");


  // =====================================================
  // LOAD ORDER
  // =====================================================

  const loadOrder = async () => {

    try {

      setLoading(true);
      setError("");
      setMessage("");

      const token =
        localStorage.getItem(
          "customerToken"
        );

      const response =
        await fetch(
          `/api/orders/${id}`,
          {
            headers: token
              ? {
                  Authorization:
                    `Bearer ${token}`,
                }
              : {},
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to load order."
        );
      }

      setOrder(data.order);

    } catch (error) {

      console.error(
        "Track order error:",
        error
      );

      setError(
        error.message ||
          "Unable to load order."
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {
    loadOrder();
  }, [id]);


  // =====================================================
  // CANCEL ORDER
  // =====================================================

  const handleCancelOrder = async () => {

    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this order?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setCancelling(true);
      setError("");
      setMessage("");

      const token =
        localStorage.getItem(
          "customerToken"
        );

      const response =
        await fetch(
          `/api/orders/${id}/cancel`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              ...(token
                ? {
                    Authorization:
                      `Bearer ${token}`,
                  }
                : {}),
            },
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to cancel order."
        );
      }

      setMessage(
        "Order cancelled successfully."
      );

      await loadOrder();

    } catch (error) {

      console.error(
        "Cancel order error:",
        error
      );

      setError(
        error.message ||
          "Unable to cancel order."
      );

    } finally {

      setCancelling(false);

    }
  };


  // =====================================================
  // STATUS
  // =====================================================

  const status =
    order?.order_status ||
    order?.status ||
    "Placed";


  const statuses = [
    "Placed",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];


  const currentIndex =
    statuses.indexOf(status);


  const isCancelled =
    status === "Cancelled";


  const isCancellable = [
    "Placed",
    "Pending",
    "Processing",
  ].includes(status);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div
        style={styles.centerPage}
      >

        <RefreshCw
          size={42}
          style={{
            animation:
              "spin 1s linear infinite",
          }}
        />

        <h2>
          Loading Order...
        </h2>

      </div>
    );
  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error && !order) {

    return (
      <div
        style={styles.centerPage}
      >

        <XCircle
          size={55}
          color="#dc2626"
        />

        <h2>
          Unable to load order
        </h2>

        <p>
          {error}
        </p>

        <Link
          to="/customer/orders"
          style={styles.primaryButton}
        >
          Back to Orders
        </Link>

      </div>
    );
  }


  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div style={styles.page}>

      <div style={styles.container}>

        {/* =============================================
            BACK
        ============================================= */}

        <Link
          to="/customer/orders"
          style={styles.back}
        >
          <ArrowLeft size={18} />

          Back to Orders
        </Link>


        {/* =============================================
            HEADER
        ============================================= */}

        <div style={styles.header}>

          <div>

            <span style={styles.label}>
              CLOUDCART
            </span>

            <h1 style={styles.title}>
              Track Order
            </h1>

            <p style={styles.subtitle}>
              Order #{order?.id}
            </p>

          </div>

          <button
            type="button"
            onClick={loadOrder}
            style={styles.refreshButton}
          >
            <RefreshCw size={17} />

            Refresh
          </button>

        </div>


        {/* =============================================
            SUCCESS
        ============================================= */}

        {message && (
          <div style={styles.success}>
            <CheckCircle size={18} />

            {message}
          </div>
        )}


        {/* =============================================
            ERROR
        ============================================= */}

        {error && (
          <div style={styles.error}>
            <XCircle size={18} />

            {error}
          </div>
        )}


        {/* =============================================
            CANCELLED
        ============================================= */}

        {isCancelled ? (

          <section
            style={styles.cancelledCard}
          >

            <div
              style={
                styles.cancelledIcon
              }
            >
              <XCircle
                size={48}
              />
            </div>

            <h2>
              Order Cancelled
            </h2>

            <p>
              This order has been
              cancelled successfully.
            </p>

          </section>

        ) : (

          <section style={styles.card}>

            <div style={styles.statusHeader}>

              <div>

                <span
                  style={styles.smallLabel}
                >
                  CURRENT STATUS
                </span>

                <h2
                  style={styles.statusTitle}
                >
                  {status}
                </h2>

              </div>

              <div
                style={
                  styles.statusIcon
                }
              >
                <Package size={28} />
              </div>

            </div>


            {/* =========================================
                TIMELINE
            ========================================= */}

            <div style={styles.timeline}>

              {statuses.map(
                (item, index) => {

                  const completed =
                    currentIndex >=
                    index;

                  const isCurrent =
                    currentIndex ===
                    index;

                  let Icon =
                    Clock;

                  if (
                    item === "Placed"
                  ) {
                    Icon =
                      CheckCircle;
                  }

                  if (
                    item === "Processing"
                  ) {
                    Icon =
                      Package;
                  }

                  if (
                    item === "Shipped"
                  ) {
                    Icon =
                      Truck;
                  }

                  if (
                    item ===
                    "Out for Delivery"
                  ) {
                    Icon =
                      Truck;
                  }

                  if (
                    item ===
                    "Delivered"
                  ) {
                    Icon =
                      CheckCircle;
                  }

                  return (
                    <div
                      key={item}
                      style={
                        styles.timelineItem
                      }
                    >

                      <div
                        style={{
                          ...styles.timelineIcon,

                          background:
                            completed
                              ? "#2563eb"
                              : "#e2e8f0",

                          color:
                            completed
                              ? "white"
                              : "#64748b",

                          boxShadow:
                            isCurrent
                              ? "0 0 0 6px rgba(37,99,235,0.12)"
                              : "none",
                        }}
                      >
                        <Icon
                          size={20}
                        />
                      </div>

                      <div
                        style={
                          styles.timelineText
                        }
                      >

                        <strong>
                          {item}
                        </strong>

                        <span>
                          {completed
                            ? "Completed"
                            : "Waiting"}
                        </span>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </section>
        )}


        {/* =============================================
            ORDER INFORMATION
        ============================================= */}

        <section style={styles.card}>

          <h2>
            Delivery Information
          </h2>

          <div style={styles.infoGrid}>

            <div>
              <span style={styles.infoLabel}>
                Customer
              </span>

              <strong>
                {order?.customer_name ||
                  "Customer"}
              </strong>
            </div>

            <div>
              <span style={styles.infoLabel}>
                Phone
              </span>

              <strong>
                {order?.phone ||
                  "Not provided"}
              </strong>
            </div>

            <div
              style={{
                gridColumn:
                  "1 / -1",
              }}
            >
              <span style={styles.infoLabel}>
                Address
              </span>

              <strong>
                {order?.address ||
                  "Address unavailable"}
              </strong>

              <span
                style={{
                  color:
                    "#64748b",
                  marginTop:
                    "5px",
                }}
              >
                {[
                  order?.city,
                  order?.state,
                  order?.pincode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>

          </div>

        </section>


        {/* =============================================
            ORDER TOTAL
        ============================================= */}

        <section style={styles.totalCard}>

          <span>
            Order Total
          </span>

          <strong>
            ₹
            {Number(
              order?.total_amount ||
                0
            ).toLocaleString(
              "en-IN"
            )}
          </strong>

        </section>


        {/* =============================================
            CANCEL
        ============================================= */}

        {isCancellable && (

          <button
            type="button"
            onClick={
              handleCancelOrder
            }
            disabled={cancelling}
            style={
              styles.cancelButton
            }
          >

            <XCircle size={19} />

            {cancelling
              ? "Cancelling..."
              : "Cancel Order"}

          </button>
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
    minHeight:
      "100vh",
    background:
      "#f5f7fb",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    color:
      "#0f172a",
    padding:
      "40px 20px",
  },

  container: {
    maxWidth:
      "1000px",
    margin:
      "0 auto",
  },

  centerPage: {
    minHeight:
      "100vh",
    display:
      "flex",
    flexDirection:
      "column",
    alignItems:
      "center",
    justifyContent:
      "center",
    gap:
      "12px",
    fontFamily:
      "Arial, sans-serif",
    color:
      "#0f172a",
  },

  back: {
    display:
      "inline-flex",
    alignItems:
      "center",
    gap:
      "7px",
    color:
      "#2563eb",
    textDecoration:
      "none",
    fontWeight:
      "700",
    marginBottom:
      "30px",
  },

  header: {
    display:
      "flex",
    justifyContent:
      "space-between",
    alignItems:
      "center",
    gap:
      "20px",
    marginBottom:
      "30px",
  },

  label: {
    color:
      "#2563eb",
    fontSize:
      "13px",
    fontWeight:
      "800",
    letterSpacing:
      "1.5px",
  },

  title: {
    margin:
      "7px 0",
    fontSize:
      "38px",
  },

  subtitle: {
    margin:
      0,
    color:
      "#64748b",
  },

  refreshButton: {
    display:
      "flex",
    alignItems:
      "center",
    gap:
      "7px",
    padding:
      "11px 16px",
    border:
      "1px solid #cbd5e1",
    borderRadius:
      "9px",
    background:
      "white",
    color:
      "#334155",
    fontWeight:
      "700",
    cursor:
      "pointer",
  },

  card: {
    background:
      "white",
    border:
      "1px solid #e2e8f0",
    borderRadius:
      "18px",
    padding:
      "30px",
    marginBottom:
      "22px",
    boxShadow:
      "0 7px 25px rgba(15,23,42,0.05)",
  },

  statusHeader: {
    display:
      "flex",
    justifyContent:
      "space-between",
    alignItems:
      "center",
    marginBottom:
      "35px",
  },

  smallLabel: {
    color:
      "#64748b",
    fontSize:
      "12px",
    fontWeight:
      "800",
    letterSpacing:
      "1px",
  },

  statusTitle: {
    margin:
      "7px 0 0",
    fontSize:
      "28px",
  },

  statusIcon: {
    width:
      "58px",
    height:
      "58px",
    borderRadius:
      "15px",
    background:
      "#eff6ff",
    color:
      "#2563eb",
    display:
      "flex",
    alignItems:
      "center",
    justifyContent:
      "center",
  },

  timeline: {
    display:
      "flex",
    flexDirection:
      "column",
    gap:
      "20px",
  },

  timelineItem: {
    display:
      "flex",
    alignItems:
      "center",
    gap:
      "15px",
  },

  timelineIcon: {
    width:
      "44px",
    height:
      "44px",
    flexShrink:
      0,
    borderRadius:
      "50%",
    display:
      "flex",
    alignItems:
      "center",
    justifyContent:
      "center",
    transition:
      "0.2s",
  },

  timelineText: {
    display:
      "flex",
    flexDirection:
      "column",
    gap:
      "4px",
  },

  success: {
    display:
      "flex",
    alignItems:
      "center",
    gap:
      "8px",
    padding:
      "14px 17px",
    background:
      "#f0fdf4",
    border:
      "1px solid #bbf7d0",
    color:
      "#15803d",
    borderRadius:
      "10px",
    marginBottom:
      "20px",
    fontWeight:
      "700",
  },

  error: {
    display:
      "flex",
    alignItems:
      "center",
    gap:
      "8px",
    padding:
      "14px 17px",
    background:
      "#fef2f2",
    border:
      "1px solid #fecaca",
    color:
      "#dc2626",
    borderRadius:
      "10px",
    marginBottom:
      "20px",
    fontWeight:
      "700",
  },

  cancelledCard: {
    background:
      "white",
    border:
      "1px solid #fecaca",
    borderRadius:
      "18px",
    padding:
      "50px 30px",
    marginBottom:
      "22px",
    textAlign:
      "center",
  },

  cancelledIcon: {
    width:
      "75px",
    height:
      "75px",
    margin:
      "0 auto 15px",
    borderRadius:
      "50%",
    background:
      "#fef2f2",
    color:
      "#dc2626",
    display:
      "flex",
    alignItems:
      "center",
    justifyContent:
      "center",
  },

  infoGrid: {
    display:
      "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap:
      "22px",
    marginTop:
      "22px",
  },

  infoLabel: {
    display:
      "block",
    color:
      "#64748b",
    fontSize:
      "13px",
    marginBottom:
      "6px",
  },

  totalCard: {
    background:
      "#0f172a",
    color:
      "white",
    borderRadius:
      "16px",
    padding:
      "22px 25px",
    display:
      "flex",
    justifyContent:
      "space-between",
    alignItems:
      "center",
    marginBottom:
      "15px",
  },

  cancelButton: {
    width:
      "100%",
    display:
      "flex",
    alignItems:
      "center",
    justifyContent:
      "center",
    gap:
      "8px",
    padding:
      "14px",
    border:
      "1px solid #fecaca",
    borderRadius:
      "10px",
    background:
      "#fff1f2",
    color:
      "#dc2626",
    fontWeight:
      "800",
    cursor:
      "pointer",
  },

  primaryButton: {
    display:
      "inline-block",
    marginTop:
      "15px",
    padding:
      "12px 20px",
    borderRadius:
      "9px",
    background:
      "#2563eb",
    color:
      "white",
    textDecoration:
      "none",
    fontWeight:
      "700",
  },
};

export default TrackOrder;



