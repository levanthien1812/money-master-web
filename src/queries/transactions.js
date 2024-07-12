import { useQuery } from "react-query";
import TransactionsService from "../services/transactions";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export const GetTransactionsQuery = (params) => {
  const {
    data: transactions,
    isError: transactionsIsError,
    error: transactionsError,
    isLoading: loadingTransactions,
    refetch: refetchTransactions,
  } = useQuery({
    queryKey: ["transactions", params],
    queryFn: ({ signal }) =>
      TransactionsService.getTransactions(params, signal),
    enabled: false,
  });

  if (transactionsIsError) {
    toast.error(transactionsError.response?.data.message);
  }

  return {
    transactions,
    loadingTransactions,
    refetchTransactions,
  };
};

export const GetTransactionsYears = (params) => {
  const {
    data: years,
    isError: yearsIsError,
    error: yearsError,
    isLoading: loadingYears,
    refetch: refetchYears,
  } = useQuery({
    queryKey: ["transactions-years", params],
    queryFn: ({ signal }) =>
      TransactionsService.getTransactionsYears(params, signal),
    enabled: false,
  });

  if (yearsIsError) {
    toast.error(yearsError.response?.data.message);
  }

  return {
    years:
      years &&
      years.map((y) => {
        return { id: y, name: y };
      }),
    loadingYears,
    refetchYears,
  };
};
