import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet, useNavigate } from "react-router";
import AuthService from "../../services/auth";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import AddWallet from "../../pages/wallets/components/AddWallets";
import { walletActions } from "../../stores/wallets";
import { authActions } from "../../stores/auth";

function Layout() {
  const [isLogging, setIsLogging] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { haveDefaultWallet, loadingWallets } = useSelector(
    (state) => state.wallet
  );

  const handleLogout = async () => {
    try {
      toast.promise(
        AuthService.logout().then(() => {
          dispatch(authActions.logout());
          dispatch(walletActions.resetWallets());

          navigate("/login");
        }),
        {
          pending: "Logging out...",
          success: "Logout successfully!",
          error: "Failed to log out!",
        }
      );
    } catch (e) {
      toast.error(e.response.data.message);
    }
    setIsLogging(false);
  };

  return (
    <div className="bg-gray-100 flex flex-col lg:flex-row sm:flex-col">
      <Sidebar onLogout={handleLogout} isLogging={isLogging} />
      {!loadingWallets && haveDefaultWallet && (
        <div className="grow min-h-screen h-fit">
          <Outlet />
        </div>
      )}
      {!loadingWallets && !haveDefaultWallet && <AddWallet isNew />}
    </div>
  );
}

export default Layout;
