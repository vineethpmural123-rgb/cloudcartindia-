import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Package,
  Search,
  AlertTriangle,
  XCircle,
  CheckCircle,
} from "lucide-react";

import "./AdminProducts.css";

function AdminProducts() {
  const navigate = useNavigate();

  // =========================================
  // STATE
  // =========================================

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // LOAD PRODUCTS FROM MYSQL
  // =========================================

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("adminToken");

    const response = await fetch(
  "/api/admin/products",
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

      setProducts(
        Array.isArray(data.products)
          ? data.products
          : []
      );
    } catch (error) {
      console.error(
        "Load products error:",
        error
      );

      setError(
        "Unable to load products from the backend."
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

  const deleteProduct = async (id) => {
    const product = products.find(
      (item) =>
        String(item.id) === String(id)
    );

    if (!product) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");

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

      // Remove product from screen
      setProducts(
        (currentProducts) =>
          currentProducts.filter(
            (item) =>
              String(item.id) !==
              String(id)
          )
      );

      alert(
        "Product deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      alert(
        error.message ||
          "Failed to delete product."
      );
    }
  };
  // =========================================
// APPROVE PRODUCT
// =========================================

const approveProduct = async (id) => {
  try {
    const token =
      localStorage.getItem("adminToken");

    const response = await fetch(
      `/api/admin/products/${id}/approve`,
      {
        method: "PUT",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
          "Failed to approve product."
      );
    }

    alert("Product approved successfully.");

    loadProducts();

  } catch (error) {

    alert(
      error.message ||
        "Failed to approve product."
    );

  }
};


// =========================================
// REJECT PRODUCT
// =========================================

const rejectProduct = async (id) => {
  try {
    const token =
      localStorage.getItem("adminToken");

    const response = await fetch(
      `/api/admin/products/${id}/reject`,
      {
        method: "PUT",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
          "Failed to reject product."
      );
    }

    alert("Product rejected.");

    loadProducts();

  } catch (error) {

    alert(
      error.message ||
        "Failed to reject product."
    );

  }
};



  // =========================================
  // STOCK STATUS
  // =========================================

  const getStockStatus = (stock) => {
    const quantity = Number(
      stock || 0
    );

    // OUT OF STOCK
    if (quantity <= 0) {
      return {
        text: "Out of Stock",
        className: "stock-out",
        icon: <XCircle size={16} />,
      };
    }

    // LOW STOCK
    if (quantity <= 10) {
      return {
        text: "Low Stock",
        className: "stock-low",
        icon: (
          <AlertTriangle size={16} />
        ),
      };
    }

    // IN STOCK
    return {
      text: "In Stock",
      className: "stock-good",
      icon: (
        <CheckCircle size={16} />
      ),
    };
  };

  // =========================================
  // SEARCH PRODUCTS
  // =========================================

  const filteredProducts =
    products.filter((product) => {
      const searchText =
        search
          .toLowerCase()
          .trim();

      if (!searchText) {
        return true;
      }

      return (
        String(
          product.name || ""
        )
          .toLowerCase()
          .includes(searchText) ||

        String(
          product.category || ""
        )
          .toLowerCase()
          .includes(searchText)
      );
    });

  // =========================================
  // SUMMARY
  // =========================================

  const totalProducts =
    products.length;

  const totalStock =
    products.reduce(
      (total, product) =>
        total +
        Number(
          product.stock || 0
        ),
      0
    );

  const lowStock =
    products.filter(
      (product) => {
        const stock =
          Number(
            product.stock || 0
          );

        return (
          stock > 0 &&
          stock <= 10
        );
      }
    ).length;

  const outOfStock =
    products.filter(
      (product) =>
        Number(
          product.stock || 0
        ) <= 0
    ).length;

  // =========================================
  // PAGE
  // =========================================

  return (
    <main className="admin-products-page">

      {/* =====================================
          BACK TO DASHBOARD
      ===================================== */}

      <div className="admin-products-top">

        <Link
          to="/admin/dashboard"
          className="admin-products-back"
        >
          <ArrowLeft size={19} />

          Back to Dashboard
        </Link>

      </div>

      {/* =====================================
          HEADER
      ===================================== */}

      <section className="admin-products-header">

        <div>

          <span className="admin-products-label">
            CLOUDCART ADMIN
          </span>

          <h1>
            Products
          </h1>

          <p>
            Manage products, prices,
            and inventory.
          </p>

        </div>

        <Link
          to="/admin/products/add"
          className="admin-add-product-button"
        >
          <Plus size={19} />

          Add Product
        </Link>

      </section>

      {/* =====================================
          ERROR
      ===================================== */}

      {error && (
        <div className="admin-products-error">

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={loadProducts}
          >
            Retry
          </button>

        </div>
      )}

      {/* =====================================
          STOCK SUMMARY
      ===================================== */}

      <section className="admin-stock-summary">

        {/* TOTAL PRODUCTS */}

        <div className="admin-stock-card">

          <div className="stock-summary-icon">
            <Package size={22} />
          </div>

          <div>

            <span>
              Total Products
            </span>

            <strong>
              {totalProducts}
            </strong>

          </div>

        </div>

        {/* TOTAL STOCK */}

        <div className="admin-stock-card">

          <div className="stock-summary-icon">
            <Package size={22} />
          </div>

          <div>

            <span>
              Total Stock
            </span>

            <strong>
              {totalStock}
            </strong>

          </div>

        </div>

        {/* LOW STOCK */}

        <div className="admin-stock-card">

          <div className="stock-summary-icon low">
            <AlertTriangle
              size={22}
            />
          </div>

          <div>

            <span>
              Low Stock
            </span>

            <strong>
              {lowStock}
            </strong>

          </div>

        </div>

        {/* OUT OF STOCK */}

        <div className="admin-stock-card">

          <div className="stock-summary-icon out">
            <XCircle size={22} />
          </div>

          <div>

            <span>
              Out of Stock
            </span>

            <strong>
              {outOfStock}
            </strong>

          </div>

        </div>

      </section>

      {/* =====================================
          SEARCH TOOLBAR
      ===================================== */}

      <section className="admin-products-toolbar">

        <div className="admin-products-count">

          <Package size={19} />

          <span>

            <strong>
              {filteredProducts.length}
            </strong>{" "}

            products

          </span>

        </div>

        <div className="admin-products-search">

          <Search size={19} />

          <input
            type="text"
            placeholder="Search products or categories..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

        </div>

      </section>

      {/* =====================================
          LOADING
      ===================================== */}

      {loading ? (

        <section className="admin-products-empty">

          <Package size={55} />

          <h2>
            Loading Products...
          </h2>

          <p>
            Getting products from
            CloudCart database.
          </p>

        </section>

      ) : filteredProducts.length ===
        0 ? (

        /* ===================================
           EMPTY
        =================================== */

        <section className="admin-products-empty">

          <Package size={55} />

          <h2>
            {products.length === 0
              ? "No products yet"
              : "No products found"}
          </h2>

          <p>
            {products.length === 0
              ? "Add your first product to start selling."
              : "Try another product name or category."}
          </p>

          {products.length === 0 && (
            <Link
              to="/admin/products/add"
              className="admin-empty-add-button"
            >
              <Plus size={18} />

              Add First Product
            </Link>
          )}

        </section>

      ) : (

        /* ===================================
           PRODUCT TABLE
        =================================== */

        <section className="admin-products-card">

          <div className="admin-products-table-wrapper">

            <table className="admin-products-table">

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
                    Inventory
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredProducts.map(
                  (product) => {

                    const stockStatus =
                      getStockStatus(
                        product.stock
                      );

                    const stock =
                      Number(
                        product.stock ||
                          0
                      );

                    return (
                      <tr
                        key={
                          product.id
                        }
                      >

                        {/* =================
                            PRODUCT
                        ================= */}

                        <td>

                          <div className="admin-product-info">

                            <div className="admin-product-image">

                              <img
                                src={
                                  product.image ||
                                  "https://via.placeholder.com/100?text=No+Image"
                                }
                                alt={
                                  product.name ||
                                  "Product"
                                }
                                onError={(
                                  event
                                ) => {
                                  event
                                    .currentTarget
                                    .src =
                                    "https://via.placeholder.com/100?text=No+Image";
                                }}
                              />

                            </div>

                            <div>

                              <strong>
                                {
                                  product.name ||
                                  "Unnamed Product"
                                }
                              </strong>

                              <span>
                                Product ID:{" "}
                                {
                                  product.id
                                }
                              </span>

                            </div>

                          </div>

                        </td>

                        {/* =================
                            CATEGORY
                        ================= */}

                        <td>

                          <span className="admin-category">

                            {
                              product.category ||
                              "General"
                            }

                          </span>

                        </td>

                        {/* =================
                            PRICE
                        ================= */}

                        <td>

                          <strong className="admin-product-price">

                            ₹
                            {Number(
                              product.price ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}

                          </strong>

                          {product.oldPrice && (
                            <del className="admin-old-price">

                              ₹
                              {Number(
                                product.oldPrice
                              ).toLocaleString(
                                "en-IN"
                              )}

                            </del>
                          )}

                        </td>

                        {/* =================
                            INVENTORY
                        ================= */}

                        <td>

                          <div className="admin-stock-cell">

                            <strong>
                              {stock}
                            </strong>

                            <span>
                              {stock === 1
                                ? "unit"
                                : "units"}
                            </span>

                          </div>

                        </td>

                        {/* =================
                            STATUS
                        ================= */}

                        <td>

                          <span
                            className={`admin-stock-status ${stockStatus.className}`}
                          >

                            {
                              stockStatus.icon
                            }

                            {
                              stockStatus.text
                            }

                          </span>

                        </td>

                        {/* =================
                            ACTIONS
                        ================= */}

                        <td>

                          <div className="admin-product-actions">

                         {/* APPROVE */}

{product.status !== "Approved" && (
  <button
    type="button"
    className="approve-product-button"
    onClick={() =>
      approveProduct(product.id)
    }
  >
    <CheckCircle size={17} />
    Approve
  </button>
)}


{/* REJECT */}

{product.status !== "Rejected" && (
  <button
    type="button"
    className="reject-product-button"
    onClick={() =>
      rejectProduct(product.id)
    }
  >
    <XCircle size={17} />
    Reject
  </button>
)} 


                            {/* EDIT */}

                            <button
                              type="button"
                              className="edit-product-button"
                              onClick={() =>
                                navigate(
                                  `/admin/products/edit/${product.id}`
                                )
                              }
                              title="Edit Product"
                              aria-label="Edit Product"
                            >

                              <Pencil
                                size={17}
                              />

                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              className="delete-product-button"
                              onClick={() =>
                                deleteProduct(
                                  product.id
                                )
                              }
                              title="Delete Product"
                              aria-label="Delete Product"
                            >

                              <Trash2
                                size={17}
                              />



                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        </section>

      )}

    </main>
  );
}

// =========================================
// DEFAULT EXPORT
// =========================================

export default AdminProducts;



