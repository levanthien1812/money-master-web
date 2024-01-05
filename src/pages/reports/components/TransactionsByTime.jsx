import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import TransactionByTimeItem from "./TransactionsByTimeItem";
import Select from "../../../components/elements/Select";
import { PERIODS, TRANSACTION_TYPE } from "../../../config/constants";
import { useTranslation } from "react-i18next";

function TransactionsByTime({ reports, month, year, period }) {
  const { t } = useTranslation();

  const sortOptions = useMemo(() => {
    return [
      {
        id: 1,
        name:
          period === PERIODS.MONTH
            ? t("report.date")
            : period === PERIODS.YEAR
            ? t("report.month")
            : "",
      },
      { id: 2, name: t("report.expenses") },
      { id: 3, name: t("report.incomes") },
    ];
  }, [period, t]);

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
    if (sortBy.id === 1) {
      tempReports = Object.entries(reports)
        .map(([day, values]) => ({ key: day, ...values }))
        .sort((a, b) => {
          return sortOrder.id === 1 ? b.key - a.key : a.key - b.key;
        });
    } else {
      const type =
        sortBy.id === 2 ? TRANSACTION_TYPE.EXPENSE : TRANSACTION_TYPE.INCOME;
      tempReports = Object.entries(reports)
        .map(([day, values]) => ({ key: day, ...values }))
        .sort((a, b) => {
          return sortOrder.id === 1 ? b[type] - a[type] : a[type] - b[type];
        });
    }

    setSortedReports(tempReports);
  }, [sortBy, sortOrder, t]);

  return (
    <div>
      <div className="flex md:justify-end justify-center items-center gap-3 mt-2 bg-purple-200 py-1 px-4 rounded-xl">
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
      <div className="mt-3">
        {sortedReports.map((item, index) => (
          <TransactionByTimeItem
            item={item}
            day={period === PERIODS.MONTH ? item.key : null}
            index={index}
            month={period === PERIODS.YEAR ? item.key : month.id + 1}
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
