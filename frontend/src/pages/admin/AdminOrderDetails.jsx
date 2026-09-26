import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  CheckCircle,
  Truck,
  Clock,
  ShoppingBag,
} from "lucide-react";

import "./AdminOrderDetails.css";

function AdminOrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  // =========================================
  // LOAD ORDER
  // =========================================

 useEffect(() => {
  const loadOrder = async () => {
    try {
      const token =
        localStorage.getItem("adminToken");

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
          "Failed to load order."
        );
      }

      const foundOrder =
        data.orders.find(
          (item) =>
            String(item.id) ===
            String(id)
        );

      setOrder(
        foundOrder || null
      );

    } catch (error) {
      console.error(
        "Load order error:",
        error
      );

      setOrder(null);
    }
  };

  loadOrder();
}, [id]);
   
  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (date) => {
    if (!date) {
      return "Date not available";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  // =========================================
  // ORDER NOT FOUND
  // =========================================

  if (!order) {
    return (
      <main className="order-details-page">

      <Link
  to="/admin/orders"
  className="order-details-back"
>
          <ArrowLeft size={19} />
          Back to Orders
        </Link>

        <section className="order-not-found">

          <Package size={55} />

          <h1>
            Order not found
          </h1>

          <p>
            We couldn't find the order
            you are looking for.
          </p>

          <Link
  to="/admin/orders"
  className="back-orders-button"
>
  Back to Admin Orders
</Link>
        </section>

      </main>
    );
  }

  // =========================================
  // ORDER DATA
  // =========================================

  const items =
    order.items || [];

  const totalItems =
    items.reduce(
      (total, item) =>
        total +
        Number(
          item.quantity || 0
        ),
      0
    );

  const calculatedSubtotal =
    items.reduce(
      (total, item) =>
        total +
        Number(
          item.price || 0
        ) *
          Number(
            item.quantity || 0
          ),
      0
    );

  const subtotal =
    order.subtotal !==
    undefined
      ? Number(
          order.subtotal
        )
      : calculatedSubtotal;

  const delivery =
    order.delivery !==
    undefined
      ? Number(
          order.delivery
        )
      : subtotal >= 1000
      ? 0
      : 99;

  const total =
    order.total !==
    undefined
      ? Number(
          order.total
        )
      : subtotal + delivery;

  // =========================================
  // PAYMENT
  // =========================================

  const paymentName =
    order.paymentMethod ===
    "cod"
      ? "Cash on Delivery"
      : order.paymentMethod ===
        "card"
      ? "Credit / Debit Card"
      : order.paymentMethod ===
        "upi"
      ? "UPI"
      : "Payment Method Not Available";

  // =========================================
  // STATUS
  // =========================================

  const currentStatus =
    order.status ||
    "Pending";

  const statusOrder = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
  ];

  const currentStatusIndex =
    statusOrder.indexOf(
      currentStatus
    );

  const isCompleted = (
    status
  ) => {
    return (
      currentStatusIndex >=
      statusOrder.indexOf(
        status
      )
    );
  };

  const isCancelled =
    currentStatus ===
    "Cancelled";

  // =========================================
  // STATUS CLASS
  // =========================================

  const getStatusClass = () => {
    switch (
      currentStatus
    ) {
      case "Processing":
        return "details-status-processing";

      case "Shipped":
        return "details-status-shipped";

      case "Delivered":
        return "details-status-delivered";

      case "Cancelled":
        return "details-status-cancelled";

      default:
        return "details-status-pending";
    }
  };

  return (
    <main className="order-details-page">

      {/* =====================================
          BACK
      ===================================== */}

     <Link
  to="/admin/orders"
  className="order-details-back"
>
  <ArrowLeft size={19} />
  Back to Admin Orders
</Link>

      {/* =====================================
          HEADER
      ===================================== */}

      <section className="order-details-header">

        <div>

          <span className="order-details-label">
            CLOUDCART ORDER
          </span>

          <h1>
            Order Details
          </h1>

          <p>
            Order ID:{" "}
            <strong>
              {order.id}
            </strong>
          </p>

          <p>
            Placed on{" "}
            {formatDate(
              order.createdAt ||
                order.date
            )}
          </p>

        </div>

        <div
          className={
            isCancelled
              ? "order-cancelled-badge"
              : `order-placed-badge ${getStatusClass()}`
          }
        >

          {isCancelled ? (
            <>
              <Clock size={18} />
              Order Cancelled
            </>
          ) : (
            <>
              <CheckCircle size={18} />
              {currentStatus}
            </>
          )}

        </div>

      </section>

      {/* =====================================
          ORDER TRACKING
      ===================================== */}

      <section className="order-status-card">

        {/* ORDER PLACED */}

        <div
          className={
            isCompleted(
              "Pending"
            )
              ? "status-step active"
              : "status-step"
          }
        >

          <div className="status-icon">
            <CheckCircle size={20} />
          </div>

          <div>

            <strong>
              Order Placed
            </strong>

            <span>
              Order received
            </span>

          </div>

        </div>

        <div
          className={
            isCompleted(
              "Processing"
            )
              ? "status-line active-line"
              : "status-line"
          }
        />

        {/* PROCESSING */}

        <div
          className={
            isCompleted(
              "Processing"
            )
              ? "status-step active"
              : "status-step"
          }
        >

          <div className="status-icon">
            <Package size={20} />
          </div>

          <div>

            <strong>
              Processing
            </strong>

            <span>
              Preparing order
            </span>

          </div>

        </div>

        <div
          className={
            isCompleted(
              "Shipped"
            )
              ? "status-line active-line"
              : "status-line"
          }
        />

        {/* SHIPPED */}

        <div
          className={
            isCompleted(
              "Shipped"
            )
              ? "status-step active"
              : "status-step"
          }
        >

          <div className="status-icon">
            <Truck size={20} />
          </div>

          <div>

            <strong>
              Shipped
            </strong>

            <span>
              On the way
            </span>

          </div>

        </div>

        <div
          className={
            isCompleted(
              "Delivered"
            )
              ? "status-line active-line"
              : "status-line"
          }
        />

        {/* DELIVERED */}

        <div
          className={
            isCompleted(
              "Delivered"
            )
              ? "status-step active"
              : "status-step"
          }
        >

          <div className="status-icon">
            <MapPin size={20} />
          </div>

          <div>

            <strong>
              Delivered
            </strong>

            <span>
              {currentStatus ===
              "Delivered"
                ? "Order delivered"
                : "Coming soon"}
            </span>

          </div>

        </div>

      </section>

      {/* =====================================
          CANCELLED
      ===================================== */}

      {isCancelled && (

        <section className="order-cancelled-message">

          <Clock size={20} />

          <div>

            <strong>
              This order has been cancelled.
            </strong>

            <span>
              Please contact support
              if you need assistance.
            </span>

          </div>

        </section>

      )}

      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <div className="order-details-grid">

        {/* ===================================
            LEFT
        =================================== */}

        <div className="order-details-left">

          {/* PRODUCTS */}

          <section className="details-card">

            <div className="details-card-header">

              <div>

                <h2>
                  Ordered Products
                </h2>

                <p>
                  {totalItems} item
                  {totalItems !== 1
                    ? "s"
                    : ""}
                </p>

              </div>

              <ShoppingBag size={24} />

            </div>

            <div className="details-products">

              {items.length === 0 ? (

                <div className="no-order-products">

                  <Package size={35} />

                  <p>
                    No product information
                    available.
                  </p>

                </div>

              ) : (

                items.map(
                  (
                    item,
                    index
                  ) => {

                    const quantity =
                      Number(
                        item.quantity ||
                          0
                      );

                    const price =
                      Number(
                        item.price ||
                          0
                      );

                    const itemTotal =
                      price *
                      quantity;

                    return (

                      <div
                        className="details-product"
                        key={
                          item.id ||
                          index
                        }
                      >

                        <img
                          src={
                            item.image ||
                            "https://via.placeholder.com/100"
                          }
                          alt={
                            item.name ||
                            "Product"
                          }
                        />

                        <div className="details-product-info">

                          <span>
                            {item.category ||
                              "Product"}
                          </span>

                          <h3>
                            {item.name ||
                              "Product"}
                          </h3>

                          <p>
                            Quantity:{" "}
                            {quantity}
                          </p>

                          <p>
                            ₹
                            {price.toLocaleString(
                              "en-IN"
                            )}{" "}
                            each
                          </p>

                        </div>

                        <strong>
                          ₹
                          {itemTotal.toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>

                    );
                  }
                )

              )}

            </div>

          </section>

          {/* =================================
              DELIVERY ADDRESS
          ================================= */}

          <section className="details-card">

            <div className="details-section-title">

              <div className="details-small-icon">
                <MapPin size={20} />
              </div>

              <div>

                <h2>
                  Delivery Address
                </h2>

                <p>
                  Your order will be
                  delivered here
                </p>

              </div>

            </div>

            <div className="address-box">

              <strong>
                {order.address
                  ?.fullName ||
                  "Customer"}
              </strong>

              <p>
                {order.address
                  ?.address ||
                  "Address not available"}
              </p>

              <p>

                {order.address
                  ?.city ||
                  ""}

                {order.address
                  ?.state
                  ? `, ${order.address.state}`
                  : ""}

                {order.address
                  ?.pinCode
                  ? ` - ${order.address.pinCode}`
                  : ""}

              </p>

              <p>
                Phone:{" "}
                {order.address
                  ?.phone ||
                  "Not available"}
              </p>

            </div>

          </section>

          {/* =================================
              PAYMENT
          ================================= */}

          <section className="details-card">

            <div className="details-section-title">

              <div className="details-small-icon">
                <CreditCard size={20} />
              </div>

              <div>

                <h2>
                  Payment Method
                </h2>

                <p>
                  Payment selected
                  during checkout
                </p>

              </div>

            </div>

            <div className="payment-details">

              <strong>
                {paymentName}
              </strong>

              <span>
                Your payment information
                is secure.
              </span>

            </div>

          </section>

        </div>

        {/* ===================================
            RIGHT SUMMARY
        =================================== */}

        <aside className="details-summary">

          <h2>
            Order Summary
          </h2>

          <div className="details-summary-row">

            <span>
              Items
            </span>

            <strong>
              {totalItems}
            </strong>

          </div>

          <div className="details-summary-row">

            <span>
              Subtotal
            </span>

            <strong>
              ₹
              {subtotal.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

          <div className="details-summary-row">

            <span>
              Delivery
            </span>

            <strong className="free-delivery">

              {delivery === 0
                ? "FREE"
                : `₹${delivery.toLocaleString(
                    "en-IN"
                  )}`}

            </strong>

          </div>

          <div className="details-summary-line" />

          <div className="details-summary-total">

            <span>
              Total
            </span>

            <strong>
              ₹
              {total.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

          {/* DATE */}

          <div className="order-summary-info">

            <Clock size={18} />

            <div>

              <strong>
                Order Date
              </strong>

              <span>
                {formatDate(
                  order.createdAt ||
                    order.date
                )}
              </span>

            </div>

          </div>

          {/* PAYMENT */}

          <div className="order-summary-info">

            <CreditCard size={18} />

            <div>

              <strong>
                Payment
              </strong>

              <span>
                {paymentName}
              </span>

            </div>

          </div>

          {/* CURRENT STATUS */}

          <div
            className={`summary-status ${getStatusClass()}`}
          >

            <CheckCircle size={18} />

            <div>

              <strong>
                {currentStatus}
              </strong>

              <span>

                {currentStatus ===
                  "Pending" &&
                  "Your order has been received."}

                {currentStatus ===
                  "Processing" &&
                  "Your order is being prepared."}

                {currentStatus ===
                  "Shipped" &&
                  "Your order is on the way."}

                {currentStatus ===
                  "Delivered" &&
                  "Your order has been delivered."}

                {currentStatus ===
                  "Cancelled" &&
                  "Your order has been cancelled."}

              </span>

            </div>

          </div>

        </aside>

      </div>

    </main>
  );
}

export default AdminOrderDetails;



