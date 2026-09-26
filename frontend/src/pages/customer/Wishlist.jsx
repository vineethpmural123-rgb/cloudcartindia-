import React, { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  Star,
} from "lucide-react";

import "./Wishlist.css";

function Wishlist() {

  // =====================================================
  // CUSTOMER-SPECIFIC STORAGE KEYS
  // =====================================================

  const customer = JSON.parse(
    localStorage.getItem("customer")
  );

  const customerId = customer?.id;

  const wishlistKey = customerId
    ? `wishlist_${customerId}`
    : "wishlist";

  const cartKey = customerId
    ? `cart_${customerId}`
    : "cart";

  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);

  // =====================================================
  // LOAD WISHLIST
  // =====================================================

  const loadWishlist = () => {
    try {
      const savedWishlist =
        JSON.parse(
          localStorage.getItem(wishlistKey)
        ) || [];

      setWishlist(
        Array.isArray(savedWishlist)
          ? savedWishlist
          : []
      );

    } catch (error) {
      console.error(
        "Wishlist loading error:",
        error
      );

      setWishlist([]);
    }
  };

  useEffect(() => {
    loadWishlist();

    const handleStorageChange = () => {
      loadWishlist();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, [wishlistKey]);

  // =====================================================
  // REMOVE FROM WISHLIST
  // =====================================================

  const removeFromWishlist = (id) => {

    const updatedWishlist =
      wishlist.filter(
        (item) =>
          String(item.id) !==
          String(id)
      );

    setWishlist(updatedWishlist);

    localStorage.setItem(
      wishlistKey,
      JSON.stringify(updatedWishlist)
    );
  };

  // =====================================================
  // CLEAR WISHLIST
  // =====================================================

  const clearWishlist = () => {

    const confirmed =
      window.confirm(
        "Are you sure you want to clear your wishlist?"
      );

    if (!confirmed) {
      return;
    }

    setWishlist([]);

    // IMPORTANT:
    // Clear only the current customer's wishlist
    localStorage.setItem(
      wishlistKey,
      JSON.stringify([])
    );
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const addToCart = (product) => {
    try {

      const stock =
        Number(product.stock || 0);

      if (stock <= 0) {
        alert(
          "This product is out of stock."
        );
        return;
      }

      const savedCart =
        JSON.parse(
          localStorage.getItem(cartKey)
        ) || [];

      const existingProduct =
        savedCart.find(
          (item) =>
            String(item.id) ===
            String(product.id)
        );

      let updatedCart;

      if (existingProduct) {

        const currentQuantity =
          Number(
            existingProduct.quantity || 0
          );

        if (
          currentQuantity >= stock
        ) {
          alert(
            "You cannot add more than the available stock."
          );
          return;
        }

        updatedCart =
          savedCart.map(
            (item) =>
              String(item.id) ===
              String(product.id)
                ? {
                    ...item,
                    quantity:
                      currentQuantity + 1,
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

      // Save only to current customer's cart
      localStorage.setItem(
        cartKey,
        JSON.stringify(updatedCart)
      );

      navigate(
        "/customer/cart"
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

 // =====================================================
// OPEN PRODUCT DETAILS
// =====================================================

const viewProduct = (id) => {
  navigate(
    `/customer/products/${id}`,
    {
      state: {
        from: "wishlist",
      },
    }
  );
};

  // =====================================================
  // EMPTY WISHLIST
  // =====================================================

  if (wishlist.length === 0) {
    return (
      <main className="wishlist-page">

        <button
  type="button"
  className="wishlist-back"
  onClick={() => navigate(-1)}
>
  <ArrowLeft size={20} />

  <span>
    Back
  </span>
</button>

        <section className="wishlist-header">

          <div>

            <span className="wishlist-label">
              CLOUDCART
            </span>

            <h1>
              My Wishlist
            </h1>

            <p>
              Products you saved
              for later.
            </p>

          </div>

        </section>

        <section className="wishlist-empty">

          <div className="wishlist-empty-icon">
            <Heart size={48} />
          </div>

          <h2>
            Your wishlist is empty
          </h2>

          <p>
            Save products you love
            and find them here later.
          </p>

          <Link
            to="/customer/products"
            className="wishlist-shop-button"
          >
            <ShoppingBag size={19} />

            <span>
              Start Shopping
            </span>
          </Link>

        </section>

      </main>
    );
  }

  // =====================================================
  // WISHLIST PAGE
  // =====================================================

  return (
    <main className="wishlist-page">

     <button
  type="button"
  className="wishlist-back"
  onClick={() => navigate(-1)}
>
  <ArrowLeft size={20} />

 <span>Back to Products</span>
</button>
      <section className="wishlist-header">

        <div>

          <span className="wishlist-label">
            CLOUDCART
          </span>

          <h1>
            My Wishlist
          </h1>

          <p>
            Products you saved
            for later.
          </p>

        </div>

        <div className="wishlist-header-right">

          <div className="wishlist-count">

            <Heart size={18} />

            <span>
              {wishlist.length} saved
            </span>

          </div>

          <button
            type="button"
            className="wishlist-clear-button"
            onClick={clearWishlist}
          >
            Clear All
          </button>

        </div>

      </section>

      <section className="wishlist-grid">

        {wishlist.map(
          (product) => {

            const stock =
              Number(
                product.stock || 0
              );

            return (
              <article
                className="wishlist-card"
                key={product.id}
              >

                <div
                  className="wishlist-image"
                  onClick={() =>
                    viewProduct(
                      product.id
                    )
                  }
                  style={{
                    cursor: "pointer",
                  }}
                >

                  <img
                    src={
                      product.image ||
                      "https://via.placeholder.com/500x400?text=CloudCart"
                    }
                    alt={
                      product.name ||
                      "Product"
                    }
                    onError={(event) => {
                      event.currentTarget.src =
                        "https://via.placeholder.com/500x400?text=CloudCart";
                    }}
                  />

                  <button
                    type="button"
                    className="wishlist-remove"
                    onClick={(event) => {
                      event.stopPropagation();

                      removeFromWishlist(
                        product.id
                      );
                    }}
                    title="Remove from wishlist"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

                <div className="wishlist-info">

                  <span className="wishlist-category">
                    {product.category ||
                      "General"}
                  </span>

                 <button
  type="button"
  className="wishlist-name"
  onClick={() => viewProduct(product.id)}
>
  {product.name || "Product"}
</button>

                  <div className="wishlist-rating">

                    <Star
                      size={15}
                      fill="currentColor"
                    />

                    <span>
                      {product.rating ||
                        "4.5"}
                    </span>

                    <span className="wishlist-reviews">
                      (
                      {product.reviews ||
                        0}
                      {" "}
                      reviews)
                    </span>

                  </div>

                  <div className="wishlist-price">

                    <strong>
                      ₹
                      {Number(
                        product.price || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                    {Number(
                      product.oldPrice || 0
                    ) > 0 && (
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

                  <div className="wishlist-stock">

                    <span>
                      Stock
                    </span>

                    <strong
                      className={
                        stock > 0
                          ? "stock-available"
                          : "stock-empty"
                      }
                    >
                      {stock}
                    </strong>

                  </div>

                  <div className="wishlist-bottom">

                    <button
                      type="button"
                      className="wishlist-view-button"
                      onClick={() =>
                        viewProduct(
                          product.id
                        )
                      }
                    >
                      View Product
                    </button>

                    <button
                      type="button"
                      className="wishlist-cart-button"
                      onClick={() =>
                        addToCart(
                          product
                        )
                      }
                      disabled={
                        stock <= 0
                      }
                    >

                      <ShoppingCart
                        size={18}
                      />

                      <span>
                        {stock <= 0
                          ? "Out of Stock"
                          : "Add to Cart"}
                      </span>

                    </button>

                  </div>

                </div>

              </article>
            );
          }
        )}

      </section>

    </main>
  );
}



export default Wishlist;
