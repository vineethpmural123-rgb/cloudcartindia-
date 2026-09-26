import React, { useEffect, useState } from "react";

import {
  useParams,
  useNavigate,
  useLocation
} from "react-router-dom";

import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Star,
  User,
  Zap,
} from "lucide-react";

import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

const fromWishlist =
  location.state?.from === "wishlist";
    const customer = JSON.parse(
    localStorage.getItem("customer")
  );

  const customerId = customer?.id;

  const cartKey = customerId
    ? `cart_${customerId}`
    : "cart";

    const buyNowKey = customerId
  ? `buyNow_${customerId}`
  : "buyNow";

  const wishlistKey = customerId
    ? `wishlist_${customerId}`
    : "wishlist";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isWishlist, setIsWishlist] = useState(false);

  /* =====================================================
     LOAD PRODUCT
  ===================================================== */

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/products/${id}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Product not found."
        );
      }

      const loadedProduct =
        data.product || data;

      setProduct(loadedProduct);

      /* =================================================
         CHECK WISHLIST
      ================================================= */

      const wishlist =
        JSON.parse(
          localStorage.getItem(wishlistKey)
        ) || [];

      setIsWishlist(
        wishlist.some(
          (item) =>
            Number(item.id) ===
            Number(loadedProduct.id)
        )
      );
    } catch (err) {
      console.error(
        "Product details error:",
        err
      );

      setError(
        err.message ||
          "Unable to load product."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     WISHLIST
  ===================================================== */

  const toggleWishlist = () => {
    if (!product) {
      return;
    }

    const wishlist =
      JSON.parse(
        localStorage.getItem("wishlist")
      ) || [];

    const exists =
      wishlist.some(
        (item) =>
          Number(item.id) ===
          Number(product.id)
      );

    let updatedWishlist;

    if (exists) {
      updatedWishlist =
        wishlist.filter(
          (item) =>
            Number(item.id) !==
            Number(product.id)
        );
    } else {
      updatedWishlist = [
        ...wishlist,
        product,
      ];
    }

      localStorage.setItem(
  wishlistKey,
  JSON.stringify(updatedWishlist)
);
    setIsWishlist(!exists);

    window.dispatchEvent(
      new Event("wishlistUpdated")
    );
  };

  /* =====================================================
     ADD PRODUCT TO CART
  ===================================================== */

  const addProductToCart = () => {
    if (!product) {
      return false;
    }

    const stock =
      Number(product.stock || 0);

    if (stock <= 0) {
      alert("Product is out of stock.");
      return false;
    }

    const cart =
      JSON.parse(
       localStorage.getItem(cartKey)
      ) || [];

    const existingProduct =
      cart.find(
        (item) =>
          Number(item.id) ===
          Number(product.id)
      );

    let updatedCart;

    /* =================================================
       PRODUCT ALREADY EXISTS
    ================================================= */

    if (existingProduct) {
      const currentQuantity =
        Number(
          existingProduct.quantity || 1
        );

      if (currentQuantity >= stock) {
        alert(
          "You have reached the available stock."
        );

        return false;
      }

      updatedCart = cart.map(
        (item) =>
          Number(item.id) ===
          Number(product.id)
            ? {
                ...item,
                quantity:
                  currentQuantity + 1,
              }
            : item
      );
    }

    /* =================================================
       NEW PRODUCT
    ================================================= */

    else {
      updatedCart = [
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ];
    }

    localStorage.setItem(
  cartKey,
  JSON.stringify(updatedCart)
);

    /* Important:
       Tell Cart page that cart changed.
    */

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    return true;
  };

  /* =====================================================
     ADD TO CART
  ===================================================== */

  const handleAddToCart = () => {
    const added = addProductToCart();

    if (!added) {
      return;
    }

    alert("Product added to cart!");

    /*
      Stay on Product Details page.
      User can continue shopping.
    */
  };

  // =====================================================
// BUY NOW
// =====================================================
const handleBuyNow = () => {

  if (!product) {
    return;
  }

  if (Number(product.stock || 0) <= 0) {
    alert("Product is out of stock.");
    return;
  }

  localStorage.setItem(
    buyNowKey,
    JSON.stringify([
      {
        ...product,
        quantity: 1,
      },
    ])
  );
  localStorage.setItem(
  "checkoutMode",
  "buyNow"
);
console.log("BUY NOW KEY:", buyNowKey);
console.log(
  "SAVED BUY NOW:",
  localStorage.getItem(buyNowKey)
);
console.log(
  "CHECKOUT MODE:",
  localStorage.getItem("checkoutMode")
);


  navigate("/customer/checkout");

};
  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="product-details-loading">
        <div className="details-spinner" />

        <h2>
          Loading Product...
        </h2>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error || !product) {
    return (
      <div className="product-details-error">
        <div className="product-details-error-card">
          <h1>
            Product Not Found
          </h1>

          <p>
            {error ||
              "This product could not be found."}
          </p>

          <button
  type="button"
  className="product-back"
  onClick={() => {
    if (fromWishlist) {
      navigate("/customer/wishlist");
    } else {
      navigate("/customer/products");
    }
  }}
>
  <ArrowLeft size={20} />

  {fromWishlist
    ? "Back to Wishlist"
    : "Back to Products"}
</button>
        </div>
      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="product-details-page">

      {/* =================================================
          HEADER
      ================================================= */}

    <header className="details-header">

  {/* LEFT */}
  <button
    type="button"
    className="details-back-button"
    onClick={() =>
      navigate("/customer/products")
    }
  >
    <ArrowLeft size={20} />
    Back to Products
  </button>


  {/* CENTER LOGO */}
  <h1 className="details-logo">
    CloudCart
  </h1>


  {/* RIGHT NAVIGATION */}
  <div className="details-header-actions">

    <button
      type="button"
      className="details-header-link"
      onClick={() =>
  navigate("/customer/wishlist", {
    state: {
      from: "productDetails",
      productId: product.id,
    },
  })
}
    >
      <Heart size={20} />
      Wishlist
    </button>


    <button
      type="button"
      className="details-header-link"
      onClick={() =>
        navigate("/customer/cart")
      }
    >
      <ShoppingCart size={20} />
      Cart
    </button>


    <button
  type="button"
  className="details-profile-button"
  onClick={() =>
    navigate("/customer/profile")
  }
  aria-label="Profile"
>
  <User size={22} />
</button>

  </div>

</header>

      {/* =================================================
          PRODUCT DETAILS
      ================================================= */}

      <main className="product-details-container">

        <div className="product-details-card">

          {/* =================================================
              IMAGE
          ================================================= */}

          <div className="product-details-image">

            <img
              src={
                product.image ||
                "https://via.placeholder.com/700x600?text=CloudCart"
              }
              alt={
                product.name ||
                "Product"
              }
              onError={(event) => {
                event.currentTarget.src =
                  "https://via.placeholder.com/700x600?text=CloudCart";
              }}
            />

            <button
              type="button"
              className={
                isWishlist
                  ? "details-wishlist active"
                  : "details-wishlist"
              }
              onClick={
                toggleWishlist
              }
              aria-label="Wishlist"
            >
              <Heart
                size={25}
                fill={
                  isWishlist
                    ? "currentColor"
                    : "none"
                }
              />
            </button>

          </div>

          {/* =================================================
              INFORMATION
          ================================================= */}

          <div className="product-details-info">

            <span className="details-category">
              {product.category ||
                "General"}
            </span>

            <h2>
              {product.name}
            </h2>

            {/* =================================================
                RATING
            ================================================= */}

            <div className="details-rating">

              <Star
                size={19}
                fill="currentColor"
              />

              <strong>
                {Number(
                  product.rating || 0
                ).toFixed(1)}
              </strong>

              <span>
                (
                {product.reviews || 0}
                {" "}
                reviews)
              </span>

            </div>

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <p className="details-description">
              {product.description ||
                "No product description available."}
            </p>

            {/* =================================================
                PRICE
            ================================================= */}

            <div className="details-price">

              <strong>
                ₹
                {Number(
                  product.price || 0
                ).toLocaleString("en-IN")}
              </strong>

              {product.oldPrice &&
                Number(
                  product.oldPrice
                ) > 0 && (
                  <del>
                    ₹
                    {Number(
                      product.oldPrice
                    ).toLocaleString("en-IN")}
                  </del>
                )}

            </div>

            {/* =================================================
                STOCK
            ================================================= */}

            <div className="details-stock">

              <span>
                Available Stock
              </span>

              <strong>
                {product.stock}
              </strong>

            </div>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="details-actions">

              {/* ADD TO CART */}

              <button
                type="button"
                className="details-cart-button"
                disabled={
                  Number(
                    product.stock || 0
                  ) <= 0
                }
                onClick={
                  handleAddToCart
                }
              >
                <ShoppingCart
                  size={20}
                />

                Add to Cart
              </button>

              {/* BUY NOW */}

            <button
  type="button"
  className="details-buy-button"
  onClick={handleBuyNow}
>
  <Zap size={20} />
  Buy Now
</button>

            </div>

            {/* =================================================
                WISHLIST
            ================================================= */}

            <button
              type="button"
              className="details-wishlist-link"
              onClick={
                toggleWishlist
              }
            >
              <Heart
                size={18}
                fill={
                  isWishlist
                    ? "currentColor"
                    : "none"
                }
              />

              {isWishlist
                ? "Remove from Wishlist"
                : "Add to Wishlist"}
            </button>

          </div>
        </div>

      </main>

    </div>
  );
}

export default ProductDetails;



