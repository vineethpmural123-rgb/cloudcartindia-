import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  LogOut,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const { user, isLoggedIn, logout } = useAuth();

  // If user is not logged in, send them to Login.
  // If logged in, open the requested page.
  const handleProtectedPage = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">

      <div className="navbar-container">

        {/* LOGO */}

        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🛒</span>
          <span>CloudCart</span>
        </Link>


        {/* NAVIGATION */}

        <nav className="navbar-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/products">
            Products
          </Link>

          <Link to="/products">
            Categories
          </Link>

        </nav>


        {/* SEARCH */}

        <div className="navbar-search">

          <Search size={19} />

          <input
            type="text"
            placeholder="Search products..."
          />

        </div>


        {/* ACTIONS */}

        <div className="navbar-actions">

          {/* WISHLIST */}

          <button
            className="nav-icon"
            onClick={() =>
              handleProtectedPage("/customer/wishlist")
            }
            title="Wishlist"
          >
            <Heart size={21} />
          </button>


          {/* CART */}

          <button
            className="nav-icon"
            onClick={() =>
              handleProtectedPage("/customer/cart")
            }
            title="Cart"
          >
            <ShoppingCart size={21} />
          </button>


          {/* USER */}

          {!isLoggedIn ? (

            <Link
              to="/login"
              className="login-button"
            >
              <User size={18} />
              <span>Login</span>
            </Link>

          ) : (

            <div className="user-menu">

              <button className="user-button">

                <User size={18} />

                <span>
                  {user?.name || "Account"}
                </span>

              </button>

              <div className="user-dropdown">

                <Link to="/customer/dashboard">
                  Dashboard
                </Link>

                <button onClick={handleLogout}>
                  <LogOut size={16} />
                  Logout
                </button>

              </div>

            </div>

          )}


          {/* MOBILE MENU */}

          <button className="mobile-menu">
            <Menu size={23} />
          </button>

        </div>

      </div>

    </header>
  );
}

export default Navbar;
