import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SellerProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // =========================================
  // LOAD PRODUCTS
  // =========================================

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem(
  "sellerToken"
);

const response = await fetch(
  "/api/products/my-products",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load products."
        );
      }

      setProducts(data.products || []);
    } catch (err) {
      console.error(
        "Load seller products error:",
        err
      );

      setError(
        err.message ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // LOAD WHEN PAGE OPENS
  // =========================================

  useEffect(() => {
    loadProducts();
  }, []);

  // =========================================
  // DELETE PRODUCT
  // =========================================

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

     const token = localStorage.getItem(
  "sellerToken"
);

const response = await fetch(
  `/api/products/${id}`,
  {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to delete product."
        );
      }

      setProducts((previousProducts) =>
        previousProducts.filter(
          (product) => product.id !== id
        )
      );
    } catch (err) {
      console.error(
        "Delete product error:",
        err
      );

      setError(
        err.message ||
          "Failed to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================
  // FORMAT PRICE
  // =========================================

  const formatPrice = (price) => {
    return `₹${Number(
      price || 0
    ).toLocaleString("en-IN")}`;
  };

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    localStorage.removeItem("seller");
    localStorage.removeItem(
      "sellerToken"
    );

    navigate("/seller/products/add")
  };

  // =========================================
  // PAGE
  // =========================================

  return (
    <div style={styles.page}>

      {/* =====================================
          SIDEBAR
      ====================================== */}

      <div style={styles.sidebar}>

        <h2 style={styles.logo}>
          CloudCart
        </h2>

        <p style={styles.panelTitle}>
          Seller Panel
        </p>

        <button
          style={styles.sideButton}
          onClick={() =>
            navigate(
              "/seller/dashboard"
            )
          }
        >
          Dashboard
        </button>

        <button
          style={{
            ...styles.sideButton,
            ...styles.activeButton,
          }}
          onClick={() =>
            navigate(
              "/seller/products"
            )
          }
        >
          Products
        </button>

        {/* IMPORTANT:
            Correct Add Product route
        */}

        <button
          style={styles.sideButton}
          onClick={() =>
            navigate(
              "/seller/add-product"
            )
          }
        >
          Add Product
        </button>

        <button
          style={styles.sideButton}
          onClick={() =>
            navigate(
              "/seller/orders"
            )
          }
        >
          Orders
        </button>

        <button
          style={styles.sideButton}
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


      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <div style={styles.content}>

        {/* HEADER */}

        <div style={styles.header}>

          <div>

            <h1 style={styles.heading}>
              My Products
            </h1>

            <p style={styles.subtitle}>
              Manage products in your
              CloudCart store.
            </p>

          </div>

          <div
            style={styles.headerButtons}
          >

            <button
              style={styles.backButton}
              onClick={() =>
                navigate(
                  "/seller/dashboard"
                )
              }
            >
              Dashboard
            </button>

            {/* IMPORTANT:
                Correct Add Product route
            */}

            <button
              style={styles.addButton}
              onClick={() =>
                navigate(
                  "/seller/add-product"
                )
              }
            >
              + Add Product
            </button>

          </div>

        </div>


        {/* ERROR */}

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}


        {/* LOADING */}

        {loading && (
          <div
            style={styles.messageBox}
          >

            <h2>
              Loading Products...
            </h2>

            <p>
              Please wait while we load
              your products.
            </p>

          </div>
        )}


        {/* NO PRODUCTS */}

        {!loading &&
          !error &&
          products.length === 0 && (

            <div
              style={styles.messageBox}
            >

              <div
                style={styles.emptyIcon}
              >
                📦
              </div>

              <h2>
                No Products Found
              </h2>

              <p>
                You have not added any
                products yet.
              </p>

              {/* IMPORTANT:
                  Correct Add Product route
              */}

              <button
                style={styles.addButton}
                onClick={() =>
                  navigate(
                    "/seller/add-product"
                  )
                }
              >
                + Add Your First Product
              </button>

            </div>
          )}


        {/* PRODUCTS */}

        {!loading &&
          products.length > 0 && (

            <div
              style={styles.productGrid}
            >

              {products.map(
                (product) => (

                  <div
                    key={product.id}
                    style={
                      styles.productCard
                    }
                  >

                    {/* IMAGE */}

                    <div
                      style={
                        styles.imageContainer
                      }
                    >

                      <img
                        src={product.image}
                        alt={product.name}
                        style={
                          styles.productImage
                        }
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";

                          const fallback =
                            document.createElement(
                              "div"
                            );

                          fallback.textContent =
                            "📦";

                          fallback.style.fontSize =
                            "50px";

                          fallback.style.color =
                            "#9ca3af";

                          e.currentTarget.parentElement.appendChild(
                            fallback
                          );
                        }}
                      />

                    </div>


                    {/* DETAILS */}

                    <div
                      style={
                        styles.productDetails
                      }
                    >

                      <h2
                        style={
                          styles.productName
                        }
                      >
                        {product.name}
                      </h2>

                      <p
                        style={
                          styles.category
                        }
                      >
                        {product.category ||
                          "Electronics"}
                      </p>


                      {/* PRICE */}

                      <div
                        style={
                          styles.priceRow
                        }
                      >

                        <strong
                          style={
                            styles.price
                          }
                        >
                          {formatPrice(
                            product.price
                          )}
                        </strong>

                        {product.oldPrice !==
                          null &&
                          product.oldPrice !==
                            undefined &&
                          product.oldPrice !==
                            "" && (

                            <span
                              style={
                                styles.oldPrice
                              }
                            >
                              {formatPrice(
                                product.oldPrice
                              )}
                            </span>
                          )}

                      </div>


                      {/* STOCK */}

                      <div
                        style={
                          styles.infoRow
                        }
                      >

                        <span>
                          Stock
                        </span>

                        <strong
                          style={{
                            color:
                              Number(
                                product.stock
                              ) <= 5
                                ? "#dc2626"
                                : "#111827",
                          }}
                        >
                          {product.stock}
                        </strong>

                      </div>


                      {/* RATING */}

                      <div
                        style={
                          styles.infoRow
                        }
                      >

                        <span>
                          Rating
                        </span>

                        <strong>
                          ⭐{" "}
                          {product.rating ??
                            "4.5"}
                        </strong>

                      </div>


                      {/* REVIEWS */}

                      <div
                        style={
                          styles.infoRow
                        }
                      >

                        <span>
                          Reviews
                        </span>

                        <strong>
                          {product.reviews ??
                            0}
                        </strong>

                      </div>

                      {/* STATUS */}

<div style={styles.infoRow}>
  <span>Status</span>

  <strong
    style={{
      color:
        product.status === "Approved"
          ? "#16a34a"
          : product.status === "Rejected"
          ? "#dc2626"
          : "#d97706",
    }}
  >
    {product.status === "Approved"
      ? "🟢 Approved"
      : product.status === "Rejected"
      ? "🔴 Rejected"
      : "🟡 Pending"}
  </strong>
</div>



                      {/* ACTIONS */}

                      <div
                        style={
                          styles.actionRow
                        }
                      >

                        {/* EDIT */}

                        <button
                          style={
                            styles.editButton
                          }
                          onClick={() =>
                            navigate(
                              `/seller/products/edit/${product.id}`
                            )
                          }
                        >
                          Edit
                        </button>


                        {/* DELETE */}

                        <button
                          style={
                            styles.deleteButton
                          }
                          disabled={
                            deletingId ===
                            product.id
                          }
                          onClick={() =>
                            handleDelete(
                              product.id,
                              product.name
                            )
                          }
                        >

                          {deletingId ===
                          product.id
                            ? "Deleting..."
                            : "Delete"}

                        </button>

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

      </div>

    </div>
  );
}


/* =================================================
   STYLES
================================================= */

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
    fontSize: "28px",
  },

  panelTitle: {
    margin:
      "0 0 10px 0",
    fontSize: "18px",
    color: "#d1d5db",
  },

  sideButton: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    background: "#ffffff",
    color: "#111827",
    fontSize: "17px",
    cursor: "pointer",
  },

  activeButton: {
    background: "#2563eb",
    color: "white",
  },

  logoutButton: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    background: "#dc2626",
    color: "white",
    fontSize: "17px",
    cursor: "pointer",
    marginTop: "10px",
  },

  content: {
    flex: 1,
    padding: "40px",
    boxSizing: "border-box",
    overflowX: "auto",
  },

  header: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
  },

  heading: {
    margin: "0",
    fontSize: "38px",
    color: "#111827",
  },

  subtitle: {
    marginTop: "8px",
    fontSize: "18px",
    color: "#4b5563",
  },

  headerButtons: {
    display: "flex",
    gap: "10px",
  },

  backButton: {
    padding:
      "12px 18px",
    border:
      "1px solid #d1d5db",
    borderRadius: "8px",
    background: "white",
    color: "#111827",
    fontWeight: "bold",
    cursor: "pointer",
  },

  addButton: {
    padding:
      "12px 20px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer",
  },

  error: {
    padding: "15px",
    marginBottom: "20px",
    background: "#fee2e2",
    color: "#b91c1c",
    borderRadius: "8px",
    fontSize: "16px",
  },

  messageBox: {
    background: "white",
    padding: "50px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow:
      "0 4px 12px rgba(0,0,0,0.08)",
  },

  emptyIcon: {
    fontSize: "55px",
    marginBottom: "10px",
  },

  productGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "25px",
  },

  productCard: {
    background: "white",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.08)",
  },

  imageContainer: {
    height: "220px",
    background: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  productDetails: {
    padding: "20px",
  },

  productName: {
    margin: "0",
    fontSize: "22px",
    color: "#111827",
  },

  category: {
    marginTop: "7px",
    marginBottom: "15px",
    color: "#6b7280",
  },

  priceRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "15px",
  },

  price: {
    fontSize: "23px",
    color: "#111827",
  },

  oldPrice: {
    fontSize: "15px",
    color: "#9ca3af",
    textDecoration:
      "line-through",
  },

  infoRow: {
    display: "flex",
    justifyContent:
      "space-between",
    padding: "8px 0",
    borderBottom:
      "1px solid #f0f0f0",
    color: "#4b5563",
  },

  actionRow: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },

  editButton: {
    flex: 1,
    padding: "11px",
    border: "none",
    borderRadius: "7px",
    background: "#2563eb",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  deleteButton: {
    flex: 1,
    padding: "11px",
    border: "none",
    borderRadius: "7px",
    background: "#dc2626",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

};

export default SellerProducts;



