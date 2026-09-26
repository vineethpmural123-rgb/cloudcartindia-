import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  Truck,
} from "lucide-react";

import "./Cart.css";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  
    const customer = JSON.parse(
    localStorage.getItem("customer")
  );

  const customerId = customer?.id;

  const cartKey = customerId
    ? `cart_${customerId}`
    : "cart";

  // =====================================================
  // LOAD CART
  // =====================================================

  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart =
          JSON.parse(
            localStorage.getItem(cartKey)
          ) || [];

        setCart(
          Array.isArray(savedCart)
            ? savedCart
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load cart:",
          error
        );

        setCart([]);
      }
    };

    loadCart();

window.addEventListener(
  "storage",
  loadCart
);

window.addEventListener(
  "cartUpdated",
  loadCart
);

return () => {
  window.removeEventListener(
    "storage",
    loadCart
  );

  window.removeEventListener(
    "cartUpdated",
    loadCart
  );
};
  }, [cartKey]);

  // =====================================================
  // UPDATE CART
  // =====================================================

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    
    localStorage.setItem(
  cartKey,
  JSON.stringify(updatedCart)
);

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };

  // =====================================================
  // INCREASE QUANTITY
  // =====================================================

  const increaseQuantity = (id) => {
    const updatedCart = cart.map(
      (item) => {
        if (
          String(item.id) !==
          String(id)
        ) {
          return item;
        }

        const currentQuantity =
          Number(item.quantity) || 1;

        const stock =
          Number(item.stock);

        // Prevent quantity going
        // beyond available stock
        if (
          Number.isFinite(stock) &&
          stock >= 0 &&
          currentQuantity >= stock
        ) {
          return item;
        }

        return {
          ...item,
          quantity:
            currentQuantity + 1,
        };
      }
    );

    updateCart(updatedCart);
  };

  // =====================================================
  // DECREASE QUANTITY
  // =====================================================

  const decreaseQuantity = (id) => {
    const updatedCart = cart
      .map((item) => {
        if (
          String(item.id) !==
          String(id)
        ) {
          return item;
        }

        const currentQuantity =
          Number(item.quantity) || 1;

        return {
          ...item,
          quantity:
            currentQuantity - 1,
        };
      })
      .filter(
        (item) =>
          Number(item.quantity) > 0
      );

    updateCart(updatedCart);
  };

  // =====================================================
  // REMOVE PRODUCT
  // =====================================================

  const removeProduct = (id) => {
    const updatedCart =
      cart.filter(
        (item) =>
          String(item.id) !==
          String(id)
      );

    updateCart(updatedCart);
  };

  // =====================================================
  // CLEAR CART
  // =====================================================

  const clearCart = () => {
    updateCart([]);
  };

  // =====================================================
  // TOTAL ITEMS
  // =====================================================

  const totalItems =
    cart.reduce(
      (total, item) =>
        total +
        (Number(item.quantity) || 0),
      0
    );

  // =====================================================
  // SUBTOTAL
  // =====================================================

  const subtotal =
    cart.reduce(
      (total, item) =>
        total +
        (Number(item.price) || 0) *
          (Number(item.quantity) || 0),
      0
    );

  // =====================================================
  // DELIVERY
  // =====================================================

  const FREE_DELIVERY_LIMIT = 1000;

  const DELIVERY_CHARGE = 99;

  const delivery =
    subtotal >= FREE_DELIVERY_LIMIT
      ? 0
      : DELIVERY_CHARGE;

  // =====================================================
  // TOTAL
  // =====================================================

  const total =
    subtotal + delivery;

  // =====================================================
  // FREE DELIVERY REMAINING
  // =====================================================

  const remainingForFreeDelivery =
    Math.max(
      FREE_DELIVERY_LIMIT -
        subtotal,
      0
    );
    const handleCheckout = () => {
  localStorage.setItem(
    "checkoutMode",
    "cart"
  );

  navigate("/customer/checkout");
};

  // =====================================================
  // EMPTY CART
  // =====================================================

  if (cart.length === 0) {
    return (
      <main className="cart-page">

       <button
  type="button"
  className="cart-back-link"
  onClick={() => navigate(-1)}
>
  <ArrowLeft size={20} />
  Back to Products
</button>

        <section className="cart-empty">

          <div className="cart-empty-icon">
            <ShoppingCart
              size={58}
              strokeWidth={1.7}
            />
          </div>

          <h1>
            Your cart is empty
          </h1>

          <p>
            You haven't added any
            products to your cart yet.
          </p>

          <Link
            to="/customer/products"
            className="cart-shop-button"
          >
            <ShoppingBag size={20} />
            Start Shopping
          </Link>

        </section>

      </main>
    );
  }

  // =====================================================
  // CART PAGE
  // =====================================================

  return (
    <main className="cart-page">

      {/* =================================================
          TOP
      ================================================= */}

      <div className="cart-top">

        <button
  type="button"
  className="cart-back-link"
  onClick={() => navigate(-1)}
>
  <ArrowLeft size={20} />
  Back to Products
</button>

      </div>

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="cart-header">

        <div>
          <span className="cart-label">
            CLOUDCART
          </span>

          <h1>
            My Cart
          </h1>

          <p>
            Review your products before
            checkout.
          </p>
        </div>

        <div className="cart-item-count">
          <ShoppingCart size={19} />

          {totalItems}{" "}
          {totalItems === 1
            ? "Item"
            : "Items"}
        </div>

      </header>

      {/* =================================================
          FREE DELIVERY MESSAGE
      ================================================= */}

      {remainingForFreeDelivery > 0 ? (
        <div className="free-delivery-message">

          <Truck size={20} />

          <span>
            Add{" "}
            <strong>
              ₹
              {remainingForFreeDelivery.toLocaleString(
                "en-IN"
              )}
            </strong>{" "}
            more to get FREE delivery.
          </span>

        </div>
      ) : (
        <div className="free-delivery-message success">

          <Truck size={20} />

          <span>
            🎉 You have unlocked{" "}
            <strong>
              FREE delivery
            </strong>
            !
          </span>

        </div>
      )}

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <section className="cart-layout">

        {/* =================================================
            PRODUCTS
        ================================================= */}

        <div className="cart-products-section">

          <div className="cart-section-header">

            <div>
              <h2>
                Shopping Cart
              </h2>

              <p>
                {totalItems}{" "}
                {totalItems === 1
                  ? "product"
                  : "products"}
              </p>
            </div>

            <button
              type="button"
              className="clear-cart-button"
              onClick={clearCart}
            >
              Clear Cart
            </button>

          </div>

          {/* =================================================
              CART ITEMS
          ================================================= */}

          <div className="cart-items">

            {cart.map((item) => {

              const quantity =
                Number(
                  item.quantity
                ) || 1;

              const price =
                Number(
                  item.price
                ) || 0;

              const stock =
                Number(item.stock);

              const itemTotal =
                price * quantity;

              const isMaxStock =
                Number.isFinite(stock) &&
                stock >= 0 &&
                quantity >= stock;

              return (
                <article
                  className="cart-item"
                  key={item.id}
                >

                  {/* IMAGE */}

                  <Link
                    to={`/customer/products/${item.id}`}
                    className="cart-item-image-link"
                  >
                    <img
                      src={
                        item.image ||
                        "https://via.placeholder.com/160x160?text=Product"
                      }
                      alt={
                        item.name ||
                        "Product"
                      }
                      className="cart-item-image"
                    />
                  </Link>

                  {/* DETAILS */}

                  <div className="cart-item-details">

                    <span className="cart-item-category">
                      {item.category ||
                        "Product"}
                    </span>

                    <Link
                      to={`/customer/products/${item.id}`}
                      className="cart-item-name"
                    >
                      {item.name ||
                        "Product"}
                    </Link>

                    <div className="cart-item-price">
                      ₹
                      {price.toLocaleString(
                        "en-IN"
                      )}
                    </div>

                    <span className="cart-stock">

                      {Number.isFinite(
                        stock
                      )
                        ? `${stock} available`
                        : "Available"}

                    </span>

                  </div>

                  {/* QUANTITY */}

                  <div className="cart-quantity-area">

                    <span className="quantity-label">
                      Quantity
                    </span>

                    <div className="quantity-control">

                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(
                            item.id
                          )
                        }
                        aria-label="Decrease quantity"
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
                        onClick={() =>
                          increaseQuantity(
                            item.id
                          )
                        }
                        aria-label="Increase quantity"
                        disabled={
                          isMaxStock
                        }
                      >
                        <Plus size={16} />
                      </button>

                    </div>

                    {isMaxStock && (
                      <small className="stock-limit">
                        Maximum stock
                      </small>
                    )}

                  </div>

                  {/* TOTAL */}

                  <div className="cart-item-total">

                    <span>
                      Total
                    </span>

                    <strong>
                      ₹
                      {itemTotal.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>

                  {/* REMOVE */}

                  <button
                    type="button"
                    className="remove-cart-button"
                    onClick={() =>
                      removeProduct(
                        item.id
                      )
                    }
                    aria-label={`Remove ${item.name}`}
                    title="Remove product"
                  >
                    <Trash2 size={19} />
                  </button>

                </article>
              );
            })}

          </div>

          {/* =================================================
              CONTINUE SHOPPING
          ================================================= */}

          <Link
            to="/customer/products"
            className="continue-shopping-button"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>

        </div>

        {/* =================================================
            ORDER SUMMARY
        ================================================= */}

        <aside className="cart-summary">

          <h2>
            Order Summary
          </h2>

          {/* ITEMS */}

          <div className="summary-row">

            <span>
              Items
            </span>

            <strong>
              {totalItems}
            </strong>

          </div>

          {/* SUBTOTAL */}

          <div className="summary-row">

            <span>
              Subtotal
            </span>

            <strong>
              ₹
              {subtotal.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

          {/* DELIVERY */}

          <div className="summary-row">

            <span>
              Delivery
            </span>

            <strong
              className={
                delivery === 0
                  ? "free-text"
                  : ""
              }
            >
              {delivery === 0
                ? "FREE"
                : `₹${delivery}`}
            </strong>

          </div>

          <div className="summary-divider" />

          {/* TOTAL */}

          <div className="summary-total">

            <span>
              Total
            </span>

            <strong>
              ₹
              {total.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

          {/* CHECKOUT */}

          <button
  type="button"
  className="checkout-button"
  onClick={handleCheckout}
>
  Proceed to Checkout
</button>

          {/* SECURITY */}

          <div className="checkout-security">

            <ShieldCheck size={18} />

            <span>
              Safe and secure checkout
            </span>

          </div>

        </aside>

      </section>

    </main>
  );
}

export default Cart;
