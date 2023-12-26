import React, { useEffect, useState } from "react";
import EventsService from "../../../services/events";
import { toast } from "react-toastify";
import formatCurrency from "../../../utils/currencyFormatter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function TransactionList({ eventId }) {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const responseData = await EventsService.getTransactionsByEvent(eventId);

      if (responseData.status === "success") {
        setTransactions(responseData.data.transactions);
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center">
        <p>Transactions</p>
        <button className="w-5 h-5 flex justify-center items-center bg-purple-600 rounded-full">
          <FontAwesomeIcon icon={faPlus} className="text-white text-sm" />
        </button>
      </div>
      <div className="mt-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex rounded-md overflow-hidden shadow- shadow-md mb-2"
          >
            <div className="w-12 h-12 flex">
              <img
                src={transaction.category.image}
                className="w-full h-full object-cover"
                alt=""
              />
            </div>
            <div className="px-2 flex flex-col justify-center">
              <p className="text-sm">{transaction.title}</p>
              <p className="text-sm font-bold text-orange-600">
                {formatCurrency(transaction.amount)}
              </p>
            </div>
            {transaction.image.length > 0 && (
              <div>
                <img src={transaction.image} alt="" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionList;
