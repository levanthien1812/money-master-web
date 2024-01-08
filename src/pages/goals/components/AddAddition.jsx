import React, { useEffect, useState } from "react";
import Modal from "../../../components/modal/Modal";
import Input from "../../../components/elements/Input";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import handleAmountChange from "../../../utils/handleAmountChange";
import SelectWithImage from "../../../components/elements/SelectWithImage";
import formatCurrency from "../../../utils/currencyFormatter";
import GoalService from "../../../services/goals";
import { useTranslation } from "react-i18next";

function AddAddition({ type, onClose, goal, onUpdateSuccess }) {
  const { wallets, walletChosen } = useSelector((state) => state.wallet);
  const [wallet, setWallet] = useState(walletChosen);
  const [filteredWallets, setFilteredWallets] = useState(wallets);
  const [amount, setAmount] = useState();
  const [formattedAmount, setFormattedAmount] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState(null);
  const [isSavingAddition, setIsSavingAddition] = useState(false);

  const { t } = useTranslation();

  const handleAddAddition = async () => {
    try {
      let haveErrors = false;
      setErrors(null);
      setIsSavingAddition(true);

      if (formattedAmount.length === 0) {
        haveErrors = true;
        setErrors((prev) => {
          return { ...prev, amount: t("error.invalid_amount") };
        });
      }

      if (type === "addition" && amount > wallet.balance) {
        haveErrors = true;
        setErrors((prev) => {
          return {
            ...prev,
            amount: t("error.amount_less_balance"),
          };
        });
      }

      if (type === "withdrawal" && amount > goal.total_contributions) {
        haveErrors = true;
        setErrors((prev) => {
          return {
            ...prev,
            amount: t("error.amount_less_goal_contributions"),
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
              ? t("toast.add_addition_success")
              : t("toast.add_withdrawal_success")
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
      title={
        type === "addition" ? t("goal.add_addition") : t("goal.add_withdrawal")
      }
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
                ? t("input.wallet_get_money")
                : t("input.wallet_receive_money")
            }
            selected={wallet}
            setSelected={setWallet}
            required
          />
          <p className="text-green-600 text-sm text-end">
            {t("goal.balance")}:{" "}
            <span className="font-bold">{formatCurrency(wallet.balance)}</span>
          </p>
          <Input
            label={t("input.amount")}
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
            label={t("input.note")}
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
        <p className="text-center ">{t("no_wallet")}</p>
      )}
    </Modal>
  );
}

export default AddAddition;
