import React, { useEffect, useState } from "react";
import Modal from "../../../components/modal/Modal";
import Input from "../../../components/elements/Input";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import handleAmountChange from "../../../utils/handleAmountChange";
import SelectWithImage from "../../../components/elements/SelectWithImage";
import formatCurrency from "../../../utils/currencyFormatter";
import GoalService from "../../../services/goals";

function AddAddition({ type, onClose, goal, onUpdateSuccess }) {
  const { wallets, walletChosen } = useSelector((state) => state.wallet);
  const [wallet, setWallet] = useState(walletChosen);
  const [filteredWallets, setFilteredWallets] = useState(wallets);
  const [amount, setAmount] = useState();
  const [formattedAmount, setFormattedAmount] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState(null);
  const [isSavingAddition, setIsSavingAddition] = useState(false);

  const handleAddAddition = async () => {
    try {
      let haveErrors = false;
      setErrors(null);
      setIsSavingAddition(true);

      if (formattedAmount.length === 0) {
        haveErrors = true;
        setErrors((prev) => {
          return { ...prev, amount: "Invalid amount!" };
        });
      }

      if (type === "addition" && amount > wallet.balance) {
        haveErrors = true;
        setErrors((prev) => {
          return {
            ...prev,
            amount: "Amount must be less than wallet balance!",
          };
        });
      }

      if (type === "withdrawal" && amount > goal.total_contributions) {
        haveErrors = true;
        setErrors((prev) => {
          return {
            ...prev,
            amount:
              "Amount must be less than current goal's total contributions amount!",
          };
        });
      }

      if (!haveErrors && !errors) {
        const data = {
          amount: type === "addition" ? amount : -amount,
          note,
          wallet_id: wallet.id,
        };

        const responseData = await GoalService.createGoalAdditions(
          goal.id,
          data
        );

        if (responseData.status === "success") {
          toast.success(
            type === "addition"
              ? "Add addition successfully!"
              : "Add withdrawal successfully!"
          );

          onClose();

          if (goal.total_contributions + data.amount >= goal.amount) {
            onUpdateSuccess(goal, 4);
          } else {
            onUpdateSuccess();
          }
        }
      }
    } catch (e) {
      setErrors(e.response.data.error);
      toast.error(e.response.data.message);
    }

    setIsSavingAddition(false);
  };

  useEffect(() => {
    const _filteredWallets = wallets.filter((w) => {
      return type === "addition" ? w.balance > 0 : w;
    });
    setFilteredWallets(_filteredWallets);
    setWallet(_filteredWallets[0]);
  }, [type]);

  return (
    <Modal
      width={"xl:w-1/4 md:w-2/5 sm:w-1/2 w-11/12"}
      title={type === "addition" ? "Add addition" : "Add withdrawal"}
      onClose={onClose}
      onAccept={handleAddAddition}
      processing={isSavingAddition}
    >
      {filteredWallets.length > 0 && (
        <div>
          <SelectWithImage
            data={filteredWallets}
            label={
              type === "addition"
                ? "Wallet to get money"
                : "Wallet to receive money"
            }
            selected={wallet}
            setSelected={setWallet}
            required
          />
          <p className="text-green-600 text-sm text-end">
            Balance:{" "}
            <span className="font-bold">{formatCurrency(wallet.balance)}</span>
          </p>
          <Input
            label={"Amount"}
            name={"amount"}
            type={"text"}
            onChange={(e) =>
              handleAmountChange(
                e.target.value,
                setAmount,
                setFormattedAmount,
                setErrors
              )
            }
            required
            size="sm"
            value={formattedAmount}
            error={errors && errors.amount}
          />
          <Input
            label={"Note"}
            name={"name"}
            type={"text"}
            onChange={(e) => setNote(e.target.value)}
            size="sm"
            value={note}
            error={errors && errors.note}
          />
        </div>
      )}
      {filteredWallets.length === 0 && (
        <p className="text-center ">
          You have no suitable wallets to make additions to this goal!
        </p>
      )}
    </Modal>
  );
}

export default AddAddition;
