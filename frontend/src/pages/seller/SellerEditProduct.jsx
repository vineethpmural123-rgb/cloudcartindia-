import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function SellerEditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    category: "Electronics",
    price: "",
    oldPrice: "",
    description: "",
    image: "",
    stock: "",
    rating: "4.5",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================
  // LOAD PRODUCT
  // =========================================

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/products/${id}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load product."
          );
        }

        const product = data.product;

        setForm({
          name: product.name || "",
          category: product.category || "Electronics",
          price: product.price ?? "",
          oldPrice: product.oldPrice ?? "",
          description: product.description || "",
          image: product.image || "",
          stock: product.stock ?? "",
          rating: product.rating ?? "4.5",
        });
      } catch (err) {
        console.error("Load product error:", err);

        setError(
          err.message || "Failed to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  // =========================================
  // HANDLE CHANGE
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================
  // UPDATE PRODUCT
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.name.trim() ||
      form.price === "" ||
      form.stock === "" ||
      !form.image.trim()
    ) {
      setError(
        "Product name, price, stock and image are required."
      );
      return;
    }

    if (Number(form.price) < 0) {
      setError("Price cannot be negative.");
      return;
    }

    if (Number(form.stock) < 0) {
      setError("Stock cannot be negative.");
      return;
    }

    if (
      form.rating !== "" &&
      (Number(form.rating) < 0 ||
        Number(form.rating) > 5)
    ) {
      setError("Rating must be between 0 and 5.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `/api/products/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),

            category: form.category,

            price: Number(form.price),

            oldPrice:
              form.oldPrice === ""
                ? null
                : Number(form.oldPrice),

            description:
              form.description.trim(),

            image: form.image.trim(),

            stock: Number(form.stock),

            rating:
              form.rating === ""
                ? 4.5
                : Number(form.rating),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to update product."
        );
      }

      setSuccess(
        "Product updated successfully."
      );

      setTimeout(() => {
        navigate("/seller/products");
      }, 1000);
    } catch (err) {
      console.error(
        "Update product error:",
        err
      );

      setError(
        err.message ||
          "Failed to update product."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <h1>Loading Product...</h1>
        </div>
      </div>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              Edit Product
            </h1>

            <p style={styles.subtitle}>
              Update your CloudCart product.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/seller/products")
            }
            style={styles.backButton}
          >
            ← Back to Products
          </button>
        </div>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {success && (
          <div style={styles.success}>
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={styles.form}
        >
          {/* PRODUCT NAME */}

          <div style={styles.field}>
            <label>Product Name</label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter product name"
            />
          </div>

          {/* CATEGORY */}

          <div style={styles.field}>
            <label>Category</label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="Electronics">
                Electronics
              </option>

              <option value="Fashion">
                Fashion
              </option>

              <option value="Home">
                Home
              </option>

              <option value="Beauty">
                Beauty
              </option>

              <option value="Sports">
                Sports
              </option>

              <option value="Books">
                Books
              </option>
            </select>
          </div>

          {/* PRICE */}

          <div style={styles.field}>
            <label>Price</label>

            <input
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange}
              placeholder="Enter price"
            />
          </div>

          {/* OLD PRICE */}

          <div style={styles.field}>
            <label>Old Price</label>

            <input
              name="oldPrice"
              type="number"
              min="0"
              value={form.oldPrice}
              onChange={handleChange}
              placeholder="Enter old price"
            />
          </div>

          {/* STOCK */}

          <div style={styles.field}>
            <label>Stock Quantity</label>

            <input
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={handleChange}
              placeholder="Enter stock quantity"
            />
          </div>

          {/* IMAGE */}

          <div style={styles.field}>
            <label>Product Image URL</label>

            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/product.jpg"
            />
          </div>

          {/* RATING */}

          <div style={styles.field}>
            <label>Rating</label>

            <input
              name="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={handleChange}
            />
          </div>

          {/* DESCRIPTION */}

          <div style={styles.field}>
            <label>Description</label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="6"
            />
          </div>

          {/* BUTTONS */}

          <div style={styles.buttons}>
            <button
              type="button"
              onClick={() =>
                navigate("/seller/products")
              }
              style={styles.cancelButton}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              style={styles.saveButton}
            >
              {saving
                ? "Updating Product..."
                : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// =========================================
// STYLES
// =========================================

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "40px",
    fontFamily: "Arial, sans-serif",
  },

  container: {
    maxWidth: "850px",
    margin: "0 auto",
    background: "#ffffff",
    padding: "35px",
    borderRadius: "15px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.08)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "25px",
  },

  title: {
    margin: 0,
    fontSize: "36px",
    color: "#111827",
  },

  subtitle: {
    color: "#6b7280",
    fontSize: "18px",
  },

  backButton: {
    padding: "12px 18px",
    border: "1px solid #2563eb",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#2563eb",
    fontWeight: "bold",
    cursor: "pointer",
  },

  error: {
    padding: "14px",
    marginBottom: "20px",
    background: "#fee2e2",
    color: "#b91c1c",
    borderRadius: "8px",
  },

  success: {
    padding: "14px",
    marginBottom: "20px",
    background: "#dcfce7",
    color: "#166534",
    borderRadius: "8px",
  },

  form: {
    display: "grid",
    gap: "18px",
  },

  field: {
    display: "grid",
    gap: "8px",
  },

  label: {
    fontSize: "17px",
    fontWeight: "bold",
    color: "#111827",
  },

  input: {
    padding: "13px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },

  buttons: {
    display: "flex",
    gap: "12px",
    marginTop: "10px",
  },

  cancelButton: {
    padding: "14px 22px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    background: "#ffffff",
    fontSize: "16px",
    cursor: "pointer",
  },

  saveButton: {
    padding: "14px 22px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default SellerEditProduct;



