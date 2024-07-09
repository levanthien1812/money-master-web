import { useQuery } from "react-query";
import { toast } from "react-toastify";
import GoalsService from "../services/goals";

export const GetGoalsQuery = (params) => {
  const {
    data,
    isError: goalsIsError,
    error: goalsError,
    isLoading: loadingGoals,
    refetch: refetchGoals,
  } = useQuery({
    queryKey: ["goals", params],
    queryFn: ({ signal }) => GoalsService.getGoals(params, signal),
    enabled: false,
  });

  if (goalsIsError) {
    toast.error(goalsError.response?.data.message);
  }

  return {
    ...data,
    loadingGoals,
    refetchGoals,
  };
};
