import React, { useEffect } from "react";
import { Outlet } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import NotAllowed from "../../pages/others/NotAllowed";
import { walletActions } from "../../stores/wallets";
import { GetWalletsQuery } from "../../queries/wallets";
import Loading from "../others/Loading";

function AuthorizedRoute({ allowedRoles }) {
  const roles = useSelector((state) => state.auth.roles);
  const dispatch = useDispatch();
  const { walletChosen } = useSelector((state) => state.wallet);

  const { wallets, loadingWallets, refetchWallets } = GetWalletsQuery();

  useEffect(() => {
    refetchWallets();
  }, []);

  useEffect(() => {
    if (wallets && wallets.length > 0) {
      dispatch(walletActions.setWallets(wallets));

      if (!walletChosen) {
        const walletChosenTemp = wallets.find(
          (wallet) => parseInt(wallet.default) === 1
        );
        dispatch(walletActions.setWalletChosen(walletChosenTemp));
      }
    }
  }, [wallets, walletChosen]);

  if (loadingWallets) {
    return <Loading />;
  }

  if (roles.some((role) => allowedRoles.includes(role))) {
    return <Outlet />;
  }

  return <NotAllowed />;
}

export default AuthorizedRoute;
