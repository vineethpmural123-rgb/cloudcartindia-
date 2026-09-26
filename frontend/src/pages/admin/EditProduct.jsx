import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Save,
  Package,
  Image as ImageIcon,
} from "lucide-react";

import "./EditProduct.css";

function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  // =========================================
  // FORM
  // =========================================

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

       const adminToken =
  localStorage.getItem("adminToken");

const response = await fetch(
  `/api/products/${id}`,
  {
    headers: {
      Authorization:
        `Bearer ${adminToken}`,
    },
  }
);

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to load product."
          );
        }

        const product = data.product;

        setForm({
          name: product.name || "",

          category:
            product.category ||
            "Electronics",

          price:
            product.price ?? "",

          oldPrice:
            product.oldPrice ?? "",

          description:
            product.description || "",

          image:
            product.image || "",

          stock:
            product.stock ?? "",

          rating:
            product.rating ?? "4.5",
        });
      } catch (error) {
        console.error(
          "Load product error:",
          error
        );

        setError(
          error.message ||
            "Failed to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // =========================================
  // HANDLE CHANGE
  // =========================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =========================================
  // UPDATE PRODUCT
  // =========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // =======================================
    // VALIDATION
    // =======================================

    if (!form.name.trim()) {
      setError(
        "Please enter the product name."
      );
      return;
    }

    if (
      form.price === "" ||
      Number(form.price) < 0
    ) {
      setError(
        "Please enter a valid product price."
      );
      return;
    }

    if (
      form.stock === "" ||
      Number(form.stock) < 0
    ) {
      setError(
        "Please enter a valid stock quantity."
      );
      return;
    }

    if (!form.image.trim()) {
      setError(
        "Please enter the product image URL."
      );
      return;
    }

    if (
      Number(form.rating) < 0 ||
      Number(form.rating) > 5
    ) {
      setError(
        "Rating must be between 0 and 5."
      );
      return;
    }

    // =======================================
    // SAVE
    // =======================================

    try {
      setSaving(true);
      

     const adminToken =
  localStorage.getItem("adminToken");

const response = await fetch(
  `/api/products/${id}`,
  {
    method: "PUT",

    headers: {
      "Content-Type":
        "application/json",

      Authorization:
        `Bearer ${adminToken}`,
    },

          body: JSON.stringify({
            name: form.name.trim(),

            category:
              form.category,

            price:
              Number(form.price),

            oldPrice:
              form.oldPrice === ""
                ? null
                : Number(form.oldPrice),

            description:
              form.description.trim(),

            image:
              form.image.trim(),

            stock:
              Number(form.stock),

            rating:
              form.rating === ""
                ? 4.5
                : Number(form.rating),
          }),
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
            "Failed to update product."
        );
      }

      setSuccess(
        "Product updated successfully."
      );

      // Go back after short delay
      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    } catch (error) {
      console.error(
        "Update product error:",
        error
      );

      setError(
        error.message ||
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
      <main className="edit-product-page">

        <div className="edit-product-empty">

          <Package size={50} />

          <h2>
            Loading Product...
          </h2>

          <p>
            Getting product information
            from CloudCart.
          </p>

        </div>

      </main>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <main className="edit-product-page">

      {/* =====================================
          BACK
      ===================================== */}

      <div className="edit-product-top">

        <Link
          to="/admin/products"
          className="edit-product-back"
        >
          <ArrowLeft size={18} />

          Back to Products
        </Link>

      </div>

      {/* =====================================
          HEADER
      ===================================== */}

      <section className="edit-product-header">

        <div>

          <span className="edit-product-label">
            CLOUDCART ADMIN
          </span>

          <h1>
            Edit Product
          </h1>

          <p>
            Update product details,
            pricing and inventory.
          </p>

        </div>

      </section>

      {/* =====================================
          ERROR
      ===================================== */}

      {error && (
        <div className="edit-product-error">
          {error}
        </div>
      )}

      {/* =====================================
          FORM
      ===================================== */}

      <form
        className="edit-product-form"
        onSubmit={handleSubmit}
      >

        <section className="edit-product-card">

          {/* =================================
              CARD HEADER
          ================================= */}

          <div className="edit-product-card-header">

            <div className="edit-product-icon">
              <Package size={20} />
            </div>

            <div>

              <h2>
                Product Information
              </h2>

              <p>
                Change the information
                for this product.
              </p>

            </div>

          </div>

          {/* =================================
              FIELDS
          ================================= */}

          <div className="edit-product-fields">

            {/* PRODUCT NAME */}

            <div className="edit-product-field full">

              <label htmlFor="name">
                Product Name *
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter product name"
              />

            </div>

            {/* CATEGORY */}

            <div className="edit-product-field">

              <label htmlFor="category">
                Category *
              </label>

              <select
                id="category"
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

                <option value="Grocery">
                  Grocery
                </option>

              </select>

            </div>

            {/* PRICE */}

            <div className="edit-product-field">

              <label htmlFor="price">
                Price *
              </label>

              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="49999"
              />

            </div>

            {/* OLD PRICE */}

            <div className="edit-product-field">

              <label htmlFor="oldPrice">
                Old Price
              </label>

              <input
                id="oldPrice"
                name="oldPrice"
                type="number"
                min="0"
                step="0.01"
                value={form.oldPrice}
                onChange={handleChange}
                placeholder="59999"
              />

            </div>

            {/* STOCK */}

            <div className="edit-product-field">

              <label htmlFor="stock">
                Stock *
              </label>

              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={handleChange}
                placeholder="100"
              />

              <small className="edit-product-help">
                Available quantity in inventory.
              </small>

            </div>

            {/* RATING */}

            <div className="edit-product-field">

              <label htmlFor="rating">
                Rating
              </label>

              <input
                id="rating"
                name="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={handleChange}
                placeholder="4.5"
              />

              <small className="edit-product-help">
                Rating from 0 to 5.
              </small>

            </div>

            {/* IMAGE */}

            <div className="edit-product-field full">

              <label htmlFor="image">
                Product Image URL *
              </label>

              <div className="edit-product-image-input">

                <ImageIcon size={18} />

                <input
                  id="image"
                  name="image"
                  type="url"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/product.jpg"
                />

              </div>

            </div>

            {/* DESCRIPTION */}

            <div className="edit-product-field full">

              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows="5"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter product description..."
              />

            </div>

          </div>

        </section>

        {/* ===================================
            SUCCESS
        =================================== */}

        {success && (
          <div className="edit-product-success">
            {success}
          </div>
        )}

        {/* ===================================
            ACTIONS
        =================================== */}

        <div className="edit-product-actions">

          <Link
            to="/admin/products"
            className="cancel-edit-product-button"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="save-edit-product-button"
            disabled={saving}
          >

            <Save size={18} />

            {saving
              ? "Saving..."
              : "Save Changes"}

          </button>

        </div>

      </form>

    </main>
  );
}

export default EditProduct;



