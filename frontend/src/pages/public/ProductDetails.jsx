import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  Check,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // =========================================
  // PRODUCT STATE
  // =========================================

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // QUANTITY
  // =========================================

  const [quantity, setQuantity] = useState(1);

  // =========================================
  // IMAGE
  // =========================================

  const [selectedImage, setSelectedImage] =
    useState("");

  // =========================================
  // WISHLIST
  // =========================================

  const [isWishlist, setIsWishlist] =
    useState(false);

  // =========================================
  // CART MESSAGE
  // =========================================

  const [cartMessage, setCartMessage] =
    useState(false);

  // =========================================
  // LOAD PRODUCT FROM MYSQL
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
            data.message ||
              "Failed to load product."
          );
        }

        const loadedProduct = data.product;

        setProduct(loadedProduct);

        setSelectedImage(
          loadedProduct.image || ""
        );

        // Reset quantity
        setQuantity(1);

      } catch (error) {
        console.error(
          "Product details error:",
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
  // LOAD WISHLIST STATUS
  // =========================================

  useEffect(() => {
    if (!product) {
      return;
    }

    const savedWishlist =
      JSON.parse(
        localStorage.getItem("wishlist")
      ) || [];

    const exists = savedWishlist.some(
      (item) =>
        String(item.id) ===
        String(product.id)
    );

    setIsWishlist(exists);
  }, [product]);

  // =========================================
  // QUANTITY
  // =========================================

  const increaseQuantity = () => {
    if (!product) {
      return;
    }

    const stock = Number(
      product.stock || 0
    );

    if (quantity < stock) {
      setQuantity(
        (previous) => previous + 1
      );
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(
        (previous) => previous - 1
      );
    }
  };

  // =========================================
  // WISHLIST
  // =========================================

  const toggleWishlist = () => {
    if (!product) {
      return;
    }

    const savedWishlist =
      JSON.parse(
        localStorage.getItem("wishlist")
      ) || [];

    const exists = savedWishlist.some(
      (item) =>
        String(item.id) ===
        String(product.id)
    );

    let updatedWishlist;

    if (exists) {
      updatedWishlist =
        savedWishlist.filter(
          (item) =>
            String(item.id) !==
            String(product.id)
        );

      setIsWishlist(false);
    } else {
      updatedWishlist = [
        ...savedWishlist,
        {
          ...product,
        },
      ];

      setIsWishlist(true);
    }

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updatedWishlist)
    );
  };

  // =========================================
  // ADD TO CART
  // =========================================

  const addToCart = () => {
    if (!product) {
      return;
    }

    if (Number(product.stock || 0) <= 0) {
      alert("This product is out of stock.");
      return;
    }

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
                quantity: Math.min(
                  Number(item.quantity || 0) +
                    quantity,
                  Number(product.stock)
                ),
              }
            : item
      );
    } else {
      updatedCart = [
        ...savedCart,
        {
          ...product,
          quantity,
        },
      ];
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    setCartMessage(true);

    setTimeout(() => {
      setCartMessage(false);
    }, 2500);
  };

  // =========================================
  // BUY NOW
  // =========================================

  const buyNow = () => {
    if (!product) {
      return;
    }

    if (Number(product.stock || 0) <= 0) {
      alert("This product is out of stock.");
      return;
    }

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
                quantity: Math.min(
                  Number(item.quantity || 0) +
                    quantity,
                  Number(product.stock)
                ),
              }
            : item
      );
    } else {
      updatedCart = [
        ...savedCart,
        {
          ...product,
          quantity,
        },
      ];
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    navigate("/customer/checkout");
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="details-page">

          <div
            style={{
              minHeight: "500px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <PackageIcon />

            <h2>
              Loading Product...
            </h2>

            <p>
              Getting product information
              from CloudCart.
            </p>
          </div>

        </main>
      </>
    );
  }

  // =========================================
  // ERROR / PRODUCT NOT FOUND
  // =========================================

  if (error || !product) {
    return (
      <>
        <Navbar />

        <main className="details-page">

          <div
            style={{
              minHeight: "500px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "15px",
              textAlign: "center",
            }}
          >

            <h2>
              Product Not Found
            </h2>

            <p>
              {error ||
                "This product does not exist."}
            </p>

            <Link
              to="/products"
              style={{
                color: "#2563eb",
                fontWeight: "700",
              }}
            >
              ← Back to Products
            </Link>

          </div>

        </main>
      </>
    );
  }

  // =========================================
  // PRODUCT VALUES
  // =========================================

  const price = Number(
    product.price || 0
  );

  const oldPrice = Number(
    product.oldPrice || 0
  );

  const stock = Number(
    product.stock || 0
  );

  const rating = Number(
    product.rating || 0
  );

  const reviews = Number(
    product.reviews || 0
  );

  const discount =
    oldPrice > price
      ? Math.round(
          ((oldPrice - price) /
            oldPrice) *
            100
        )
      : 0;

  // =========================================
  // RENDER
  // =========================================

  return (
    <>
      <Navbar />

      <main className="details-page">

        {/* =========================================
            BREADCRUMB
        ========================================= */}

        <div className="details-breadcrumb">

          <Link to="/">
            Home
          </Link>

          <ChevronRight size={15} />

          <Link to="/products">
            Products
          </Link>

          <ChevronRight size={15} />

          <span>
            {product.name}
          </span>

        </div>


        {/* =========================================
            PRODUCT
        ========================================= */}

        <section className="product-details-container">

          {/* =========================================
              IMAGE
          ========================================= */}

          <div className="product-gallery">

            <div className="thumbnail-list">

              <button
                type="button"
                className="thumbnail active-thumbnail"
                onClick={() =>
                  setSelectedImage(
                    product.image
                  )
                }
              >
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(event) => {
                    event.currentTarget.src =
                      "https://via.placeholder.com/500x500?text=No+Image";
                  }}
                />
              </button>

            </div>


            <div className="main-product-image">

              <img
                src={
                  selectedImage ||
                  "https://via.placeholder.com/700x700?text=No+Image"
                }
                alt={product.name}
                onError={(event) => {
                  event.currentTarget.src =
                    "https://via.placeholder.com/700x700?text=No+Image";
                }}
              />


              {/* WISHLIST */}

              <button
                type="button"
                className={
                  isWishlist
                    ? "details-wishlist wishlist-active"
                    : "details-wishlist"
                }
                onClick={toggleWishlist}
                title={
                  isWishlist
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
              >

                <Heart
                  size={22}
                  fill={
                    isWishlist
                      ? "currentColor"
                      : "none"
                  }
                />

              </button>


              {/* SALE */}

              {discount > 0 && (
                <span className="details-sale">
                  SALE
                </span>
              )}

            </div>

          </div>


          {/* =========================================
              INFORMATION
          ========================================= */}

          <div className="product-information">

            <span className="details-category">
              {product.category ||
                "General"}
            </span>


            <h1>
              {product.name}
            </h1>


            {/* RATING */}

            <div className="details-rating">

              <div className="stars">

                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <Star
                      key={star}
                      size={17}
                      fill={
                        star <=
                        Math.round(rating)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  )
                )}

              </div>

              <strong>
                {rating.toFixed(1)}
              </strong>

              <span>
                ({reviews} reviews)
              </span>

            </div>


            <div className="details-divider" />


            {/* PRICE */}

            <div className="details-price">

              <strong>
                ₹
                {price.toLocaleString(
                  "en-IN"
                )}
              </strong>

              {oldPrice > price && (
                <del>
                  ₹
                  {oldPrice.toLocaleString(
                    "en-IN"
                  )}
                </del>
              )}

              {discount > 0 && (
                <span>
                  {discount}% OFF
                </span>
              )}

            </div>


            {/* DESCRIPTION */}

            <p className="details-description">
              {product.description ||
                "Quality product available from CloudCart."}
            </p>


            {/* STOCK */}

            <div className="stock-status">

              <span
                className="stock-dot"
                style={{
                  background:
                    stock > 0
                      ? "#16a34a"
                      : "#dc2626",
                }}
              />

              <strong>
                {stock > 0
                  ? "In Stock"
                  : "Out of Stock"}
              </strong>

              {stock > 0 && (
                <span>
                  {stock} units available
                </span>
              )}

            </div>


            {/* SELLER */}

            <div className="seller-info">

              <div className="seller-avatar">
                {(
                  product.seller ||
                  "CS"
                )
                  .substring(0, 2)
                  .toUpperCase()}
              </div>

              <div>

                <span>
                  Sold by
                </span>

                <strong>
                  {product.seller ||
                    "CloudCart Seller"}
                </strong>

              </div>

              <span className="verified-seller">
                ✓ Verified
              </span>

            </div>


            {/* QUANTITY */}

            <div className="quantity-section">

              <label>
                Quantity
              </label>

              <div className="quantity-control">

                <button
                  type="button"
                  onClick={
                    decreaseQuantity
                  }
                  disabled={
                    quantity <= 1
                  }
                >
                  <Minus size={16} />
                </button>

                <span>
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={
                    increaseQuantity
                  }
                  disabled={
                    quantity >= stock ||
                    stock === 0
                  }
                >
                  <Plus size={16} />
                </button>

              </div>

            </div>


            {/* =========================================
                ACTIONS
            ========================================= */}

            <div className="details-actions">

              <button
                type="button"
                className="add-cart-large"
                onClick={addToCart}
                disabled={stock === 0}
              >

                {cartMessage ? (
                  <>
                    <Check size={20} />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Add to Cart
                  </>
                )}

              </button>


              <button
                type="button"
                className="buy-now-button"
                onClick={buyNow}
                disabled={stock === 0}
              >
                Buy Now
              </button>

            </div>


            {/* CART MESSAGE */}

            {cartMessage && (
              <div className="cart-success-message">

                <CheckCircleIcon />

                Product added to your cart.

              </div>
            )}


            {/* BENEFITS */}

            <div className="product-benefits">

              <div>

                <Truck size={21} />

                <div>

                  <strong>
                    Free Delivery
                  </strong>

                  <span>
                    Delivery available
                  </span>

                </div>

              </div>


              <div>

                <ShieldCheck size={21} />

                <div>

                  <strong>
                    Secure Payment
                  </strong>

                  <span>
                    100% secure checkout
                  </span>

                </div>

              </div>


              <div>

                <RotateCcw size={21} />

                <div>

                  <strong>
                    Easy Returns
                  </strong>

                  <span>
                    7 day return policy
                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =========================================
            DESCRIPTION
        ========================================= */}

        <section className="product-description-section">

          <div className="description-tabs">

            <button
              type="button"
              className="description-active"
            >
              Description
            </button>

            <button type="button">
              Reviews ({reviews})
            </button>

            <button type="button">
              Shipping
            </button>

          </div>


          <div className="description-content">

            <h2>
              Product Description
            </h2>

            <p>
              {product.description ||
                "This is a quality product available through CloudCart."}
            </p>

            <ul>

              <li>
                Premium quality product
              </li>

              <li>
                Fast and reliable performance
              </li>

              <li>
                Secure packaging
              </li>

              <li>
                Verified marketplace seller
              </li>

            </ul>

          </div>

        </section>

      </main>
    </>
  );
}


// =========================================
// LOADING ICON
// =========================================

function PackageIcon() {
  return (
    <div
      style={{
        fontSize: "45px",
      }}
    >
      📦
    </div>
  );
}


// =========================================
// CART SUCCESS ICON
// =========================================

function CheckCircleIcon() {
  return (
    <Check
      size={18}
      aria-hidden="true"
    />
  );
}


export default ProductDetails;



