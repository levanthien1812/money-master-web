import React from "react";
import { Navigate, Outlet } from "react-router";
import { fetchWallets } from "../../stores/wallets";
import { useDispatch, useSelector } from "react-redux";

function ProtectedRoute() {
  const dispatch = useDispatch();
  const { isAuthenticated, roles } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  if (roles.includes("user")) {
    dispatch(fetchWallets());
  }

  return <Outlet />;
}

export default ProtectedRoute;
