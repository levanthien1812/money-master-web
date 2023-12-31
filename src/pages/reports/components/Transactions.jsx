import React from "react";
import Loading from "../../../components/others/Loading";
import TransactionsByCategory from "./TransactionsByCategory";
import TransactionsByTime from "./TransactionsByTime";
import { REPORT_TYPES } from "../../../config/constants";
import { useTranslation } from "react-i18next";

function Transactions({
  reports,
  period,
  month,
  year,
  loading,
  totalAmount,
  reportType,
}) {
  const { t } = useTranslation();

  return (
    <>
      {loading && <Loading />}
      {!loading &&
        reportType === REPORT_TYPES.CATEGORY &&
        reports &&
        Object.keys(reports).length > 0 && (
          <TransactionsByCategory
            {...{ reports, month, year, totalAmount, period, reportType }}
          />
        )}
      {!loading &&
        reportType === REPORT_TYPES.DAY_MONTH &&
        reports &&
        Object.keys(reports).length > 0 && (
          <TransactionsByTime
            {...{ month, year, reports, period, reportType }}
          />
        )}
      {!loading && reports && Object.keys(reports).length === 0 && (
        <p className="text-2xl text-center text-gray-600 py-4">
          {t("report.no_transactions")}
        </p>
      )}
    </>
  );
}

export default Transactions;
