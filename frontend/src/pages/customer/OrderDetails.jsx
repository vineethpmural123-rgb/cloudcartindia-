import React, { useEffect, useState } from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Package,
  CalendarDays,
  IndianRupee,
  CreditCard,
  MapPin,
  Truck,
  XCircle,
  RefreshCw,
  CheckCircle,
  ShoppingBag,
} from "lucide-react";

import "./OrderDetails.css";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // GET ORDER
  // =====================================================

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("customerToken");

      if (!token) {
        setError(
          "Please login to view your order."
        );

        setLoading(false);
        return;
      }

      const response = await fetch(
        `/api/orders/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log(
        "Order details response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load order."
        );
      }

      const receivedOrder =
        data.order ||
        data.data ||
        data.result ||
        null;

      if (!receivedOrder) {
        throw new Error(
          "Order details were not found."
        );
      }

      setOrder(receivedOrder);

    } catch (err) {
      console.error(
        "Order details error:",
        err
      );

      setError(
        err.message ||
          "Unable to load order."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD ORDER
  // =====================================================

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    const parsedDate = new Date(date);

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
        month: "long",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // MONEY
  // =====================================================

  const formatMoney = (value) => {
    return Number(
      value || 0
    ).toLocaleString("en-IN");
  };

  // =====================================================
  // CANCEL ORDER
  // =====================================================

  const handleCancelOrder = async () => {
    if (!order) {
      return;
    }

    const currentOrderStatus =
      order.order_status ||
      order.orderStatus ||
      order.status ||
      "Pending";

    // Already cancelled
    if (
      currentOrderStatus
        .toLowerCase() ===
        "cancelled"
    ) {
      return;
    }

    // Already delivered
    if (
      currentOrderStatus
        .toLowerCase() ===
        "delivered"
    ) {
      return;
    }

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

      const token =
        localStorage.getItem(
          "customerToken"
        );

      if (!token) {
        setError(
          "Please login again."
        );

        return;
      }

      // =================================================
      // SEND CANCEL REQUEST
      // =================================================

      const response = await fetch(
       `/api/orders/${id}/cancel`,
        {
          method: "PUT",

          headers: {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
},

          body: JSON.stringify({
            order_status:
              "Cancelled",
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "Cancel order response:",
        data
      );

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to cancel order."
        );
      }

      // =================================================
      // UPDATE SCREEN IMMEDIATELY
      // =================================================

      setOrder(
        (previousOrder) => ({
          ...previousOrder,

          order_status:
            "Cancelled",

          orderStatus:
            "Cancelled",

          status:
            "Cancelled",
        })
      );

      alert(
        "Order cancelled successfully."
      );

    } catch (err) {
      console.error(
        "Cancel order error:",
        err
      );

      setError(
        err.message ||
          "Unable to cancel order."
      );

    } finally {
      setCancelling(false);
    }
  };

  // =====================================================
  // GET STATUS
  // =====================================================

  const getStatus = () => {
    return (
      order?.order_status ||
      order?.orderStatus ||
      order?.status ||
      "Pending"
    );
  };

  // =====================================================
  // GET TOTAL
  // =====================================================

  const getTotal = () => {
    return (
      order?.total_amount ??
      order?.totalAmount ??
      order?.total ??
      0
    );
  };

  // =====================================================
  // PAYMENT METHOD
  // =====================================================

  const getPaymentMethod = () => {
    return (
      order?.payment_method ||
      order?.paymentMethod ||
      "Cash on Delivery"
    );
  };

  // =====================================================
  // PAYMENT STATUS
  // =====================================================

  const getPaymentStatus = () => {
    return (
      order?.payment_status ||
      order?.paymentStatus ||
      "Pending"
    );
  };

  // =====================================================
  // DATE
  // =====================================================

  const getDate = () => {
    return (
      order?.created_at ||
      order?.createdAt ||
      order?.date
    );
  };

  // =====================================================
  // ITEMS
  // =====================================================

  const getItems = () => {
    if (
      Array.isArray(
        order?.items
      )
    ) {
      return order.items;
    }

    if (
      Array.isArray(
        order?.order_items
      )
    ) {
      return order.order_items;
    }

    if (
      Array.isArray(
        order?.orderItems
      )
    ) {
      return order.orderItems;
    }

    if (
      Array.isArray(
        order?.products
      )
    ) {
      return order.products;
    }

    return [];
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="order-details-page">

        <div className="order-details-loading">

          <RefreshCw
            size={45}
            className="order-details-spin"
          />

          <h2>
            Loading Order...
          </h2>

          <p>
            Getting your order details.
          </p>

        </div>

      </main>
    );
  }

  // =====================================================
  // ORDER NOT FOUND
  // =====================================================

  if (!order) {
    return (
      <main className="order-details-page">

        <div className="order-details-error">

          <Package size={50} />

          <h1>
            Order Not Found
          </h1>

          <p>
            {error ||
              "We could not find this order."}
          </p>

          <Link
            to="/customer/orders"
            className="order-back-button"
          >
            <ArrowLeft size={18} />
            Back to Orders
          </Link>

        </div>

      </main>
    );
  }

  // =====================================================
  // VALUES
  // =====================================================

  const status =
    getStatus();

  const total =
    getTotal();

  const paymentMethod =
    getPaymentMethod();

  const paymentStatus =
    getPaymentStatus();

  const orderDate =
    getDate();

  const items =
    getItems();

  const normalizedStatus =
    String(status)
      .trim()
      .toLowerCase();

  const canCancel =
    normalizedStatus !==
      "cancelled" &&
    normalizedStatus !==
      "delivered";

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="order-details-page">

      {/* =================================================
          TOP
      ================================================= */}

      <div className="order-details-top">

        <Link
          to="/customer/orders"
          className="order-details-back"
        >
          <ArrowLeft size={18} />

          Back to Orders
        </Link>

        <button
          type="button"
          className="order-details-refresh"
          onClick={loadOrder}
        >
          <RefreshCw size={17} />

          Refresh
        </button>

      </div>


      {/* =================================================
          HEADER
      ================================================= */}

      <section className="order-details-header">

        <div>

          <span className="order-details-label">
            CLOUDCART
          </span>

          <h1>
            Order #{id}
          </h1>

          <p>
            View your order information,
            payment and delivery details.
          </p>

        </div>


        <div
          className={`order-details-status status-${normalizedStatus.replace(
            /\s+/g,
            "-"
          )}`}
        >

          {normalizedStatus ===
          "delivered" ? (
            <CheckCircle size={18} />
          ) : normalizedStatus ===
            "cancelled" ? (
            <XCircle size={18} />
          ) : (
            <Package size={18} />
          )}

          {status}

        </div>

      </section>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="order-details-error-message">
          {error}
        </div>
      )}


      {/* =================================================
          MAIN
      ================================================= */}

      <div className="order-details-layout">


        {/* =================================================
            LEFT
        ================================================= */}

        <section className="order-details-left">


          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <div className="order-details-card">

            <div className="order-details-card-title">

              <Package size={21} />

              <div>

                <h2>
                  Order Summary
                </h2>

                <p>
                  Order #{id}
                </p>

              </div>

            </div>


            <div className="order-summary-grid">

              <div className="order-summary-item">

                <CalendarDays
                  size={19}
                />

                <div>

                  <span>
                    Order Date
                  </span>

                  <strong>
                    {formatDate(
                      orderDate
                    )}
                  </strong>

                </div>

              </div>


              <div className="order-summary-item">

                <IndianRupee
                  size={19}
                />

                <div>

                  <span>
                    Total Amount
                  </span>

                  <strong>
                    ₹
                    {formatMoney(
                      total
                    )}
                  </strong>

                </div>

              </div>


              <div className="order-summary-item">

                <CreditCard
                  size={19}
                />

                <div>

                  <span>
                    Payment Method
                  </span>

                  <strong>
                    {paymentMethod}
                  </strong>

                </div>

              </div>


              <div className="order-summary-item">

                <CheckCircle
                  size={19}
                />

                <div>

                  <span>
                    Payment Status
                  </span>

                  <strong>
                    {paymentStatus}
                  </strong>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              PRODUCTS
          ================================================= */}

          <div className="order-details-card">

            <div className="order-details-card-title">

              <ShoppingBag
                size={21}
              />

              <div>

                <h2>
                  Ordered Products
                </h2>

                <p>
                  Products in this order
                </p>

              </div>

            </div>


            {items.length > 0 ? (

              <div className="order-products-list">

                {items.map(
                  (item, index) => {

                    const productName =
                      item.product_name ||
                      item.productName ||
                      item.name ||
                      `Product ${
                        index + 1
                      }`;

                    const quantity =
                      item.quantity ||
                      item.qty ||
                      1;

                    const price =
                      item.price ||
                      item.product_price ||
                      item.productPrice ||
                      0;

                    const image =
                      item.image ||
                      item.product_image ||
                      item.productImage ||
                      "";

                    return (
                      <div
                        className="order-product-row"
                        key={
                          item.id ||
                          item.product_id ||
                          index
                        }
                      >

                        <div className="order-product-image">

                          {image ? (
                            <img
                              src={image}
                              alt={
                                productName
                              }
                            />
                          ) : (
                            <Package
                              size={28}
                            />
                          )}

                        </div>


                        <div className="order-product-info">

                          <strong>
                            {productName}
                          </strong>

                          <span>
                            Quantity:{" "}
                            {quantity}
                          </span>

                        </div>


                        <strong className="order-product-price">

                          ₹
                          {formatMoney(
                            Number(price) *
                              Number(
                                quantity
                              )
                          )}

                        </strong>

                      </div>
                    );
                  }
                )}

              </div>

            ) : (

              <div className="order-no-items">

                <Package size={35} />

                <p>
                  Product details are
                  not available for this
                  order.
                </p>

              </div>

            )}

          </div>


          {/* =================================================
              ADDRESS
          ================================================= */}

          <div className="order-details-card">

            <div className="order-details-card-title">

              <MapPin size={21} />

              <div>

                <h2>
                  Delivery Address
                </h2>

                <p>
                  Shipping information
                </p>

              </div>

            </div>


            <div className="order-address">

              <strong>
                {order.customer_name ||
                  order.customerName ||
                  order.name ||
                  "Customer"}
              </strong>

              <p>
                {order.address ||
                  order.shipping_address ||
                  order.shippingAddress ||
                  "Address information not available."}
              </p>


              {(order.city ||
                order.state ||
                order.pincode) && (

                <p>

                  {order.city || ""}

                  {order.city &&
                  order.state
                    ? ", "
                    : ""}

                  {order.state || ""}

                  {order.pincode
                    ? ` - ${order.pincode}`
                    : ""}

                </p>
              )}


              {(order.phone ||
                order.customer_phone ||
                order.customerPhone) && (

                <p>

                  Phone:{" "}

                  {order.phone ||
                    order.customer_phone ||
                    order.customerPhone}

                </p>
              )}

            </div>

          </div>

        </section>


        {/* =================================================
            RIGHT
        ================================================= */}

        <aside className="order-details-sidebar">


          {/* =================================================
              TOTAL
          ================================================= */}

          <div className="order-details-card">

            <h2>
              Order Total
            </h2>

            <div className="order-total-box">

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


          {/* =================================================
              TRACK
          ================================================= */}

          <div className="order-details-card">

            <div className="order-action-icon">

              <Truck size={23} />

            </div>

            <h2>
              Track Order
            </h2>

            <p>
              Check the latest delivery
              status of your order.
            </p>

            <button
              type="button"
              className="track-order-button"
              onClick={() =>
                navigate(
                  `/customer/track-order/${id}`
                )
              }
            >
              <Truck size={18} />

              Track Order
            </button>

          </div>


          {/* =================================================
              CANCEL
          ================================================= */}

          <div className="order-details-card">

            <div className="order-action-icon cancel-icon">

              <XCircle size={23} />

            </div>

            <h2>
              Cancel Order
            </h2>

            <p>

              {canCancel
                ? "You can cancel this order before it is delivered."
                : normalizedStatus ===
                  "delivered"
                ? "Delivered orders cannot be cancelled."
                : "This order has already been cancelled."}

            </p>


            <button
              type="button"
              className="cancel-order-button"
              disabled={
                !canCancel ||
                cancelling
              }
              onClick={
                handleCancelOrder
              }
            >

              {cancelling ? (

                <>

                  <RefreshCw
                    size={18}
                    className="order-details-spin"
                  />

                  Cancelling...

                </>

              ) : (

                <>

                  <XCircle
                    size={18}
                  />

                  Cancel Order

                </>

              )}

            </button>

          </div>


          {/* =================================================
              BACK
          ================================================= */}

          <Link
            to="/customer/orders"
            className="back-orders-button"
          >

            <ArrowLeft size={18} />

            Back to My Orders

          </Link>

        </aside>

      </div>

    </main>
  );
}

export default OrderDetails;



