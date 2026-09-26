import { Navigate, Outlet } from "react-router-dom";

function ProtectedAdminRoute() {
  const adminLoggedIn =
    localStorage.getItem("adminLoggedIn") === "true";

  if (!adminLoggedIn) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return <Outlet />;
}

export default ProtectedAdminRoute;
