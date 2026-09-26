import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SellerInventory() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/products"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load products"
        );
      }

      // Support different backend response formats
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Inventory error:", err);

      setError(
        err.message || "Failed to load inventory."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("seller");
    localStorage.removeItem("sellerToken");

    navigate("/seller/login");
  };

  // =====================================================
  // STOCK HELPERS
  // =====================================================

  const getStock = (product) => {
    return Number(
      product.stock ??
      product.quantity ??
      product.available_stock ??
      0
    );
  };

  const getProductName = (product) => {
    return (
      product.name ||
      product.product_name ||
      "Unnamed Product"
    );
  };

  const getCategory = (product) => {
    return (
      product.category ||
      product.category_name ||
      "General"
    );
  };

  const getPrice = (product) => {
    return Number(
      product.price ??
      product.selling_price ??
      0
    );
  };

  // =====================================================
  // INVENTORY STATS
  // =====================================================

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, product) =>
      total + getStock(product),
    0
  );

  const lowStockProducts = products.filter(
    (product) => {
      const stock = getStock(product);

      return stock > 0 && stock <= 10;
    }
  );

  const outOfStockProducts = products.filter(
    (product) =>
      getStock(product) <= 0
  );

  const inStockProducts = products.filter(
    (product) =>
      getStock(product) > 10
  );

  // =====================================================
  // STOCK STATUS
  // =====================================================

  const getStockStatus = (stock) => {
    if (stock <= 0) {
      return {
        text: "Out of Stock",
        className: "out",
      };
    }

    if (stock <= 10) {
      return {
        text: "Low Stock",
        className: "low",
      };
    }

    return {
      text: "In Stock",
      className: "good",
    };
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="inventory-loading">
        <div className="inventory-spinner"></div>

        <h2>
          Loading inventory...
        </h2>

        <p>
          Please wait.
        </p>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="inventory-page">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="inventory-sidebar">

        <div>
          <h1 className="inventory-logo">
            CloudCart
          </h1>

          <p className="inventory-panel">
            Seller Panel
          </p>
        </div>

        <nav className="inventory-navigation">

          <button
            onClick={() =>
              navigate("/seller/dashboard")
            }
          >
            🏠 Dashboard
          </button>

          <button
            onClick={() =>
              navigate("/seller/products")
            }
          >
            📦 Products
          </button>

          <button
            onClick={() =>
              navigate("/seller/products/add")
            }
          >
            ➕ Add Product
          </button>

          <button className="inventory-active">
            📊 Inventory
          </button>

          <button
            onClick={() =>
              navigate("/seller/orders")
            }
          >
            🛒 Orders
          </button>

          <button
            onClick={() =>
              navigate("/seller/earnings")
            }
          >
            💰 Earnings
          </button>

          <button
            onClick={() =>
              navigate("/seller/store")
            }
          >
            🏪 My Store
          </button>

          <button
            onClick={() =>
              navigate("/seller/profile")
            }
          >
            👤 Profile
          </button>

        </nav>

        <button
          className="inventory-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </aside>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="inventory-content">

        {/* HEADER */}

        <div className="inventory-header">

          <div>
            <h1>
              Inventory
            </h1>

            <p>
              Manage your product stock
              and availability.
            </p>
          </div>

          <button
            className="inventory-refresh"
            onClick={loadProducts}
          >
            🔄 Refresh
          </button>

        </div>


        {/* ERROR */}

        {error && (
          <div className="inventory-error">
            ⚠️ {error}
          </div>
        )}


        {/* =================================================
            STAT CARDS
        ================================================= */}

        <section className="inventory-stats">

          <div className="inventory-stat-card">

            <div className="inventory-stat-icon blue">
              📦
            </div>

            <div>
              <p>
                Total Products
              </p>

              <h2>
                {totalProducts}
              </h2>
            </div>

          </div>


          <div className="inventory-stat-card">

            <div className="inventory-stat-icon green">
              ✅
            </div>

            <div>
              <p>
                In Stock
              </p>

              <h2>
                {inStockProducts.length}
              </h2>
            </div>

          </div>


          <div className="inventory-stat-card">

            <div className="inventory-stat-icon orange">
              ⚠️
            </div>

            <div>
              <p>
                Low Stock
              </p>

              <h2>
                {lowStockProducts.length}
              </h2>
            </div>

          </div>


          <div className="inventory-stat-card">

            <div className="inventory-stat-icon red">
              ❌
            </div>

            <div>
              <p>
                Out of Stock
              </p>

              <h2>
                {outOfStockProducts.length}
              </h2>
            </div>

          </div>

        </section>


        {/* =================================================
            TOTAL STOCK
        ================================================= */}

        <div className="total-stock-card">

          <div>
            <span>
              Total Available Units
            </span>

            <strong>
              {totalStock.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          <span className="stock-description">
            Across all your products
          </span>

        </div>


        {/* =================================================
            PRODUCT TABLE
        ================================================= */}

        <section className="inventory-table-card">

          <div className="inventory-table-header">

            <div>
              <h2>
                Product Inventory
              </h2>

              <p>
                Current stock levels for
                your products.
              </p>
            </div>

            <button
              className="add-product-button"
              onClick={() =>
                navigate(
                  "/seller/products/add"
                )
              }
            >
              + Add Product
            </button>

          </div>


          {products.length === 0 ? (

            <div className="inventory-empty">

              <div>
                📦
              </div>

              <h3>
                No products found
              </h3>

              <p>
                Add products to start
                managing your inventory.
              </p>

              <button
                onClick={() =>
                  navigate(
                    "/seller/products/add"
                  )
                }
              >
                Add Product
              </button>

            </div>

          ) : (

            <div className="inventory-table-wrapper">

              <table className="inventory-table">

                <thead>
                  <tr>

                    <th>
                      Product
                    </th>

                    <th>
                      Category
                    </th>

                    <th>
                      Price
                    </th>

                    <th>
                      Stock
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {products.map(
                    (product, index) => {

                      const stock =
                        getStock(product);

                      const status =
                        getStockStatus(
                          stock
                        );

                      return (
                        <tr
                          key={
                            product.id ||
                            product._id ||
                            index
                          }
                        >

                          <td>
                            <div className="inventory-product">

                              {product.image ||
                              product.image_url ? (
                                <img
                                  src={
                                    product.image ||
                                    product.image_url
                                  }
                                  alt={getProductName(
                                    product
                                  )}
                                />
                              ) : (
                                <div className="product-placeholder">
                                  📦
                                </div>
                              )}

                              <strong>
                                {getProductName(
                                  product
                                )}
                              </strong>

                            </div>
                          </td>


                          <td>
                            {getCategory(
                              product
                            )}
                          </td>


                          <td>
                            ₹
                            {getPrice(
                              product
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </td>


                          <td>

                            <strong
                              className={
                                stock <= 0
                                  ? "stock-number out-text"
                                  : stock <= 10
                                  ? "stock-number low-text"
                                  : "stock-number"
                              }
                            >
                              {stock}
                            </strong>

                          </td>


                          <td>

                            <span
                              className={`stock-badge ${status.className}`}
                            >
                              {status.text}
                            </span>

                          </td>


                          <td>

                            <button
                              className="edit-inventory-button"
                              onClick={() =>
                                navigate(
                                  `/seller/products/edit/${
                                    product.id ||
                                    product._id
                                  }`
                                )
                              }
                            >
                              Edit
                            </button>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>


      {/* =================================================
          CSS
      ================================================= */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .inventory-page {
          min-height: 100vh;
          background: #f5f7fb;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
          color: #111827;
        }

        .inventory-sidebar {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          width: 250px;
          padding: 28px 20px;
          background: #111827;
          color: white;
          display: flex;
          flex-direction: column;
          z-index: 10;
        }

        .inventory-logo {
          margin: 0;
          font-size: 30px;
          font-weight: 800;
        }

        .inventory-panel {
          margin: 6px 0 0;
          color: #9ca3af;
        }

        .inventory-navigation {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin-top: 25px;
        }

        .inventory-navigation button {
          border: none;
          border-radius: 8px;
          padding: 13px 15px;
          background: transparent;
          color: #d1d5db;
          text-align: left;
          font-size: 15px;
          cursor: pointer;
        }

        .inventory-navigation button:hover {
          background: #1f2937;
          color: white;
        }

        .inventory-navigation
        .inventory-active {
          background: #2563eb;
          color: white;
          font-weight: 700;
        }

        .inventory-logout {
          margin-top: auto;
          border: none;
          border-radius: 8px;
          padding: 13px;
          background: #dc2626;
          color: white;
          font-weight: 700;
          cursor: pointer;
        }

        .inventory-content {
          margin-left: 250px;
          padding: 40px;
        }

        .inventory-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .inventory-header h1 {
          margin: 0;
          font-size: 38px;
        }

        .inventory-header p {
          margin: 7px 0 0;
          color: #6b7280;
          font-size: 16px;
        }

        .inventory-refresh {
          border: 1px solid #d1d5db;
          border-radius: 9px;
          padding: 12px 18px;
          background: white;
          font-weight: 700;
          cursor: pointer;
        }

        .inventory-refresh:hover {
          background: #f8fafc;
        }

        .inventory-error {
          margin-bottom: 25px;
          padding: 15px;
          border: 1px solid #fecaca;
          border-radius: 10px;
          background: #fef2f2;
          color: #b91c1c;
          font-weight: 600;
        }

        .inventory-stats {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 20px;
          margin-bottom: 25px;
        }

        .inventory-stat-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 15px;
          padding: 23px;
          display: flex;
          align-items: center;
          gap: 17px;
          box-shadow:
            0 5px 20px
            rgba(15, 23, 42, 0.05);
        }

        .inventory-stat-icon {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 23px;
        }

        .inventory-stat-icon.blue {
          background: #eff6ff;
        }

        .inventory-stat-icon.green {
          background: #ecfdf5;
        }

        .inventory-stat-icon.orange {
          background: #fff7ed;
        }

        .inventory-stat-icon.red {
          background: #fef2f2;
        }

        .inventory-stat-card p {
          margin: 0;
          color: #6b7280;
          font-size: 13px;
        }

        .inventory-stat-card h2 {
          margin: 5px 0 0;
          font-size: 25px;
        }

        .total-stock-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 15px;
          padding: 22px 25px;
          margin-bottom: 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .total-stock-card div {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .total-stock-card span {
          color: #64748b;
          font-size: 14px;
        }

        .total-stock-card strong {
          font-size: 28px;
        }

        .stock-description {
          color: #64748b;
        }

        .inventory-table-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          box-shadow:
            0 5px 20px
            rgba(15, 23, 42, 0.05);
          overflow: hidden;
        }

        .inventory-table-header {
          padding: 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          border-bottom:
            1px solid #e5e7eb;
        }

        .inventory-table-header h2 {
          margin: 0;
          font-size: 22px;
        }

        .inventory-table-header p {
          margin: 5px 0 0;
          color: #6b7280;
        }

        .add-product-button {
          border: none;
          border-radius: 9px;
          padding: 12px 18px;
          background: #2563eb;
          color: white;
          font-weight: 700;
          cursor: pointer;
        }

        .add-product-button:hover {
          background: #1d4ed8;
        }

        .inventory-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .inventory-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }

        .inventory-table th {
          padding: 15px 20px;
          background: #f8fafc;
          color: #64748b;
          text-align: left;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: .4px;
        }

        .inventory-table td {
          padding: 18px 20px;
          border-top:
            1px solid #e5e7eb;
          font-size: 14px;
        }

        .inventory-product {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 220px;
        }

        .inventory-product img,
        .product-placeholder {
          width: 48px;
          height: 48px;
          border-radius: 9px;
          object-fit: cover;
          border: 1px solid #e5e7eb;
        }

        .product-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f5f9;
          font-size: 20px;
        }

        .stock-number {
          font-size: 16px;
        }

        .low-text {
          color: #ea580c;
        }

        .out-text {
          color: #dc2626;
        }

        .stock-badge {
          display: inline-flex;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }

        .stock-badge.good {
          background: #dcfce7;
          color: #166534;
        }

        .stock-badge.low {
          background: #ffedd5;
          color: #c2410c;
        }

        .stock-badge.out {
          background: #fee2e2;
          color: #b91c1c;
        }

        .edit-inventory-button {
          border: 1px solid #2563eb;
          border-radius: 7px;
          padding: 7px 12px;
          background: white;
          color: #2563eb;
          font-weight: 700;
          cursor: pointer;
        }

        .edit-inventory-button:hover {
          background: #2563eb;
          color: white;
        }

        .inventory-empty {
          padding: 70px 20px;
          text-align: center;
        }

        .inventory-empty > div {
          font-size: 55px;
        }

        .inventory-empty h3 {
          margin: 12px 0 7px;
          font-size: 21px;
        }

        .inventory-empty p {
          color: #6b7280;
          margin-bottom: 20px;
        }

        .inventory-empty button {
          border: none;
          border-radius: 9px;
          padding: 12px 20px;
          background: #2563eb;
          color: white;
          font-weight: 700;
          cursor: pointer;
        }

        .inventory-loading {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: #f5f7fb;
          font-family: Arial, Helvetica, sans-serif;
        }

        .inventory-loading h2 {
          margin-bottom: 5px;
        }

        .inventory-loading p {
          color: #64748b;
        }

        .inventory-spinner {
          width: 42px;
          height: 42px;
          border: 4px solid #dbeafe;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation:
            inventory-spin .8s
            linear infinite;
        }

        @keyframes inventory-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1000px) {
          .inventory-stats {
            grid-template-columns:
              repeat(2, 1fr);
          }
        }

        @media (max-width: 700px) {
          .inventory-sidebar {
            position: static;
            width: 100%;
            min-height: auto;
          }

          .inventory-page {
            display: block;
          }

          .inventory-content {
            margin-left: 0;
            padding: 25px 18px;
          }

          .inventory-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .inventory-stats {
            grid-template-columns: 1fr;
          }

          .total-stock-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .inventory-table-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }

      `}</style>

    </div>
  );
}

export default SellerInventory;



