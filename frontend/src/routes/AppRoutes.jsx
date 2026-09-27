import React from "react";

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

/* =====================================================
   CUSTOMER PAGES
===================================================== */

import CustomerLogin from "../pages/customer/CustomerLogin";
import CustomerRegister from "../pages/customer/CustomerRegister";

import CustomerProducts from "../pages/customer/products";
import CustomerProductDetails from "../pages/customer/ProductDetails";
import CustomerCart from "../pages/customer/Cart";
import CustomerOrders from "../pages/customer/Orders";
import CustomerProfile from "../pages/customer/Profile";
import CustomerWishlist from "../pages/customer/Wishlist";
import CustomerAddresses from "../pages/customer/Addresses";
import CustomerCheckout from "../pages/customer/Checkout";
import CustomerOrderDetails from "../pages/customer/OrderDetails";
import CustomerTrackOrder from "../pages/customer/TrackOrder";
import CustomerReturns from "../pages/customer/Returns";
import ForgotPassword from "../pages/ForgotPassword";
import VerifyOTP from "../pages/VerifyOTP";
import ResetPassword from "../pages/ResetPassword";
/* =====================================================
   ADMIN PAGES
===================================================== */
import AdminOrderDetails from "../pages/admin/AdminOrderDetails";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminRegister from "../pages/admin/AdminRegister";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminCustomers from "../pages/admin/AdminCustomers";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminProducts from "../pages/admin/AdminProducts";
import AddProduct from "../pages/admin/AddProduct";
import EditProduct from "../pages/admin/EditProduct";
import Sellers from "../pages/admin/Sellers";
import Users from "../pages/admin/Users";
import Reports from "../pages/admin/Reports";
import Settings from "../pages/admin/Settings";
import Logs from "../pages/admin/Logs";

/* =====================================================
   SELLER PAGES
===================================================== */

import SellerLogin from "../pages/seller/SellerLogin";
import SellerRegister from "../pages/seller/SellerRegister";
import SellerDashboard from "../pages/seller/SellerDashboard";
import SellerProducts from "../pages/seller/SellerProducts";
import SellerAddProduct from "../pages/seller/SellerAddProduct";
import SellerEditProduct from "../pages/seller/SellerEditProduct";
import SellerInventory from "../pages/seller/SellerInventory";
import SellerOrders from "../pages/seller/SellerOrders";
import SellerOrderDetails from "../pages/seller/SellerOrderDetails";
import SellerProfile from "../pages/seller/SellerProfile";
import SellerEarnings from "../pages/seller/SellerEarnings";
import SellerStore from "../pages/seller/SellerStore";
import SellerVerifyOtp from "../pages/seller/SellerVerifyOTP";


function AppRoutes() {
  return (
    <Routes>

      {/* =================================================
          HOME
      ================================================= */}

      <Route
        path="/"
        element={
          <Navigate
            to="/customer/products"
            replace
          />
        }
      />


      {/* =================================================
          CUSTOMER ROUTES
      ================================================= */}

      <Route
        path="/customer/login"
        element={<CustomerLogin />}
      />

      <Route
        path="/customer/register"
        element={<CustomerRegister />}
      />

      

      <Route
        path="/customer/products"
        element={<CustomerProducts />}
      />

      <Route
        path="/customer/products/:id"
        element={<CustomerProductDetails />}
      />

      <Route
        path="/customer/cart"
        element={<CustomerCart />}
      />

      <Route
        path="/customer/checkout"
        element={<CustomerCheckout />}
      />

      <Route
        path="/customer/orders"
        element={<CustomerOrders />}
      />

      <Route
        path="/customer/orders/:id"
        element={<CustomerOrderDetails />}
      />

      <Route
  path="/customer/track-order/:id"
  element={<CustomerTrackOrder />}
/>
      <Route
        path="/customer/profile"
        element={<CustomerProfile />}
      />

      <Route
        path="/customer/wishlist"
        element={<CustomerWishlist />}
      />

      <Route
        path="/customer/addresses"
        element={<CustomerAddresses />}
      />

      <Route
        path="/customer/returns"
        element={<CustomerReturns />}
      />


      {/* =================================================
          ADMIN ROUTES
      ================================================= */}

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      <Route
        path="/admin/register"
        element={<AdminRegister />}
      />

      <Route
        path="/admin/dashboard"
        element={<AdminDashboard />}
      />

      <Route
        path="/admin/customers"
        element={<AdminCustomers />}
      />

      <Route
        path="/admin/orders"
        element={<AdminOrders />}
      />

      <Route
        path="/admin/products"
        element={<AdminProducts />}
      />

      <Route
        path="/admin/products/add"
        element={<AddProduct />}
      />

      <Route
        path="/admin/products/edit/:id"
        element={<EditProduct />}
      />

      <Route
        path="/admin/sellers"
        element={<Sellers />}
      />

      <Route
        path="/admin/users"
        element={<Users />}
      />

      <Route
        path="/admin/reports"
        element={<Reports />}
      />

      <Route
        path="/admin/settings"
        element={<Settings />}
      />

      <Route
        path="/admin/logs"
        element={<Logs />}
      />


      {/* =================================================
          SELLER ROUTES
      ================================================= */}

      {/* SELLER LOGIN */}

      <Route
        path="/seller/login"
        element={<SellerLogin />}
      />

      {/* SELLER REGISTER */}

      <Route
        path="/seller/register"
        element={<SellerRegister />}
      />

      {/* SELLER DASHBOARD */}

      <Route
        path="/seller/dashboard"
        element={<SellerDashboard />}
      />

      {/* SELLER PRODUCTS */}

      <Route
        path="/seller/products"
        element={<SellerProducts />}
      />

      {/* SELLER ADD PRODUCT */}

      <Route
        path="/seller/products/add"
        element={<SellerAddProduct />}
      />

      {/* SELLER EDIT PRODUCT */}

      <Route
        path="/seller/products/edit/:id"
        element={<SellerEditProduct />}
      />

      {/* SELLER INVENTORY */}

      <Route
        path="/seller/inventory"
        element={<SellerInventory />}
      />

      {/* SELLER ORDERS */}

      <Route
        path="/seller/orders"
        element={<SellerOrders />}
      />

      {/* SELLER ORDER DETAILS */}

      <Route
        path="/seller/orders/:id"
        element={<SellerOrderDetails />}
      />

      {/* SELLER PROFILE */}

      <Route
        path="/seller/profile"
        element={<SellerProfile />}
      />

      {/* SELLER EARNINGS */}

      <Route
        path="/seller/earnings"
        element={<SellerEarnings />}
      />

      {/* SELLER STORE */}

      <Route
        path="/seller/store"
        element={<SellerStore />}
      />


      {/* =================================================
          UNKNOWN ROUTE
      ================================================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/customer/login"
            replace
          />
        }
      />
      {/* SELLER VERIFY OTP */}

<Route
  path="/seller/verify-otp"
  element={<SellerVerifyOtp />}
/>

<Route 
  path="/admin/orders" 
  element={<AdminOrders />} 
/>

<Route 
  path="/admin/orders/:id" 
  element={<AdminOrderDetails />} 
/>
<Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>

<Route
  path="/verify-otp"
  element={<VerifyOTP />}
/>

<Route
  path="/reset-password"
  element={<ResetPassword />}
/>

    </Routes>
  );
}

export default AppRoutes;
