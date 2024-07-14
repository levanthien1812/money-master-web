import React, { useEffect, useState } from "react";
import EventsService from "../../../services/events";
import { toast } from "react-toastify";
import formatCurrency from "../../../utils/currencyFormatter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { CATEGORY_TYPES } from "../../../config/constants";
import AddTransaction from "../../transactions/components/AddTransaction";
import TransactionItem from "./TransactionItem";
import { useTranslation } from "react-i18next";
import Button from "../../../components/elements/Button";

function TransactionList({ event }) {
  const [transactions, setTransactions] = useState([]);
  const [showButtons, setShowButtons] = useState(false);
  const [addingType, setAddingType] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const { t } = useTranslation();

  const fetchTransactions = async () => {
    try {
      const responseData = await EventsService.getTransactionsByEvent(event.id);

      if (responseData.status === "success") {
        setTransactions(responseData.data.transactions);
      }
    } catch (e) {
      toast.error(e.response?.data.message);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleModifySuccess = (action) => {
    fetchTransactions();
    toast.success("Transaction is " + action + "d successfully");
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <p>{t("event.transactions")}</p>
        <div className="relative">
          <button
            className="w-5 h-5 flex justify-center items-center bg-purple-600 rounded-full"
            onClick={() => setShowButtons((prev) => !prev)}
          >
            <FontAwesomeIcon icon={faPlus} className="text-white text-sm" />
          </button>
          {showButtons && (
            <div className="absolute right-6 flex flex-col rounded-md shadow-md bg-white overflow-hidden">
              <Button
                variant="secondary"
                className="shadow-none rounded-b-none whitespace-nowrap"
                onClick={() => {
                  setAddingType(CATEGORY_TYPES.EXPENSES);
                  setIsAdding(true);
                }}
              >
                {t("event.new_expense")}
              </Button>
              <Button
                variant="secondary"
                className="shadow-none rounded-t-none whitespace-nowrap"
                onClick={() => {
                  setAddingType(CATEGORY_TYPES.INCOMES);
                  setIsAdding(true);
                }}
              >
                {t("transaction.add_income")}
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-3">
        {transactions.length > 0 &&
          transactions.map((transaction) => (
            <TransactionItem
              transaction={transaction}
              key={transaction.id}
              onModifySuccess={handleModifySuccess}
            />
          ))}
        {transactions.length === 0 && (
          <p className="text-gray-400 text-2xl text-center">
            {t("event.no_transaction")}
          </p>
        )}
      </div>
      {isAdding && (
        <AddTransaction
          onAddingSuccess={handleModifySuccess}
          type={addingType}
          setIsAdding={setIsAdding}
          event={event}
        />
      )}
    </div>
  );
}

export default TransactionList;
