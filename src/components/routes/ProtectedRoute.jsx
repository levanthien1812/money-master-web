import React from "react";
import { Navigate, Outlet } from "react-router";
import { fetchWallets } from "../../stores/wallets";
import { useDispatch, useSelector } from "react-redux";

function ProtectedRoute() {
  const dispatch = useDispatch();
  const { isAuthenticated, roles } = useSelector((state) => state.auth);
  const walletChosen = useSelector((state) => state.wallet.walletChosen);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  if (roles.includes("admin")) {
    return <Outlet />;
  }

  dispatch(fetchWallets());

  if (walletChosen) {
    console.log(walletChosen);
    return <Outlet />;
  }
}

export default ProtectedRoute;
