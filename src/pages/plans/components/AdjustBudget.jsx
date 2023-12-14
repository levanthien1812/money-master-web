import React, { useState } from "react";
import Modal from "../../../components/modal/Modal";
import Input from "../../../components/elements/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import handleAmountChange from "../../../utils/handleAmountChange";
import formatCurrency from "../../../utils/currencyFormatter";
import PlansService from "../../../services/plans";
import { toast } from "react-toastify";
import getMonthName from "../../../utils/getMonthName";

function AdjustBudget({ onClose, plan, onUpdateSuccess }) {
  const [amount, setAmount] = useState();
  const [formattedBudget, setFormattedBudget] = useState();
  const [errors, setErrors] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleBudgetChange = (event) => {
    handleAmountChange(
      event.target.value,
      setAmount,
      setFormattedBudget,
      setErrors
    );
  };

  const handleAdjustBudget = async () => {
    try {
      let haveErrors = false;
      setErrors(null);

      if (!amount || amount === "0") {
        haveErrors = true;
        setProcessing(false);
        setErrors({ amount: "Invalid amount" });
      }

      if (!haveErrors) {
        setProcessing(true);
        let responseData;
        if (!plan.category_id) {
          responseData = await PlansService.updateMonthPlan(
            { amount: amount },
            plan.id
          );
        } else {
          responseData = await PlansService.updateCategoryPlan(
            { amount: amount },
            plan.id
          );
        }

        if (responseData.status === "success") {
          onClose();
          toast.success("Update plan successfully!");
          onUpdateSuccess();
        }
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
    setProcessing(false);
  };

  return (
    <Modal
      title={"Adjust budget"}
      onClose={onClose}
      onAccept={handleAdjustBudget}
      width={"w-11/12 sm:w-fit"}
      processing={processing}
    >
      {plan.category_id && (
        <p className="text-2xl mb-3 text-center sm:text-start text-purple-600">
          {plan.category.name +
            " (" +
            getMonthName(plan.month - 1) +
            " " +
            plan.year +
            ")"}
        </p>
      )}
      {!plan.category_id && (
        <p className="text-3xl mb-3 text-center sm:text-start text-purple-600">
          {getMonthName(plan.month - 1) + " " + plan.year}
        </p>
      )}

      <div className="flex justify-between items-center sm:gap-4 gap-2 sm:flex-row flex-col">
        <Input
          label={"Current budget"}
          name={"current_amount"}
          type={"text"}
          value={formatCurrency(plan.amount)}
          disable={true}
        />
        <FontAwesomeIcon
          icon={faArrowRight}
          className="text-2xl text-purple-500 sm:block hidden"
        />
        <FontAwesomeIcon
          icon={faArrowDown}
          className="text-2xl text-purple-500 sm:hidden block"
        />
        <Input
          label={"New budget"}
          name={"amount"}
          type={"text"}
          onChange={handleBudgetChange}
          error={(errors && errors.amount) || null}
          value={formattedBudget}
          style="text-purple-500"
          required
        />
      </div>
    </Modal>
  );
}

export default AdjustBudget;
