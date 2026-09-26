import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  ShoppingCart,
  Package,
  IndianRupee,
  Calendar,
} from "lucide-react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      // Get admin token from login
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setError("Admin login token not found. Please login again.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "/api/orders",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",

            // Send admin token to backend
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message || "Unable to load orders."
        );
        setLoading(false);
        return;
      }

      setOrders(data.orders || []);

    } catch (error) {
      console.error("Orders error:", error);

      setError(
        "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Calculate statistics
  const totalOrders = orders.length;

  const deliveredOrders =
    orders.filter(
      (order) =>
        order.status === "Delivered"
    ).length;

  const pendingOrders =
    orders.filter(
      (order) =>
        order.status === "Pending"
    ).length;

  const totalRevenue =
    orders.reduce(
      (total, order) =>
        total +
        Number(order.total_amount || 0),
      0
    );

  return (
    <main style={{ padding: "40px" }}>

      {/* BACK */}

      <Link to="/admin/dashboard">
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "30px",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1>Orders</h1>

          <p>
            View and manage customer orders
            from the database.
          </p>
        </div>

        <button
          onClick={loadOrders}
          disabled={loading}
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div
          style={{
            padding: "15px",
            marginBottom: "20px",
            border: "1px solid red",
            color: "red",
          }}
        >
          {error}
        </div>
      )}

      {/* STATS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div>
          <ShoppingCart />
          <h3>Total Orders</h3>
          <h2>{totalOrders}</h2>
        </div>

        <div>
          <Package />
          <h3>Delivered</h3>
          <h2>{deliveredOrders}</h2>
        </div>

        <div>
          <IndianRupee />
          <h3>Total Revenue</h3>
          <h2>₹{totalRevenue}</h2>
        </div>

        <div>
          <Calendar />
          <h3>Pending</h3>
          <h2>{pendingOrders}</h2>
        </div>
      </div>

      {/* ORDERS */}

      <h2>Customer Orders</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table
          width="100%"
          border="1"
          cellPadding="10"
        >
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>

                <td>
                  {order.customer_name ||
                    order.user_name ||
                    "Customer"}
                </td>

                <td>
                  ₹
                  {order.total_amount ||
                    order.total ||
                    0}
                </td>

                <td>
                  {order.status ||
                    "Pending"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </main>
  );
}

export default Orders;



