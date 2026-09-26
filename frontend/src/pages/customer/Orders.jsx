import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  Package,
  ShoppingBag,
  CalendarDays,
  IndianRupee,
  Eye,
  RefreshCw,
} from "lucide-react";

import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================================
  // LOAD ORDERS
  // =========================================

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem(
          "customerToken"
        );

      if (!token) {
        setError(
          "Please login to view your orders."
        );

        setLoading(false);

        return;
      }

      const response =
        await fetch(
          "/api/orders",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      console.log(
        "Customer orders response:",
        data
      );

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to load orders."
        );
      }

      // =======================================
      // GET ORDERS
      // =======================================

      /*
        Do NOT filter orders by email here.

        The backend API should return the
        orders belonging to the logged-in
        customer.

        Filtering again on the frontend can
        hide valid orders if the email format
        is different.
      */

      const customerOrders =
        Array.isArray(data.orders)
          ? data.orders
          : [];

      setOrders(
        customerOrders
      );

    } catch (error) {
      console.error(
        "Customer orders error:",
        error
      );

      setError(
        error.message ||
          "Unable to load your orders."
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
  // FORMAT DATE
  // =========================================

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================
  // FORMAT MONEY
  // =========================================

  const formatMoney = (value) => {
    return Number(
      value || 0
    ).toLocaleString(
      "en-IN"
    );
  };

  // =========================================
  // STATUS CLASS
  // =========================================

  const getStatusClass = (
    status
  ) => {
    const normalized =
      String(
        status || ""
      )
        .trim()
        .toLowerCase();

    switch (normalized) {

      case "processing":
        return "customer-status-processing";

      case "shipped":
        return "customer-status-shipped";

      case "out for delivery":
        return "customer-status-out";

      case "delivered":
        return "customer-status-delivered";

      case "cancelled":
        return "customer-status-cancelled";

      case "pending":
        return "customer-status-placed";

      case "placed":
        return "customer-status-placed";

      default:
        return "customer-status-placed";
    }
  };

  // =========================================
  // LOADING PAGE
  // =========================================

  if (loading) {
    return (
      <main className="customer-orders-page">

        <div className="customer-orders-loading">

          <RefreshCw
            size={45}
            className="customer-orders-spin"
          />

          <h2>
            Loading Your Orders...
          </h2>

          <p>
            Getting your orders from
            CloudCart.
          </p>

        </div>

      </main>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <main className="customer-orders-page">

      {/* =====================================
          TOP
      ===================================== */}

      <div className="customer-orders-top">

     <Link
  to="/customer/products"
  className="customer-orders-back"
>
  <ArrowLeft size={20} />
  <span>Back to Products</span>
</Link>  


      </div>


      {/* =====================================
          HEADER
      ===================================== */}

      <section className="customer-orders-header">

        <div>

          <span className="customer-orders-label">
            CLOUDCART
          </span>

          <h1>
            My Orders
          </h1>

          <p>
            Track and manage your purchases.
          </p>

        </div>


        <button
          type="button"
          className="customer-orders-refresh"
          onClick={
            loadOrders
          }
        >

          <RefreshCw
            size={17}
          />

          Refresh

        </button>

      </section>


      {/* =====================================
          ERROR
      ===================================== */}

      {error && (
        <div className="customer-orders-error">

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={
              loadOrders
            }
          >
            Try Again
          </button>

        </div>
      )}


      {/* =====================================
          EMPTY ORDERS
      ===================================== */}

      {!error &&
        orders.length === 0 && (

          <section className="customer-orders-empty">

            <div className="customer-empty-icon">

              <ShoppingBag
                size={38}
              />

            </div>


            <h2>
              No Orders Yet
            </h2>


            <p>
              You haven't placed any
              orders yet.
            </p>


            <Link
              to="/customer/products"
              className="customer-shop-button"
            >

              Start Shopping

            </Link>

          </section>

        )}


      {/* =====================================
          ORDERS LIST
      ===================================== */}

      {!error &&
        orders.length > 0 && (

          <section className="customer-orders-list">

            {orders.map(
              (order) => {

                const orderId =
                  order.id ||
                  order.orderId;

                const status =
                  order.order_status ||
                  order.orderStatus ||
                  order.status ||
                  "Pending";

                const total =
                  order.total_amount ??
                  order.totalAmount ??
                  order.total ??
                  0;

                const payment =
                  order.payment_method ||
                  order.paymentMethod ||
                  "Cash on Delivery";

                const date =
                  order.created_at ||
                  order.createdAt ||
                  order.date;


                return (
                  <article
                    className="customer-order-card"
                    key={orderId}
                  >

                    {/* =================================
                        ORDER HEADER
                    ================================= */}

                    <div className="customer-order-top">

                      <div className="customer-order-id">

                        <div className="customer-order-icon">

                          <Package
                            size={21}
                          />

                        </div>


                        <div>

                          <span>
                            Order
                          </span>

                          <strong>
                            #{orderId}
                          </strong>

                        </div>

                      </div>


                      <span
                        className={`customer-order-status ${getStatusClass(
                          status
                        )}`}
                      >
                        {status}
                      </span>

                    </div>


                    {/* =================================
                        ORDER INFORMATION
                    ================================= */}

                    <div className="customer-order-info">


                      {/* DATE */}

                      <div className="customer-order-info-item">

                        <CalendarDays
                          size={17}
                        />

                        <div>

                          <span>
                            Order Date
                          </span>

                          <strong>
                            {formatDate(
                              date
                            )}
                          </strong>

                        </div>

                      </div>


                      {/* TOTAL */}

                      <div className="customer-order-info-item">

                        <IndianRupee
                          size={17}
                        />

                        <div>

                          <span>
                            Total
                          </span>

                          <strong>
                            ₹
                            {formatMoney(
                              total
                            )}
                          </strong>

                        </div>

                      </div>


                      {/* PAYMENT */}

                      <div className="customer-order-info-item">

                        <Package
                          size={17}
                        />

                        <div>

                          <span>
                            Payment
                          </span>

                          <strong>
                            {payment}
                          </strong>

                        </div>

                      </div>

                    </div>


                    {/* =================================
                        PAYMENT STATUS
                    ================================= */}

                    <div className="customer-payment-row">

                      <span>
                        Payment Status
                      </span>

                      <strong>
                        {order.payment_status ||
                          order.paymentStatus ||
                          "Pending"}
                      </strong>

                    </div>


                    {/* =================================
                        ACTIONS
                    ================================= */}

                    <div className="customer-order-actions">

                      <Link
                        to={`/customer/orders/${orderId}`}
                        className="customer-view-order"
                      >

                        <Eye
                          size={17}
                        />

                        View Order

                      </Link>

                    </div>

                  </article>
                );
              }
            )}

          </section>

        )}

    </main>
  );
}

export default Orders;



