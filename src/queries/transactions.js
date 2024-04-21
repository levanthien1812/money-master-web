import { useQuery } from "react-query";
import TransactionsService from "../services/transactions";
import { toast } from "react-toastify";

export const GetTransactionsQuery = (params) => {
  const {
    data: transactions,
    isError: transactionsIsError,
    error: transactionsError,
    isLoading: loadingTransactions,
    refetch: refetchTransactions,
  } = useQuery({
    queryKey: ["transactions", params],
    queryFn: ({ signal }) => TransactionsService.getTransactions(params, signal),
  });

  if (transactionsIsError) {
    toast.error(transactionsError.response?.data.message);
  }

  return { transactions, loadingTransactions, refetchTransactions };
};
