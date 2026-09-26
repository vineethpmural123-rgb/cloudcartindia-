import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  IndianRupee,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  Plus,
  ArrowRight,
  LogOut,
} from "lucide-react";

import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  // =========================================
  // DASHBOARD DATA
  // =========================================

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);

  // =========================================
  // LOAD DASHBOARD DATA
  // =========================================

  useEffect(() => {

  const loadDashboardData = async () => {

    try {

      const token =
        localStorage.getItem("adminToken");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // =========================
      // LOAD PRODUCTS
      // =========================

      const productsResponse =
        await fetch(
          "/api/admin/products",
          { headers }
        );

      const productsData =
        await productsResponse.json();

      if (
        productsResponse.ok &&
        productsData.success
      ) {
        setProducts(
          Array.isArray(productsData.products)
            ? productsData.products
            : []
        );
      }

      // =========================
      // LOAD ORDERS
      // =========================

     const ordersResponse =
  await fetch(
    "/api/orders",
    { headers }
  );
      const ordersData =
        await ordersResponse.json();

      if (
        ordersResponse.ok &&
        ordersData.success
      ) {
        setOrders(
          Array.isArray(ordersData.orders)
            ? ordersData.orders
            : []
        );
      }

      // =========================
      // LOAD CUSTOMERS
      // =========================

     const customersResponse =
  await fetch(
    "/api/admin/customers",
    { headers }
  );
      const customersData =
        await customersResponse.json();

      if (
        customersResponse.ok &&
        customersData.success
      ) {
        setCustomers(
          Array.isArray(customersData.customers)
            ? customersData.customers
            : []
        );
      }

    } catch (error) {

      console.error(
        "Dashboard data error:",
        error
      );

    }

  };

  loadDashboardData();

}, []);

    

  // =========================================
  // ADMIN LOGOUT
  // =========================================

  const handleLogout = () => {
    // Only remove the login session.
    // Keep adminUser so the admin can login again.
    localStorage.removeItem("adminLoggedIn");

    navigate("/admin/login", {
      replace: true,
    });
  };

  // =========================================
  // STATISTICS
  // =========================================

  const totalProducts = products.length;

  const totalCustomers = customers.length;

  const totalOrders = orders.length;

  const totalSales = orders.reduce(
    (total, order) =>
      total +
      Number(
        order.total_amount ||
order.total ||
order.amount ||
0
      ),
    0
  );

  // =========================================
  // ORDER STATUS COUNTS
  // =========================================

