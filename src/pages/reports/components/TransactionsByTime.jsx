import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TransactionByTimeItem from "./TransactionsByTimeItem";
import Select from "../../../components/elements/Select";

const sortOptions = [
  { id: 1, name: "Date/Month" },
  { id: 2, name: "Expenses" },
  { id: 3, name: "Incomes" },
];

const sortOrderOptions = [
  { id: 1, name: "Descendent" },
  { id: 2, name: "Ascendent" },
];

function TransactionsByTime({ reports, month, year, period }) {
  const walletChosen = useSelector((state) => state.wallet.walletChosen);
  const [sortBy, setSortBy] = useState(sortOptions[0]);
  const [sortOrder, setSortOrder] = useState(sortOrderOptions[0]);
  const [sortedReports, setSortedReports] = useState([]);

  useEffect(() => {
    let tempReports = [];
    if (sortBy.id === 1) {
      tempReports = Object.entries(reports)
        .map(([day, values]) => ({ key: day, ...values }))
        .sort((a, b) => {
          return sortOrder.id === 1 ? b.key - a.key : a.key - b.key;
        });
    } else {
      const type = sortBy.id === 2 ? "expenses" : "incomes";
      tempReports = Object.entries(reports)
        .map(([day, values]) => ({ key: day, ...values }))
        .sort((a, b) => {
          return sortOrder.id === 1 ? b[type] - a[type] : a[type] - b[type];
        });
    }

    setSortedReports(tempReports);
  }, [sortBy, sortOrder]);

  return (
    <div>
      <div className="flex md:justify-end justify-center items-center gap-3 mt-2 bg-purple-200 py-1 px-4 rounded-xl">
        <div>
          <Select
            selected={sortBy}
            setSelected={setSortBy}
            data={sortOptions}
            label={"Sort by"}
          />
        </div>
        <div>
          <Select
            selected={sortOrder}
            setSelected={setSortOrder}
            data={sortOrderOptions}
            label={"Order"}
          />
        </div>
      </div>
      <div className="mt-3">
        {sortedReports.map((item, index) => (
          <TransactionByTimeItem
            item={item}
            day={period === "month" ? item.key : null}
            index={index}
            month={period === "year" ? item.key : month.id + 1}
            year={year.id}
            wallet={walletChosen?.id}
            key={Math.random()}
          />
        ))}
      </div>
    </div>
  );
}

export default TransactionsByTime;
