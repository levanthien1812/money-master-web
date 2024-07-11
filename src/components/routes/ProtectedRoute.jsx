import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { fetchWallets, walletActions } from "../../stores/wallets";
import { useDispatch, useSelector } from "react-redux";

function ProtectedRoute() {
  const dispatch = useDispatch();
  const { isAuthenticated, roles } = useSelector((state) => state.auth);
  const { walletChosen, wallets } = useSelector((state) => state.wallet);

  useEffect(() => {
    if (isAuthenticated && roles.includes("user")) {
      dispatch(fetchWallets()).then(({ payload }) => {
        if (!walletChosen) {
          const walletChosen = payload.find((wallet) => wallet.default === 1);
          console.log("Chosen wallet:", walletChosen); // Debug log
          dispatch(walletActions.setWalletChosen(walletChosen));
        }
      });
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  if (roles.includes("admin")) {
    return <Outlet />;
  }

  if (walletChosen) return <Outlet />;
}

export default ProtectedRoute;
