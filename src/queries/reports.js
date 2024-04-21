import { useQuery } from "react-query";
import ReportsService from "../services/reports";
import { toast } from "react-toastify";

export const GetTotalByMonthCategory = (params, category) => {
  const {
    data: reports,
    isError: reportsIsError,
    error: reportsError,
    isLoading: loadingReports,
    refetch: refetchReports,
  } = useQuery({
    queryKey: ["reports", { ...params, category }],
    queryFn: ({ signal }) => ReportsService.getReports(params, signal),
  });

  let total = 0;

  if (reports && reports[category?.id]) total = reports[category?.id].amount;

  if (reportsIsError) {
    toast.error(reportsError.response?.data.message);
  }

  return { total, loadingReports, refetchReports };
};

export const GetReportByMonthQuery = (params, month) => {
  const {
    data: report,
    isError: reportIsError,
    error: reportError,
    isLoading: loadingReport,
    refetch: refetchReport,
  } = useQuery({
    queryKey: ["reports", { ...params, month }],
    queryFn: ({ signal }) => ReportsService.getReports(params, signal),
  });

  if (reportIsError) {
    toast.error(reportError.response?.data.message);
  }

  return {
    report: report ? report[month + ""] : null,
    loadingReport,
    refetchReport,
  };
};
