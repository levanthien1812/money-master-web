import React from "react";
import TransactionItem from "./TransactionItem";

function TransactionList({ transactions, onModifySuccess }) {
  return (
    <div
      className="sm:px-12 px-2 flex flex-col overflow-y-scroll"
      style={{ maxHeight: 600 }}
    >
      <div>
        {transactions.map((transaction, index) => (
          <TransactionItem
            transaction={transaction}
            index={index}
            onModifySuccess={onModifySuccess}
            key={transaction.id}
          />
        ))}
      </div>
    </div>
  );
}

export default TransactionList;
