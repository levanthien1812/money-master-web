import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TransactionsByCategoryItem from "./TransactionsByCategoryItem";
import Select from "../../../components/elements/Select";
import { PERIODS } from "../../../config/constants";

const sortOptions = [
  { id: 1, name: "Category name" },
  { id: 2, name: "Amount" },
];

const sortOrderOptions = [
  { id: 1, name: "Descendent" },
  { id: 2, name: "Ascendent" },
];

function TransactionsByCategory({ reports, month, year, totalAmount, period }) {
  const walletChosen = useSelector((state) => state.wallet.walletChosen);
  const [sortBy, setSortBy] = useState(sortOptions[0]);
  const [sortOrder, setSortOrder] = useState(sortOrderOptions[0]);
  const [sortedReports, setSortedReports] = useState([]);

  useEffect(() => {
    let tempReports = [];

    tempReports = Object.values(reports).sort((a, b) => {
      if (sortBy.id === 1) {
        return sortOrder.id === 1
          ? b.name?.localeCompare(a.name)
          : a.name?.localeCompare(b.name);
      } else {
        return sortOrder.id === 1 ? b.amount - a.amount : a.amount - b.amount;
      }
    });

    setSortedReports(tempReports);
  }, [sortBy, sortOrder]);

  return (
    <>
      <div className="flex lg:justify-end sm:justify-center items-center gap-3 mt-2 bg-purple-200 py-1 px-4 rounded-xl">
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

      <div className="mt-4 overflow-y-scroll" style={{ maxHeight: 600 }}>
        {sortedReports.map((item, index) => {
          return (
            <TransactionsByCategoryItem
              key={Math.random()}
              item={item}
              index={index}
              month={period === PERIODS.MONTH ? month.id + 1 : null}
              year={year.id}
              wallet={walletChosen?.id}
              percentage={
                totalAmount ? Math.round((item.amount / totalAmount) * 100) : 0
              }
            />
          );
        })}
      </div>
    </>
  );
}

export default TransactionsByCategory;
