import React, { useEffect, useState } from "react";
import Modal from "../../../components/modal/Modal";
import formatCurrency from "../../../utils/currencyFormatter";
import { useSelector } from "react-redux";
import SelectWithImage from "../../../components/elements/SelectWithImage";
import { toast } from "react-toastify";
import GoalService from "../../../services/goals";
import goalImage from "../../../assets/images/goal.png";
import Loading from "../../../components/others/Loading";
import { useTranslation } from "react-i18next";

function TransferSurplus({ goal, onClose, amount, onUpdateSuccess }) {
  const [type, setType] = useState(null);
  const { wallets, walletChosen } = useSelector((state) => state.wallet);
  const [selectedWallet, setSelectedWallet] = useState(walletChosen);
  const [transferableGoals, setTransferableGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [loadingGoals, setLoadingGoals] = useState(false);

  const { t } = useTranslation();

  const getTransferableGoals = async () => {
    try {
      setLoadingGoals(true);

      const responseData = await GoalService.getTransferableGoals({
        transfer_amount: amount,
      });

      if (responseData.status === "success") {
        const filteredGoals = responseData.data.goals
          .filter((g) => g.id !== goal.id)
          .map((goal) => {
            if (!goal.image || goal.image.length === 0) {
              return { ...goal, image: goalImage };
            }
            return goal;
          });

        setTransferableGoals(filteredGoals);

        if (filteredGoals.length > 0) {
          setSelectedGoal(filteredGoals[0]);
        }
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
    setLoadingGoals(false);
  };

  const handleReturnToWallet = async () => {
    try {
      const responseData = await GoalService.returnToWallet(goal.id, {
        wallet_id: selectedWallet.id,
      });

      if (responseData.status === "success") {
        onUpdateSuccess();
        toast.success(t("toast.return_wallet_success"));
        onClose();
      }
    } catch (e) {
      toast.error(e);
    }
  };

  const handleTransferToGoal = async () => {
    try {
      const responseData = await GoalService.transferToGoal(goal.id, {
        goal_to_id: selectedGoal ? selectedGoal.id : transferableGoals[0].id,
      });

      if (responseData.status === "success") {
        onUpdateSuccess();
        toast.success(t("goal.transfer_goal_success"));
        onClose();
      }
    } catch (e) {
      toast.error(e);
    }
  };

  const handleAccept = () => {
    if (!type) {
      onClose();
    } else if (type === "return") {
      handleReturnToWallet();
    } else {
      handleTransferToGoal();
    }
  };

  useEffect(() => {
    setLoadingGoals(true);
    getTransferableGoals();
  }, []);

  return (
    <Modal
      title={t("goal.transfer_surplus")}
      onAccept={handleAccept}
      onClose={onClose}
      action={type ? "yesno" : "no"}
      width={"xl:w-1/3 md:w-2/5 sm:w-1/2 w-11/12"}
    >
      <div className="flex flex-col justify-center items-center">
        <p className="text-xl mb-4">
          {t("goal.surplus")}:{" "}
          <span className="font-bold text-purple-600">
            {formatCurrency(amount)}
          </span>
        </p>
        {!type && (
          <div className="flex w-full gap-2">
            <button
              className="w-1/2 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              onClick={() => setType("return")}
            >
              {t("goal.return_wallet")}
            </button>
            <button
              className="w-1/2 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setType("transfer")}
              disabled={transferableGoals.length === 0}
            >
              {t("goal.transfer_goal")}
            </button>
          </div>
        )}
        {type && type === "return" && (
          <div className="w-4/5">
            <SelectWithImage
              data={wallets}
              label={t("input.wallet_receive_money")}
              selected={selectedWallet}
              setSelected={setSelectedWallet}
              required
            />
            <p className="text-green-600 text-sm text-center">
              Balance:{" "}
              <span className="font-bold">
                {formatCurrency(selectedWallet.balance)}
              </span>
            </p>
          </div>
        )}
        {type && type === "transfer" && (
          <div className="w-4/5">
            {loadingGoals && <Loading />}
            {!loadingGoals && transferableGoals.length > 0 && (
              <>
                <SelectWithImage
                  data={transferableGoals}
                  label={t("input.goal_receive_money")}
                  selected={selectedGoal}
                  setSelected={setSelectedGoal}
                  required
                />
                <p className="text-green-600 text-sm text-center">
                  {t("goal.total_contributions")}:{" "}
                  <span className="font-bold">
                    {formatCurrency(selectedGoal?.total_contributions)}
                  </span>
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

export default TransferSurplus;
