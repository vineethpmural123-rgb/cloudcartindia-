import React from "react";
import { useNavigate } from "react-router-dom";

function SellerStore() {
  const navigate = useNavigate();

  const seller =
    JSON.parse(localStorage.getItem("seller")) || {};

  const handleLogout = () => {
    localStorage.removeItem("seller");
    localStorage.removeItem("sellerToken");

    navigate("/seller/login");
  };

  return (
    <div className="seller-store-page">

      {/* SIDEBAR */}
      <aside className="seller-store-sidebar">

        <div>
          <h1>CloudCart</h1>
          <p>Seller Panel</p>
        </div>

        <nav>

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

          <button
            onClick={() =>
              navigate("/seller/inventory")
            }
          >
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

          <button className="active">
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
          className="logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </aside>


      {/* MAIN CONTENT */}
      <main className="seller-store-content">

        <header className="seller-store-header">

          <div>
            <span>
              SELLER STORE
            </span>

            <h1>
              My Store
            </h1>

            <p>
              Manage your CloudCart seller store.
            </p>
          </div>

          <button
            className="back-button"
            onClick={() =>
              navigate("/seller/dashboard")
            }
          >
            ← Dashboard
          </button>

        </header>


        {/* STORE CARD */}
        <section className="store-card">

          <div className="store-cover">
            <div className="store-logo">
              CC
            </div>
          </div>

          <div className="store-information">

            <h2>
              {seller.storeName ||
                seller.store_name ||
                "My CloudCart Store"}
            </h2>

            <p className="store-description">
              Welcome to your CloudCart seller store.
              Manage your products, orders and
              inventory from the seller dashboard.
            </p>


            <div className="store-details">

              <div>
                <span>
                  Store Owner
                </span>

                <strong>
                  {seller.name ||
                    seller.fullName ||
                    "Seller"}
                </strong>
              </div>

              <div>
                <span>
                  Email
                </span>

                <strong>
                  {seller.email ||
                    "Not available"}
                </strong>
              </div>

              <div>
                <span>
                  Phone
                </span>

                <strong>
                  {seller.phone ||
                    "Not available"}
                </strong>
              </div>

              <div>
                <span>
                  Status
                </span>

                <strong className="status">
                  Active
                </strong>
              </div>

            </div>

          </div>

        </section>


        {/* QUICK ACTIONS */}
        <section className="quick-actions">

          <h2>
            Store Management
          </h2>

          <div className="quick-grid">

            <button
              onClick={() =>
                navigate("/seller/products")
              }
            >
              <span>📦</span>

              <strong>
                Products
              </strong>

              <small>
                Manage your products
              </small>
            </button>


            <button
              onClick={() =>
                navigate("/seller/products/add")
              }
            >
              <span>➕</span>

              <strong>
                Add Product
              </strong>

              <small>
                Add a new product
              </small>
            </button>


            <button
              onClick={() =>
                navigate("/seller/inventory")
              }
            >
              <span>📊</span>

              <strong>
                Inventory
              </strong>

              <small>
                Check product stock
              </small>
            </button>


            <button
              onClick={() =>
                navigate("/seller/orders")
              }
            >
              <span>🛒</span>

              <strong>
                Orders
              </strong>

              <small>
                Manage customer orders
              </small>
            </button>


            <button
              onClick={() =>
                navigate("/seller/earnings")
              }
            >
              <span>💰</span>

              <strong>
                Earnings
              </strong>

              <small>
                View your earnings
              </small>
            </button>


            <button
              onClick={() =>
                navigate("/seller/profile")
              }
            >
              <span>👤</span>

              <strong>
                Profile
              </strong>

              <small>
                Manage seller profile
              </small>
            </button>

          </div>

        </section>

      </main>


      {/* CSS */}
      <style>{`

        * {
          box-sizing: border-box;
        }

        .seller-store-page {
          min-height: 100vh;
          background: #f5f7fb;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
          color: #0f172a;
        }

        /* SIDEBAR */

        .seller-store-sidebar {
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

        .seller-store-sidebar h1 {
          margin: 0;
          font-size: 30px;
        }

        .seller-store-sidebar p {
          margin: 6px 0 0;
          color: #9ca3af;
        }

        .seller-store-sidebar nav {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin-top: 28px;
        }

        .seller-store-sidebar nav button {
          border: none;
          border-radius: 8px;
          padding: 13px 15px;
          background: transparent;
          color: #d1d5db;
          text-align: left;
          font-size: 15px;
          cursor: pointer;
        }

        .seller-store-sidebar nav button:hover {
          background: #1f2937;
          color: white;
        }

        .seller-store-sidebar nav button.active {
          background: #2563eb;
          color: white;
          font-weight: 700;
        }

        .logout {
          margin-top: auto;
          border: none;
          border-radius: 8px;
          padding: 13px;
          background: #dc2626;
          color: white;
          font-weight: 700;
          cursor: pointer;
        }

        .logout:hover {
          background: #b91c1c;
        }

        /* MAIN */

        .seller-store-content {
          margin-left: 250px;
          padding: 40px;
        }

        .seller-store-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .seller-store-header span {
          color: #2563eb;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .seller-store-header h1 {
          margin: 8px 0;
          font-size: 38px;
        }

        .seller-store-header p {
          margin: 0;
          color: #64748b;
          font-size: 16px;
        }

        .back-button {
          border: 1px solid #cbd5e1;
          border-radius: 9px;
          padding: 12px 18px;
          background: white;
          color: #0f172a;
          font-weight: 700;
          cursor: pointer;
        }

        .back-button:hover {
          background: #f8fafc;
        }

        /* STORE */

        .store-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          overflow: hidden;
          box-shadow:
            0 8px 25px
            rgba(15, 23, 42, 0.06);
          margin-bottom: 30px;
        }

        .store-cover {
          height: 170px;
          background:
            linear-gradient(
              135deg,
              #1e3a8a,
              #2563eb
            );
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .store-logo {
          width: 90px;
          height: 90px;
          border-radius: 20px;
          background: white;
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 900;
          box-shadow:
            0 10px 25px
            rgba(0, 0, 0, 0.2);
        }

        .store-information {
          padding: 30px;
        }

        .store-information h2 {
          margin: 0 0 10px;
          font-size: 27px;
        }

        .store-description {
          max-width: 750px;
          margin: 0;
          color: #64748b;
          line-height: 1.7;
        }

        .store-details {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 20px;
          margin-top: 30px;
          padding-top: 25px;
          border-top:
            1px solid #e2e8f0;
        }

        .store-details div {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .store-details span {
          color: #64748b;
          font-size: 13px;
        }

        .store-details strong {
          font-size: 15px;
        }

        .store-details .status {
          color: #16a34a;
        }

        /* QUICK ACTIONS */

        .quick-actions {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 28px;
        }

        .quick-actions h2 {
          margin: 0 0 20px;
          font-size: 22px;
        }

        .quick-grid {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 16px;
        }

        .quick-grid button {
          min-height: 150px;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          background: white;
          padding: 22px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 7px;
          text-align: left;
          cursor: pointer;
          transition: 0.2s;
        }

        .quick-grid button:hover {
          border-color: #2563eb;
          transform: translateY(-2px);
          box-shadow:
            0 8px 20px
            rgba(37, 99, 235, 0.08);
        }

        .quick-grid span {
          font-size: 28px;
        }

        .quick-grid strong {
          font-size: 16px;
        }

        .quick-grid small {
          color: #64748b;
          font-size: 13px;
        }

        /* MOBILE */

        @media (max-width: 900px) {

          .store-details {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .quick-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

        }

        @media (max-width: 700px) {

          .seller-store-sidebar {
            position: static;
            width: 100%;
          }

          .seller-store-content {
            margin-left: 0;
            padding: 25px 18px;
          }

          .seller-store-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .store-details {
            grid-template-columns: 1fr;
          }

          .quick-grid {
            grid-template-columns: 1fr;
          }

        }

      `}</style>

    </div>
  );
}

export default SellerStore;
