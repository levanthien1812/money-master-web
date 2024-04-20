import { useQuery } from "react-query";
import ReportssService from "../services/reports";
import { toast } from "react-toastify";

export const GetTotalByMonth = (params, category) => {
  const {
    data: reports,
    isError: reportsIsError,
    error: reportsError,
    isLoading: loadingReports,
    refetch: refetchReports,
  } = useQuery({
    queryKey: ["reports", params],
    queryFn: ({ signal }) => ReportssService.getReports(params, signal),
  });

  let total = 0;

  if (reports && reports[category?.id]) total = reports[category?.id].amount;

  if (reportsIsError) {
    toast.error(reportsError.response?.data.message);
  }

  return { total, loadingReports, refetchReports };
};
