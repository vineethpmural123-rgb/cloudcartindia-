import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Save,
  Package,
  Image as ImageIcon,
} from "lucide-react";

import "./AddProduct.css";


function AddProduct() {
  const navigate = useNavigate();


  // ================================
  // FORM
  // ================================

  const [form, setForm] = useState({
    name: "",
    category: "Electronics",
    price: "",
    oldPrice: "",
    description: "",
    image: "",
    stock: "",
    seller: "",
    rating: "4.5",
  });


  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);


  // ================================
  // HANDLE CHANGE
  // ================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };


  // ================================
  // SUBMIT
  // ================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");


    // VALIDATION

    if (
      !form.name.trim() ||
      !form.price ||
      !form.stock ||
      !form.image.trim()
    ) {
      setError(
        "Please enter product name, price, stock and image."
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


    setLoading(true);


    try {
      const token = localStorage.getItem("adminToken");

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
        form.seller.trim() ||
        "CloudCart Seller",

      rating:
        Number(form.rating) || 4.5,
    }),
  }
);



        
        


      const data = await response.json();


      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to add product."
        );
      }


      setSuccess(
        "Product added successfully."
      );


      // RESET FORM

      setForm({
        name: "",
        category: "Electronics",
        price: "",
        oldPrice: "",
        description: "",
        image: "",
        stock: "",
        seller: "",
        rating: "4.5",
      });


      // GO TO ADMIN PRODUCTS

      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);


    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Unable to connect to backend."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="add-product-page">

      {/* ================================
          TOP
      ================================= */}

      <div className="add-product-top">

        <Link
          to="/admin/dashboard"
          className="add-product-back"
        >
          <ArrowLeft size={19} />

          Back to Dashboard
        </Link>

      </div>


      {/* ================================
          HEADER
      ================================= */}

      <section className="add-product-header">

        <div>

          <span className="add-product-label">
            CLOUDCART ADMIN
          </span>

          <h1>
            Add Product
          </h1>

          <p>
            Add a new product to your CloudCart store.
          </p>

        </div>

      </section>


      {/* ================================
          FORM
      ================================= */}

      <form
        className="add-product-form"
        onSubmit={handleSubmit}
      >

        {/* ================================
            PRODUCT INFORMATION
        ================================= */}

        <section className="add-product-card">

          <div className="add-product-card-header">

            <div className="add-product-icon">
              <Package size={20} />
            </div>

            <div>

              <h2>
                Product Information
              </h2>

              <p>
                Enter the basic details of your product.
              </p>

            </div>

          </div>


          <div className="add-product-fields">

            {/* NAME */}

            <div className="add-product-field full">

              <label htmlFor="name">
                Product Name *
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Example: Premium Smartphone"
              />

            </div>


            {/* CATEGORY */}

            <div className="add-product-field">

              <label htmlFor="category">
                Category *
              </label>

              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
              >

                <option>
                  Electronics
                </option>

                <option>
                  Fashion
                </option>

                <option>
                  Home
                </option>

                <option>
                  Beauty
                </option>

                <option>
                  Sports
                </option>

                <option>
                  Grocery
                </option>

              </select>

            </div>


            {/* SELLER */}

            <div className="add-product-field">

              <label htmlFor="seller">
                Seller
              </label>

              <input
                id="seller"
                name="seller"
                type="text"
                value={form.seller}
                onChange={handleChange}
                placeholder="Example: TechStore India"
              />

            </div>


            {/* PRICE */}

            <div className="add-product-field">

              <label htmlFor="price">
                Price *
              </label>

              <input
                id="price"
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={handleChange}
                placeholder="49999"
              />

            </div>


            {/* OLD PRICE */}

            <div className="add-product-field">

              <label htmlFor="oldPrice">
                Old Price
              </label>

              <input
                id="oldPrice"
                name="oldPrice"
                type="number"
                min="0"
                value={form.oldPrice}
                onChange={handleChange}
                placeholder="59999"
              />

            </div>


            {/* STOCK */}

            <div className="add-product-field">

              <label htmlFor="stock">
                Stock *
              </label>

              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                placeholder="18"
              />

            </div>


            {/* RATING */}

            <div className="add-product-field">

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

            </div>


            {/* IMAGE */}

            <div className="add-product-field full">

              <label htmlFor="image">
                Product Image URL *
              </label>

              <div className="add-product-image-input">

                <ImageIcon size={19} />

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

            <div className="add-product-field full">

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


        {/* ================================
            ERROR
        ================================= */}

        {error && (
          <div className="add-product-error">
            {error}
          </div>
        )}


        {/* ================================
            SUCCESS
        ================================= */}

        {success && (
          <div className="add-product-success">
            {success}
          </div>
        )}


        {/* ================================
            ACTIONS
        ================================= */}

        <div className="add-product-actions">

          <Link
            to="/admin/dashboard"
            className="cancel-product-button"
          >
            Cancel
          </Link>


          <button
            type="submit"
            className="save-product-button"
            disabled={loading}
          >

            <Save size={19} />

            {loading
              ? "Adding Product..."
              : "Add Product"}

          </button>

        </div>

      </form>

    </main>
  );
}


export default AddProduct;``



