import { Navigate, Outlet } from "react-router-dom";

function ProtectedSellerRoute() {
  const sellerToken = localStorage.getItem("sellerToken");
  const seller = localStorage.getItem("seller");

  if (!sellerToken || !seller) {
    return (
      <Navigate
        to="/seller/login"
        replace
      />
    );
  }

  return <Outlet />;
}

export default ProtectedSellerRoute;
