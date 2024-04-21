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
    enabled: false,
  });

  let total = 0;

  if (reports && reports[category?.id]) total = reports[category?.id].amount;

  if (reportsIsError) {
    toast.error(reportsError.response?.data.message);
  }

  return { total, loadingReports, refetchReports };
};

export const GetReportQuery = (params, month = null) => {
  const {
    data: report,
    isError: reportIsError,
    error: reportError,
    isLoading: loadingReport,
    refetch: refetchReport,
  } = useQuery({
    queryKey: ["reports", month ? { ...params, month } : params],
    queryFn: ({ signal }) => ReportsService.getReports(params, signal),
    enabled: false,
  });

  console.log(report)

  if (reportIsError) {
    toast.error(reportError.response?.data.message);
  }

  return {
    report: report ? (month ? report[month + ""] : report) : null,
    loadingReport,
    refetchReport,
  };
};
