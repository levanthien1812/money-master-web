import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet, useNavigate } from "react-router";
import AuthService from "../../services/auth";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import AddWallet from "../../pages/wallets/components/AddWallets";
import { walletActions } from "../../stores/wallets";
import { authActions } from "../../stores/auth";
import {
  fetchNotifications,
  notificationsActions,
} from "../../stores/notifications";
import pusher from "../../config/pusher";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

function Layout() {
  const [isLogging, setIsLogging] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { haveDefaultWallet, loadingWallets } = useSelector(
    (state) => state.wallet
  );
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchNotifications());

    var channel = pusher.subscribe("channel-user-" + user.id);

    const events = [
      "remind-add-transactions-event",
      "remind-overspend-category-plan-event",
      "remind-overspent-category-plan-event",
    ];

    events.forEach((event) => {
      channel.bind(event, function (data) {
        dispatch(fetchNotifications());
        toast.warning(data.message);
      });
    });
  }, []);

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
