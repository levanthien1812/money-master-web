import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import formatCurrency from "../../../utils/currencyFormatter";
import { format } from "date-fns";
import { shorten } from "../../../utils/stringFormatter";
import TransactionsService from "../../../services/transactions";
import { toast } from "react-toastify";
import { CATEGORY_TYPES } from "../../../config/constants";

function TransactionByTimeItem({ item, index, day, month, year, wallet }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [transactions, setTransactions] = useState(null);
  const [loading, setLoading] = useState(false);

  const getTransactions = async () => {
    try {
      setLoading(true);

      let params = {
        month,
        year,
        wallet,
        day,
      };

      if (day) params = { ...params, day };

      const responseData = await TransactionsService.getTransactions(params);

      if (responseData.status === "success") {
        setTransactions(responseData.data.transactions);
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (showDropdown && !transactions) {
      getTransactions();
    }
  }, [showDropdown, transactions]);

  return (
    <div>
      <div
        key={Math.random()}
        className={`flex gap-3 p-3 justify-between items-center rounded-lg hover:bg-purple-200 cursor-pointer ${
          index % 2 === 0 ? "bg-gray-200" : ""
        }`}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="flex grow">
          <div className="sm:me-10 me-5 w-1/3 flex justify-start items-center">
            <p className="text-sm bg-purple-500 text-white px-2 rounded-full">
              {day ? day + "/" + month + "/" + year : month + "/" + year}
            </p>
          </div>

          <div className="grow flex items-center justify-between">
            {item[CATEGORY_TYPES.EXPENSES] !== undefined && (
              <p className="text-md font-bold text-orange-600">
                {"-" + formatCurrency(item[CATEGORY_TYPES.EXPENSES])}
              </p>
            )}

            {item[CATEGORY_TYPES.INCOMES] !== undefined && (
              <p className="shrink-0 text-md font-bold text-green-600 text-end">
                {"+" + formatCurrency(item[CATEGORY_TYPES.INCOMES])}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end sm:pe-4 pe-0 sm:1/6 w-1/10">
          <FontAwesomeIcon
            icon={faChevronRight}
            className={`text-gray-500 ${
              showDropdown ? "rotate-90" : "rotate-0"
            }`}
          />
        </div>
      </div>
      {/* Show dropdown menu - expenses of categories*/}
      {showDropdown && (
        <div>
          {loading && <p className="text-center py-1">Loading...</p>}
          {!loading &&
            transactions &&
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex my-1 sm:mx-6 mx-2 gap-3 border-b border-b-purple-300 items-center"
              >
                <p className="w-1/5 text-sm font-bold shrink-0">
                  {format(new Date(transaction.date), "dd/MM/yyyy")}
                </p>
                <p className="grow">{shorten(transaction.title, 50)}</p>
                <p
                  className={
                    "w-1/5 text-end " +
                    (transaction.category.type === CATEGORY_TYPES[CATEGORY_TYPES.EXPENSES]
                      ? "text-orange-600"
                      : "text-green-600")
                  }
                >
                  {transaction.category.type === CATEGORY_TYPES[CATEGORY_TYPES.EXPENSES]
                    ? "-"
                    : "+"}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default TransactionByTimeItem;
