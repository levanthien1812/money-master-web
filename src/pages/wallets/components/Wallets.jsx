import React, { useState } from "react";
import ModalWithNothing from "../../../components/modal/ModalWithNothing";
import IconButton from "../../../components/elements/IconButton";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddWallet from "./AddWallets";
import Loading from "../../../components/others/Loading";
import { toast } from "react-toastify";
import WalletItem from "./WalletItem";
import { useDispatch, useSelector } from "react-redux";
import { fetchWallets } from "../../../stores/wallets";

function Wallets({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const dispatch = useDispatch();
  const wallets = useSelector((state) => state.wallet.wallets);

  const handleAddSuccess = (action) => {
    toast.success("Wallet " + action + " successfully!");
    setLoading(true);
    dispatch(fetchWallets());
    setLoading(false);
  };

  return (
    <ModalWithNothing onClose={onClose} width={"xl:w-1/4 md:w-1/3 sm:w-1/2 w-11/12"}>
      <div className="flex items-start justify-center sm:p-5 py-3 border-b border-solid border-slate-200 rounded-t max-h-screen">
        <h3 className="text-2xl text-center">Your wallets</h3>
      </div>
      <div className="relative sm:px-6 px-3 py-4 flex-auto">
        <div className="mb-3">
          {loading && <Loading />}
          {!loading &&
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
      </div>
      <div className="flex items-center justify-end sm:px-6 sm:py-4 p-3 border-t border-solid border-slate-200 rounded-b">
        <button
          className="text-gray-500 background-transparent font-bold uppercase py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={onClose}
        >
          Cancle
        </button>
      </div>
      {isAdding && (
        <AddWallet
          onClose={() => setIsAdding(false)}
          onAddSuccess={handleAddSuccess}
        />
      )}
    </ModalWithNothing>
  );
}

export default Wallets;
