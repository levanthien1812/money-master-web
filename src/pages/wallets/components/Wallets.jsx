import { useEffect, useState } from "react";
import ModalWithNothing from "../../../components/modal/ModalWithNothing";
import IconButton from "../../../components/elements/IconButton";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddWallet from "./AddWallets";
import Loading from "../../../components/others/Loading";
import { toast } from "react-toastify";
import WalletItem from "./WalletItem";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { GetWalletsQuery } from "../../../queries/wallets";
import Modal from "../../../components/modal/Modal";

function Wallets({ onClose }) {
  const [isAdding, setIsAdding] = useState(false);
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const wallets = useSelector((state) => state.wallet.wallets);

  const { refetchWallets, loadingWallets } = GetWalletsQuery();

  useEffect(() => {
    refetchWallets();
  }, [refetchWallets]);

  const handleAddSuccess = (action) => {
    toast.success(t("toast." + action + "_wallet_success"));
    refetchWallets();
  };

  return (
    <Modal
      onAccept={null}
      onClose={onClose}
      title={t("wallet.your_wallets")}
      action="no"
      width={"2xl:w-1/4 xl:w-1/3 sm:w-1/2 w-11/12"}
    >
      <div className="mb-3">
        {loadingWallets && <Loading />}
        {!loadingWallets &&
          wallets.map((wallet) => (
            <WalletItem
              key={wallet.id}
              wallet={wallet}
              onUpdateSuccess={handleAddSuccess}
            />
          ))}
      </div>
      <div className="flex justify-end">
        <IconButton
          icon={faPlus}
          bgColor="bg-blue-600"
          textColor="text-white"
          textColorHover="text-white"
          onClick={() => setIsAdding(true)}
        />
      </div>
      {isAdding && (
        <AddWallet
          onClose={() => setIsAdding(false)}
          onAddSuccess={handleAddSuccess}
        />
      )}
    </Modal>
  );
}

export default Wallets;
