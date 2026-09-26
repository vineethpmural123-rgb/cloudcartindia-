import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  ShoppingCart,
  Package,
  User,
  IndianRupee,
  CalendarDays,
  RefreshCw,
  Eye,
} from "lucide-react";

import "./AdminOrders.css";

function AdminOrders() {
  // =========================================
  // STATE
  // =========================================

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] =
    useState(null);

  // =========================================
  // LOAD ORDERS FROM BACKEND
  // =========================================

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

const response = await fetch(
  "/api/orders",
  {
    headers: {
      Authorization: `Bearer ${token}`,
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
            "Failed to load orders."
        );
      }

      setOrders(
        Array.isArray(data.orders)
          ? data.orders
          : []
      );
    } catch (error) {
      console.error(
        "Load orders error:",
        error
      );

      setError(
        error.message ||
          "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // LOAD WHEN PAGE OPENS
  // =========================================

  useEffect(() => {
    loadOrders();
  }, []);

  // =========================================
  // UPDATE ORDER STATUS
  // =========================================

  const updateStatus = async (
    orderId,
    newStatus
  ) => {
    try {
      setUpdatingId(orderId);
      setError("");

      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `/api/orders/${orderId}/status`,
        {
          method: "PUT",

          
headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
},
          body: JSON.stringify({
            order_status:
              newStatus,
          }),
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
            "Failed to update order status."
        );
      }

      // Update UI immediately
      setOrders(
        (currentOrders) =>
          currentOrders.map(
            (order) =>
              String(order.id) ===
              String(orderId)
                ? {
                    ...order,
                    order_status:
                      newStatus,
                  }
                : order
          )
      );
    } catch (error) {
      console.error(
        "Update order status error:",
        error
      );

      setError(
        error.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================================
  // STATUS CLASS
  // =========================================

  const getStatusClass = (
    status
  ) => {
    switch (status) {
      case "Delivered":
        return "status-delivered";

      case "Shipped":
        return "status-shipped";

      case "Out for Delivery":
        return "status-out";

      case "Cancelled":
        return "status-cancelled";

      case "Processing":
        return "status-processing";

      default:
        return "status-pending";
    }
  };

  // =========================================
  // CUSTOMER NAME
  // =========================================

  const getCustomerName = (
    order
  ) => {
    return (
      order.customer_name ||
      "Customer"
    );
  };

  // =========================================
  // ORDER DATE
  // =========================================

  const getOrderDate = (
    order
  ) => {
    if (!order.created_at) {
      return "Date unavailable";
    }

    return new Date(
      order.created_at
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================
  // TOTAL REVENUE
  // =========================================

  const totalRevenue =
    orders.reduce(
      (total, order) =>
        total +
        Number(
          order.total_amount || 0
        ),
      0
    );

  // =========================================
  // DELIVERED
  // =========================================

  const deliveredOrders =
    orders.filter(
      (order) =>
        order.order_status ===
        "Delivered"
    ).length;

  // =========================================
  // PENDING
  // =========================================

  const pendingOrders =
    orders.filter(
      (order) =>
        !order.order_status ||
        order.order_status ===
          "Pending" ||
        order.order_status ===
          "Placed"
    ).length;

  // =========================================
  // PAGE
  // =========================================

  return (
    <main className="admin-orders-page">

      {/* =====================================
          BACK
      ===================================== */}

      <div className="admin-orders-top">

        <Link
          to="/admin/dashboard"
          className="admin-orders-back"
        >
          <ArrowLeft size={18} />

          Back to Dashboard
        </Link>

      </div>

      {/* =====================================
          HEADER
      ===================================== */}

      <section className="admin-orders-header">

        <div>

          <span className="admin-orders-label">
            CLOUDCART ADMIN
          </span>

          <h1>
            Orders
          </h1>

          <p>
            View and manage customer
            orders from the database.
          </p>

        </div>

        <button
          type="button"
          className="admin-refresh-orders"
          onClick={loadOrders}
          disabled={loading}
        >
          <RefreshCw
            size={18}
            className={
              loading
                ? "refresh-spinning"
                : ""
            }
          />

          Refresh
        </button>

      </section>

      {/* =====================================
          ERROR
      ===================================== */}

      {error && (
        <div className="admin-orders-error">

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={loadOrders}
          >
            Try Again
          </button>

        </div>
      )}

      {/* =====================================
          SUMMARY
      ===================================== */}

      <section className="admin-order-summary">

        {/* TOTAL ORDERS */}

        <div className="admin-summary-card">

          <div className="summary-icon blue">
            <ShoppingCart size={21} />
          </div>

          <div>

            <span>
              Total Orders
            </span>

            <strong>
              {orders.length}
            </strong>

          </div>

        </div>

        {/* DELIVERED */}

        <div className="admin-summary-card">

          <div className="summary-icon green">
            <Package size={21} />
          </div>

          <div>

            <span>
              Delivered
            </span>

            <strong>
              {deliveredOrders}
            </strong>

          </div>

        </div>

        {/* REVENUE */}

        <div className="admin-summary-card">

          <div className="summary-icon orange">
            <IndianRupee size={21} />
          </div>

          <div>

            <span>
              Total Revenue
            </span>

            <strong>
              ₹
              {totalRevenue.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

        </div>

        {/* PENDING */}

        <div className="admin-summary-card">

          <div className="summary-icon red">
            <CalendarDays size={21} />
          </div>

          <div>

            <span>
              Pending
            </span>

            <strong>
              {pendingOrders}
            </strong>

          </div>

        </div>

      </section>

      {/* =====================================
          ORDERS CARD
      ===================================== */}

      <section className="admin-orders-card">

        <div className="admin-orders-card-header">

          <div>

            <h2>
              Customer Orders
            </h2>

            <p>
              Orders are loaded directly
              from CloudCart MySQL.
            </p>

          </div>

          <span className="admin-orders-count">
            {orders.length}{" "}
            {orders.length === 1
              ? "Order"
              : "Orders"}
          </span>

        </div>

        {/* ===================================
            LOADING
        =================================== */}

        {loading ? (

          <div className="admin-empty-orders">

            <RefreshCw
              size={45}
              className="refresh-spinning"
            />

            <h3>
              Loading Orders...
            </h3>

            <p>
              Getting orders from
              CloudCart database.
            </p>

          </div>

        ) : orders.length === 0 ? (

          /* =================================
             EMPTY
          ================================= */

          <div className="admin-empty-orders">

            <ShoppingCart size={45} />

            <h3>
              No Orders Yet
            </h3>

            <p>
              Customer orders will
              appear here after checkout.
            </p>

          </div>

        ) : (

          /* =================================
             ORDER LIST
          ================================= */

          <div className="admin-orders-list">

            {orders.map(
              (order) => {

                const orderStatus =
                  order.order_status ||
                  "Placed";

                const orderTotal =
                  Number(
                    order.total_amount ||
                      0
                  );

                return (
                  <article
                    className="admin-order-item"
                    key={order.id}
                  >

                    {/* =======================
                        ORDER
                    ======================= */}

                    <div className="order-main">

                      <div className="order-product-icon">
                        <Package size={21} />
                      </div>

                      <div>

                        <strong>
                          Order #
                          {order.id}
                        </strong>

                        <span>
                          {order.payment_method ||
                            "Cash on Delivery"}
                        </span>

                      </div>

                    </div>

                    {/* =======================
                        CUSTOMER
                    ======================= */}

                    <div className="order-customer">

                      <div className="order-info-icon">
                        <User size={17} />
                      </div>

                      <div>

                        <span>
                          Customer
                        </span>

                        <strong>
                          {getCustomerName(
                            order
                          )}
                        </strong>

                        <small>
                          {
                            order.customer_email
                          }
                        </small>

                      </div>

                    </div>

                    {/* =======================
                        DATE
                    ======================= */}

                    <div className="order-date">

                      <CalendarDays
                        size={17}
                      />

                      <span>
                        {getOrderDate(
                          order
                        )}
                      </span>

                    </div>

                    {/* =======================
                        TOTAL
                    ======================= */}

                    <div className="order-total">

                      <span>
                        Total
                      </span>

                      <strong>
                        ₹
                        {orderTotal.toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                      <small>
                        Payment:{" "}
                        {
                          order.payment_status ||
                          "Pending"
                        }
                      </small>

                    </div>

                    {/* =======================
                        STATUS
                    ======================= */}

                    <div className="order-status">

                      <span
                        className={`order-status-badge ${getStatusClass(
                          orderStatus
                        )}`}
                      >
                        {orderStatus}
                      </span>

                      <select
                        value={
                          orderStatus
                        }
                        disabled={
                          updatingId ===
                          order.id
                        }
                        onChange={(
                          event
                        ) =>
                          updateStatus(
                            order.id,
                            event.target
                              .value
                          )
                        }
                      >

                        <option value="Placed">
                          Placed
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

                    </div>

                    {/* =======================
                        VIEW
                    ======================= */}

                  <Link
  to={`/admin/orders/${order.id}`}
  className="admin-view-order-button"
>
  <Eye size={17} />
  View
</Link>

                  </article>
                );
              }
            )}

          </div>

        )}

      </section>

    </main>
  );
}

export default AdminOrders;



