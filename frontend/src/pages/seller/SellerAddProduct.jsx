import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Package,
  Tag,
  IndianRupee,
  Boxes,
  Image,
  Star,
  FileText,
  Plus,
} from "lucide-react";

import "./SellerAddProduct.css";

function SellerAddProduct() {
  const navigate = useNavigate();

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const seller = JSON.parse(
    localStorage.getItem("seller") || "null"
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Please enter product name.");
      return;
    }

    if (!form.price) {
      setError("Please enter product price.");
      return;
    }

    if (!form.stock) {
      setError("Please enter stock quantity.");
      return;
    }

    if (!form.image.trim()) {
      setError("Please enter product image URL.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem(
        "sellerToken"
      );

      const response = await fetch(
        "/api/products",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: form.name.trim(),
            category: form.category,
            price: Number(form.price),

            oldPrice: form.oldPrice
              ? Number(form.oldPrice)
              : null,

            description: form.description.trim(),

            image: form.image.trim(),

            stock: Number(form.stock),

            seller:
              seller?.store_name ||
              seller?.name ||
              "CloudCart Seller",

            rating: Number(form.rating) || 4.5,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to add product."
        );
      }

      setSuccess(
        "Product added successfully!"
      );

      setForm({
        name: "",
        category: "Electronics",
        price: "",
        oldPrice: "",
        description: "",
        image: "",
        stock: "",
        rating: "4.5",
      });

      setTimeout(() => {
        navigate("/seller/dashboard");
      }, 1200);

    } catch (err) {

      console.error(
        "Seller add product error:",
        err
      );

      setError(
        err.message ||
          "Failed to add product."
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="seller-add-page">

      <div className="seller-add-container">

        {/* TOP HEADER */}

        <div className="seller-add-header">

          <div>

            <button
              type="button"
              className="back-button"
              onClick={() =>
                navigate("/seller/dashboard")
              }
            >

              <ArrowLeft size={18} />

              Back to Dashboard

            </button>

            <p className="seller-label">
              CLOUDCART SELLER
            </p>

            <h1>
              Add New Product
            </h1>

            <p className="seller-add-subtitle">
              Add a new product to your CloudCart store.
            </p>

          </div>

          <div className="add-product-icon">

            <Package size={32} />

          </div>

        </div>


        {/* ERROR */}

        {error && (

          <div className="form-message error-message">

            {error}

          </div>

        )}


        {/* SUCCESS */}

        {success && (

          <div className="form-message success-message">

            {success}

          </div>

        )}


        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="seller-product-form"
        >


          {/* PRODUCT INFORMATION */}

          <section className="form-section">

            <div className="section-header">

              <Package size={21} />

              <div>

                <h2>
                  Product Information
                </h2>

                <p>
                  Enter the basic details of your product.
                </p>

              </div>

            </div>


            <div className="form-grid">


              {/* PRODUCT NAME */}

              <div className="form-field">

                <label>

                  <Package size={17} />

                  Product Name

                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  value={form.name}
                  onChange={handleChange}
                />

              </div>


              {/* CATEGORY */}

              <div className="form-field">

                <label>

                  <Tag size={17} />

                  Category

                </label>

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

            </div>

          </section>


          {/* PRICING */}

          <section className="form-section">

            <div className="section-header">

              <IndianRupee size={21} />

              <div>

                <h2>
                  Pricing
                </h2>

                <p>
                  Set the selling price for your product.
                </p>

              </div>

            </div>


            <div className="form-grid">


              {/* PRICE */}

              <div className="form-field">

                <label>

                  <IndianRupee size={17} />

                  Price

                </label>

                <input
                  type="number"
                  name="price"
                  min="0"
                  placeholder="Enter price"
                  value={form.price}
                  onChange={handleChange}
                />

              </div>


              {/* OLD PRICE */}

              <div className="form-field">

                <label>

                  <Tag size={17} />

                  Old Price
                  <span className="optional">
                    Optional
                  </span>

                </label>

                <input
                  type="number"
                  name="oldPrice"
                  min="0"
                  placeholder="Enter old price"
                  value={form.oldPrice}
                  onChange={handleChange}
                />

              </div>

            </div>

          </section>


          {/* INVENTORY */}

          <section className="form-section">

            <div className="section-header">

              <Boxes size={21} />

              <div>

                <h2>
                  Inventory
                </h2>

                <p>
                  Manage your available product stock.
                </p>

              </div>

            </div>


            <div className="form-grid">


              {/* STOCK */}

              <div className="form-field">

                <label>

                  <Boxes size={17} />

                  Stock Quantity

                </label>

                <input
                  type="number"
                  name="stock"
                  min="0"
                  placeholder="Enter stock quantity"
                  value={form.stock}
                  onChange={handleChange}
                />

              </div>


              {/* RATING */}

              <div className="form-field">

                <label>

                  <Star size={17} />

                  Rating

                </label>

                <input
                  type="number"
                  name="rating"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={handleChange}
                />

              </div>

            </div>

          </section>


          {/* PRODUCT DETAILS */}

          <section className="form-section">

            <div className="section-header">

              <FileText size={21} />

              <div>

                <h2>
                  Product Details
                </h2>

                <p>
                  Add an image and description for your product.
                </p>

              </div>

            </div>


            {/* IMAGE */}

            <div className="form-field">

              <label>

                <Image size={17} />

                Product Image URL

              </label>

              <input
                type="text"
                name="image"
                placeholder="https://example.com/product.jpg"
                value={form.image}
                onChange={handleChange}
              />

            </div>


            {/* DESCRIPTION */}

            <div className="form-field description-field">

              <label>

                <FileText size={17} />

                Description

              </label>

              <textarea
                name="description"
                placeholder="Enter product description"
                value={form.description}
                onChange={handleChange}
                rows="6"
              />

            </div>

          </section>


          {/* BUTTONS */}

          <div className="form-buttons">

            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                navigate("/seller/dashboard")
              }
              disabled={loading}
            >

              Cancel

            </button>


            <button
              type="submit"
              className="submit-product-button"
              disabled={loading}
            >

              <Plus size={19} />

              {loading
                ? "Adding Product..."
                : "Add Product"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );
}

export default SellerAddProduct;



