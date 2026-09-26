import { Link } from "react-router-dom";
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Store,
  ArrowRight,
  Star,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import "./Home.css";

const categories = [
  {
    name: "Electronics",
    icon: "💻",
  },
  {
    name: "Fashion",
    icon: "👕",
  },
  {
    name: "Home",
    icon: "🏠",
  },
  {
    name: "Beauty",
    icon: "✨",
  },
  {
    name: "Sports",
    icon: "⚽",
  },
  {
    name: "Grocery",
    icon: "🛒",
  },
];

const products = [
  {
    id: 1,
    name: "Premium Smartphone",
    price: "₹49,999",
    oldPrice: "₹59,999",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700",
  },
  {
    id: 2,
    name: "Wireless Headphones",
    price: "₹4,999",
    oldPrice: "₹6,999",
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700",
  },
  {
    id: 3,
    name: "Smart Watch",
    price: "₹7,499",
    oldPrice: "₹9,999",
    rating: "4.6",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700",
  },
  {
    id: 4,
    name: "Running Shoes",
    price: "₹3,999",
    oldPrice: "₹5,499",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700",
  },
];

function Home() {
  return (
    <>
      <Navbar />

      <main>

        {/* HERO */}

        <section className="hero-section">

          <div className="hero-content">

            <span className="hero-label">
              ✨ NEXT GENERATION SHOPPING
            </span>

            <h1>
              Everything You Need.
              <span> All In One Place.</span>
            </h1>

            <p>
              Discover amazing products from trusted sellers,
              secure payments, and fast delivery — all from
              one powerful marketplace.
            </p>

            <div className="hero-buttons">

              <Link to="/products" className="primary-button">
                Shop Now
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/products"
                className="secondary-button"
              >
                Explore Products
              </Link>

            </div>

            <div className="hero-trust">
              <span>✓ Verified Sellers</span>
              <span>✓ Secure Payments</span>
              <span>✓ Fast Delivery</span>
            </div>

          </div>

          <div className="hero-image-container">

            <div className="hero-image-card">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1000"
                alt="Online shopping"
              />
            </div>

            <div className="floating-card">
              <span>🔥</span>
              <div>
                <strong>Today's Deals</strong>
                <small>Up to 50% OFF</small>
              </div>
            </div>

          </div>

        </section>

        {/* CATEGORIES */}

        <section className="home-section">

          <div className="section-header">

            <div>
              <span className="section-label">EXPLORE</span>
              <h2>Popular Categories</h2>
            </div>

            <Link to="/products">
              View All <ArrowRight size={16} />
            </Link>

          </div>

          <div className="category-grid">

            {categories.map((category) => (
              <Link
                to="/products"
                className="category-card"
                key={category.name}
              >

                <div className="category-icon">
                  {category.icon}
                </div>

                <h3>{category.name}</h3>

                <span>Explore →</span>

              </Link>
            ))}

          </div>

        </section>

        {/* PRODUCTS */}

        <section className="home-section products-section">

          <div className="section-header">

            <div>
              <span className="section-label">
                SHOP NOW
              </span>
              <h2>Featured Products</h2>
            </div>

            <Link to="/products">
              View All <ArrowRight size={16} />
            </Link>

          </div>

          <div className="product-grid">

            {products.map((product) => (
              <div className="product-card" key={product.id}>

                <div className="product-image">

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                  <button className="favorite-button">
                    ♡
                  </button>

                  <span className="discount-badge">
                    SALE
                  </span>

                </div>

                <div className="product-details">

                  <span className="product-category">
                    Featured
                  </span>

                  <h3>{product.name}</h3>

                  <div className="product-rating">
                    <Star
                      size={15}
                      fill="currentColor"
                    />
                    {product.rating}
                  </div>

                  <div className="price-row">

                    <div>
                      <strong>{product.price}</strong>
                      <del>{product.oldPrice}</del>
                    </div>

                    <Link
                      to={`/products/${product.id}`}
                      className="add-button"
                    >
                      +
                    </Link>

                  </div>

                </div>

              </div>
            ))}

          </div>

        </section>

        {/* BENEFITS */}

        <section className="benefits-section">

          <div className="benefit">
            <Truck />
            <div>
              <strong>Fast Delivery</strong>
              <span>Quick & reliable shipping</span>
            </div>
          </div>

          <div className="benefit">
            <ShieldCheck />
            <div>
              <strong>Secure Payment</strong>
              <span>100% protected checkout</span>
            </div>
          </div>

          <div className="benefit">
            <RotateCcw />
            <div>
              <strong>Easy Returns</strong>
              <span>Simple return process</span>
            </div>
          </div>

          <div className="benefit">
            <Store />
            <div>
              <strong>Trusted Sellers</strong>
              <span>Verified marketplace sellers</span>
            </div>
          </div>

        </section>

      </main>
    </>
  );
}

export default Home;