const pendingOrders = orders.filter(
  (order) =>
    (
      order.order_status ||
      "Pending"
    ) === "Pending"
).length;

  const processingOrders = orders.filter(
    (order) =>
      order.order_status === "Processing"
  ).length;

  const shippedOrders = orders.filter(
    (order) =>
      order.order_status === "Shipped"
  ).length;

  const deliveredOrders = orders.filter(
    (order) =>
      order.order_status === "Delivered"
  ).length;

  // =========================================
  // RECENT ORDERS
  // =========================================

  const recentOrders = orders.slice(0, 5);

  // =========================================
  // STATS
  // =========================================

  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      description: "Products in store",
      className: "blue",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
      description: "Orders received",
      className: "purple",
    },
    {
      title: "Customers",
      value: totalCustomers,
      icon: Users,
      description: "Registered customers",
      className: "green",
    },
    {
      title: "Total Sales",
      value: `₹${totalSales.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      description: "Overall revenue",
      className: "orange",
    },
  ];

  // =========================================
  // STATUS CLASS
  // =========================================

  const getStatusClass = (status) => {
    if (status === "Delivered") {
      return "status-delivered";
    }

    if (status === "Shipped") {
      return "status-shipped";
    }

    if (status === "Processing") {
      return "status-processing";
    }

    if (status === "Cancelled") {
      return "status-cancelled";
    }

    return "status-pending";
  };

  // =========================================
  // RETURN
  // =========================================

  return (
    <main className="admin-dashboard">

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside className="admin-sidebar">

        {/* LOGO */}

        <div className="admin-logo">

          <div className="admin-logo-icon">
            <LayoutDashboard size={22} />
          </div>

          <div>
            <strong>CloudCart</strong>

            <span>
              Admin Panel
            </span>
          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="admin-navigation">

          {/* DASHBOARD */}

          <Link
            to="/admin/dashboard"
            className="admin-nav-item admin-nav-active"
          >
            <LayoutDashboard size={19} />
            Dashboard
          </Link>

          {/* PRODUCTS */}

          <Link
            to="/admin/products"
            className="admin-nav-item"
          >
            <Package size={19} />
            Products
          </Link>

          {/* ORDERS */}

          <Link
            to="/admin/orders"
            className="admin-nav-item"
          >
            <ShoppingCart size={19} />
            Orders
          </Link>

          {/* CUSTOMERS */}

          <Link
            to="/admin/customers"
            className="admin-nav-item"
          >
            <Users size={19} />
            Customers
          </Link>

        </nav>

        {/* SIDEBAR BOTTOM */}

        <div className="admin-sidebar-bottom">

          {/* VIEW STORE */}

          <Link
            to="/customer/dashboard"
            className="view-store-button"
          >
            View Store

            <ArrowRight size={17} />
          </Link>

          {/* LOGOUT */}

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

      </aside>

      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <section className="admin-main">

        {/* ===================================
            HEADER
        =================================== */}

        <header className="admin-header">

          <div>

            <span className="admin-header-label">
              CLOUDCART ADMIN
            </span>

            <h1>
              Dashboard
            </h1>

            <p>
              Manage your store and monitor your
              business performance.
            </p>

          </div>

          <Link
            to="/admin/products/add"
            className="admin-add-product-button"
          >
            <Plus size={18} />
            Add Product
          </Link>

        </header>

        {/* ===================================
            STATISTICS
        =================================== */}

        <section className="admin-stats">

          {stats.map((stat) => {

            const Icon = stat.icon;

            return (
              <article
                className="admin-stat-card"
                key={stat.title}
              >

                <div
                  className={`admin-stat-icon ${stat.className}`}
                >
                  <Icon size={22} />
                </div>

                <div className="admin-stat-content">

                  <span>
                    {stat.title}
                  </span>

                  <strong>
                    {stat.value}
                  </strong>

                  <small>
                    {stat.description}
                  </small>

                </div>

              </article>
            );
          })}

        </section>

        {/* ===================================
            QUICK ACTIONS
        =================================== */}

        <section className="admin-section">

          <div className="admin-section-header">

            <div>

              <h2>
                Quick Actions
              </h2>

              <p>
                Manage your store quickly.
              </p>

            </div>

          </div>

          <div className="admin-quick-actions">

            {/* ADD PRODUCT */}

            <Link
              to="/admin/products/add"
              className="admin-action-card"
            >

              <div className="admin-action-icon blue">
                <Plus size={21} />
              </div>

              <div>

                <strong>
                  Add Product
                </strong>

                <span>
                  Add a new product to your store.
                </span>

              </div>

              <ArrowRight size={18} />

            </Link>

            {/* MANAGE PRODUCTS */}

            <Link
              to="/admin/products"
              className="admin-action-card"
            >

              <div className="admin-action-icon purple">
                <Package size={21} />
              </div>

              <div>

                <strong>
                  Manage Products
                </strong>

                <span>
                  Edit prices, stock and products.
                </span>

              </div>

              <ArrowRight size={18} />

            </Link>

            {/* MANAGE ORDERS */}

            <Link
              to="/admin/orders"
              className="admin-action-card"
            >

              <div className="admin-action-icon green">
                <ShoppingCart size={21} />
              </div>

              <div>

                <strong>
                  Manage Orders
                </strong>

                <span>
                  View and update customer orders.
                </span>

              </div>

              <ArrowRight size={18} />

            </Link>

          </div>

        </section>

        {/* ===================================
            ORDER OVERVIEW
        =================================== */}

        <section className="admin-overview-grid">

          {/* ORDER STATUS */}

          <article className="admin-panel">

            <div className="admin-panel-header">

              <div>

                <h2>
                  Order Overview
                </h2>

                <p>
                  Current order status.
                </p>

              </div>

              <ShoppingCart size={21} />

            </div>

            <div className="order-overview-list">

              {/* PENDING */}

              <div className="overview-item">

                <div className="overview-icon pending">
                  <Clock size={18} />
                </div>

                <div>

                  <strong>
                    Pending
                  </strong>

                  <span>
                    {pendingOrders} orders
                  </span>

                </div>

              </div>

              {/* PROCESSING */}

              <div className="overview-item">

                <div className="overview-icon processing">
                  <Package size={18} />
                </div>

                <div>

                  <strong>
                    Processing
                  </strong>

                  <span>
                    {processingOrders} orders
                  </span>

                </div>

              </div>

              {/* SHIPPED */}

              <div className="overview-item">

                <div className="overview-icon shipped">
                  <Truck size={18} />
                </div>

                <div>

                  <strong>
                    Shipped
                  </strong>

                  <span>
                    {shippedOrders} orders
                  </span>

                </div>

              </div>

              {/* DELIVERED */}

              <div className="overview-item">

                <div className="overview-icon delivered">
                  <CheckCircle size={18} />
                </div>

                <div>

                  <strong>
                    Delivered
                  </strong>

                  <span>
                    {deliveredOrders} orders
                  </span>

                </div>

              </div>

            </div>

          </article>

          {/* SALES OVERVIEW */}

          <article className="admin-panel sales-panel">

            <div className="admin-panel-header">

              <div>

                <h2>
                  Sales Overview
                </h2>

                <p>
                  Current store performance.
                </p>

              </div>

              <TrendingUp size={21} />

            </div>

            <div className="sales-total">

              ₹
              {totalSales.toLocaleString("en-IN")}

            </div>

            <div className="sales-growth">

              <TrendingUp size={16} />

              Total revenue from orders

            </div>

            <div className="sales-bars">

              <div>
                <span style={{ height: "45%" }} />
                <small>Jan</small>
              </div>

              <div>
                <span style={{ height: "65%" }} />
                <small>Feb</small>
              </div>

              <div>
                <span style={{ height: "52%" }} />
                <small>Mar</small>
              </div>

              <div>
                <span style={{ height: "80%" }} />
                <small>Apr</small>
              </div>

              <div>
                <span style={{ height: "70%" }} />
                <small>May</small>
              </div>

              <div>
                <span style={{ height: "92%" }} />
                <small>Jun</small>
              </div>

            </div>

          </article>

        </section>

        {/* ===================================
            RECENT ORDERS
        =================================== */}

        <section className="admin-section">

          <div className="admin-section-header">

            <div>

              <h2>
                Recent Orders
              </h2>

              <p>
                Latest customer orders.
              </p>

            </div>

            <Link
              to="/admin/orders"
              className="admin-view-all"
            >
              View All
              <ArrowRight size={16} />
            </Link>

          </div>

          <div className="admin-orders-table-wrapper">

            {recentOrders.length === 0 ? (

              <div
                style={{
                  padding: "40px",
                  textAlign: "center",
                  color: "#64748b",
                }}
              >
                No orders yet.
              </div>

            ) : (

              <table className="admin-orders-table">

                <thead>

                  <tr>

                    <th>
                      Order ID
                    </th>

                    <th>
                      Customer
                    </th>

                    <th>
                      Product
                    </th>

                    <th>
                      Amount
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {recentOrders.map((order) => {

                    const firstItem =
                      order.items?.[0];

                    const customerName =
                      order.address?.fullName ||
                      order.customerName ||
                      "Customer";

                    const productName =
                      firstItem?.name ||
                      "Multiple Products";

                    return (
                      <tr key={order.id}>

                        <td>

                          <strong>
                            {order.id}
                          </strong>

                        </td>

                        <td>
                          {customerName}
                        </td>

                        <td>
                          {productName}
                        </td>

                        <td>

                          ₹
                          {Number(
                            order.total ||
                              order.amount ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </td>

                        <td>

                          <span
                            className={`admin-order-status ${getStatusClass(
                              order.status ||
                                "Pending"
                            )}`}
                          >
                            {order.status ||
                              "Pending"}
                          </span>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            )}

          </div>

        </section>

      </section>

    </main>
  );
}

export default AdminDashboard;



