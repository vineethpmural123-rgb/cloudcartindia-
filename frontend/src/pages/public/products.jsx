import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Search,
  ShoppingCart,
  Package,
  Heart,
} from "lucide-react";

import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // GET PRODUCTS FROM BACKEND
  // =========================================

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/products"
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load products."
        );
      }

      setProducts(data.products || []);
    } catch (error) {
      console.error(
        "Customer products error:",
        error
      );

      setError(
        "Unable to load products. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // =========================================
  // SEARCH
  // =========================================

  const filteredProducts = products.filter(
    (product) => {
      const text =
        search.toLowerCase().trim();

      return (
        String(product.name || "")
          .toLowerCase()
          .includes(text) ||
        String(product.category || "")
          .toLowerCase()
          .includes(text)
      );
    }
  );

  // =========================================
  // ADD TO CART
  // =========================================

  const addToCart = (product) => {
    try {
      const savedCart =
        JSON.parse(
          localStorage.getItem("cart")
        ) || [];

      const existingProduct =
        savedCart.find(
          (item) =>
            String(item.id) ===
            String(product.id)
        );

      let updatedCart;

      if (existingProduct) {
        updatedCart = savedCart.map(
          (item) =>
            String(item.id) ===
            String(product.id)
              ? {
                  ...item,
                  quantity:
                    Number(
                      item.quantity || 1
                    ) + 1,
                }
              : item
        );
      } else {
        updatedCart = [
          ...savedCart,
          {
            ...product,
            quantity: 1,
          },
        ];
      }

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

      alert(
        `${product.name} added to cart.`
      );
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      alert(
        "Unable to add product to cart."
      );
    }
  };

  // =========================================
  // TOGGLE WISHLIST
  // =========================================

  const toggleWishlist = (product) => {
    try {
      const savedWishlist =
        JSON.parse(
          localStorage.getItem("wishlist")
        ) || [];

      const alreadyAdded =
        savedWishlist.some(
          (item) =>
            String(item.id) ===
            String(product.id)
        );

      let updatedWishlist;

      if (alreadyAdded) {
        updatedWishlist =
          savedWishlist.filter(
            (item) =>
              String(item.id) !==
              String(product.id)
          );

        alert(
          `${product.name} removed from wishlist.`
        );
      } else {
        updatedWishlist = [
          ...savedWishlist,
          product,
        ];

        alert(
          `${product.name} added to wishlist.`
        );
      }

      localStorage.setItem(
        "wishlist",
        JSON.stringify(updatedWishlist)
      );

      // Force component refresh so
      // heart state updates immediately.
      setProducts((currentProducts) => [
        ...currentProducts,
      ]);
    } catch (error) {
      console.error(
        "Wishlist error:",
        error
      );

      alert(
        "Unable to update wishlist."
      );
    }
  };

  // =========================================
  // CHECK WISHLIST
  // =========================================

  const isInWishlist = (productId) => {
    try {
      const wishlist =
        JSON.parse(
          localStorage.getItem("wishlist")
        ) || [];

      return wishlist.some(
        (item) =>
          String(item.id) ===
          String(productId)
      );
    } catch {
      return false;
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <main className="products-page">

        <div className="products-loading">

          <Package size={50} />

          <h2>
            Loading Products...
          </h2>

          <p>
            Getting products from CloudCart.
          </p>

        </div>

      </main>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <main className="products-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <section className="products-header">

        <div>

          <span className="products-label">
            CLOUDCART STORE
          </span>

          <h1>
            All Products
          </h1>

          <p>
            Discover products available
            in our store.
          </p>

        </div>

        <Link
          to="/customer/cart"
          className="products-cart-button"
        >
          <ShoppingCart size={20} />

          Cart
        </Link>

      </section>

      {/* =====================================
          SEARCH
      ===================================== */}

      <section className="products-toolbar">

        <div className="products-search">

          <Search size={20} />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>

        <span className="products-count">
          {filteredProducts.length} products
        </span>

      </section>

      {/* =====================================
          ERROR
      ===================================== */}

      {error && (
        <div className="products-error">

          <p>{error}</p>

          <button
            type="button"
            onClick={loadProducts}
          >
            Try Again
          </button>

        </div>
      )}

      {/* =====================================
          EMPTY
      ===================================== */}

      {!error &&
        filteredProducts.length === 0 && (
          <div className="products-empty">

            <Package size={50} />

            <h2>
              No products found
            </h2>

            <p>
              Try searching for another product.
            </p>

          </div>
        )}

      {/* =====================================
          PRODUCT GRID
      ===================================== */}

      {!error &&
        filteredProducts.length > 0 && (

          <section className="products-grid">

            {filteredProducts.map(
              (product) => {

                const wishlistActive =
                  isInWishlist(
                    product.id
                  );

                const stock =
                  Number(
                    product.stock || 0
                  );

                return (
                  <article
                    className="product-card"
                    key={product.id}
                  >

                    {/* =========================
                        IMAGE
                    ========================= */}

                    <Link
                      to={`/products/${product.id}`}
                      className="product-image-link"
                    >

                      <img
                        src={
                          product.image ||
                          "https://via.placeholder.com/400x300?text=No+Image"
                        }
                        alt={
                          product.name ||
                          "Product"
                        }
                        onError={(event) => {
                          event.currentTarget.src =
                            "https://via.placeholder.com/400x300?text=No+Image";
                        }}
                      />

                    </Link>

                    {/* =========================
                        PRODUCT INFO
                    ========================= */}

                    <div className="product-card-info">

                      {/* CATEGORY */}

                      <span className="product-category">
                        {product.category ||
                          "General"}
                      </span>

                      {/* NAME */}

                      <Link
                        to={`/products/${product.id}`}
                        className="product-name"
                      >
                        {product.name}
                      </Link>

                      {/* DESCRIPTION */}

                      <p className="product-description">
                        {product.description ||
                          "Quality product from CloudCart."}
                      </p>

                      {/* =======================
                          PRICE
                      ======================= */}

                      <div className="product-price-row">

                        <strong>
                          ₹
                          {Number(
                            product.price || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                        {product.oldPrice && (
                          <del>
                            ₹
                            {Number(
                              product.oldPrice
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </del>
                        )}

                      </div>

                      {/* =======================
                          STOCK
                      ======================= */}

                      <div className="product-stock">

                        {stock > 0 ? (
                          <span>
                            {stock} in stock
                          </span>
                        ) : (
                          <span>
                            Out of stock
                          </span>
                        )}

                      </div>

                      {/* =======================
                          ACTIONS
                      ======================= */}

                      <div className="product-actions">

                        {/* HEART */}

                        <button
                          type="button"
                          className={
                            wishlistActive
                              ? "wishlist-button wishlist-active"
                              : "wishlist-button"
                          }
                          onClick={() =>
                            toggleWishlist(
                              product
                            )
                          }
                          title={
                            wishlistActive
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                          aria-label={
                            wishlistActive
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                        >
                          <Heart
                            size={20}
                            fill={
                              wishlistActive
                                ? "currentColor"
                                : "none"
                          }
                          />
                        </button>

                        {/* ADD TO CART */}

                        <button
                          type="button"
                          className="add-cart-button"
                          disabled={stock <= 0}
                          onClick={() =>
                            addToCart(
                              product
                            )
                          }
                        >
                          <ShoppingCart
                            size={18}
                          />

                          {stock > 0
                            ? "Add to Cart"
                            : "Out of Stock"}
                        </button>

                        {/* VIEW PRODUCT */}

                        <Link
                          to={`/products/${product.id}`}
                          className="view-product-button"
                        >
                          View Product
                        </Link>

                      </div>

                    </div>

                  </article>
                );
              }
            )}

          </section>

        )}

    </main>
  );
}

export default Products;



