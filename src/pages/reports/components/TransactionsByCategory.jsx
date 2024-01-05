import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import TransactionsByCategoryItem from "./TransactionsByCategoryItem";
import Select from "../../../components/elements/Select";
import { PERIODS } from "../../../config/constants";
import { useTranslation } from "react-i18next";

function TransactionsByCategory({ reports, month, year, totalAmount, period }) {
  const { t } = useTranslation();

  const sortOptions = useMemo(
    () => [
      { id: 1, name: t("report.category_name") },
      { id: 2, name: t("report.amount") },
    ],
    [t]
  );

  const sortOrderOptions = useMemo(
    () => [
      { id: 1, name: t("report.desc") },
      { id: 2, name: t("report.asc") },
    ],
    [t]
  );

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
  }, [sortBy, sortOrder, t]);

  return (
    <>
      <div className="flex lg:justify-end sm:justify-center items-center gap-3 mt-2 bg-purple-200 py-1 px-4 rounded-xl">
        <div>
          <Select
            selected={sortBy}
            setSelected={setSortBy}
            data={sortOptions}
            label={t("report.sort_by")}
          />
        </div>
        <div>
          <Select
            selected={sortOrder}
            setSelected={setSortOrder}
            data={sortOrderOptions}
            label={t("report.order")}
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
