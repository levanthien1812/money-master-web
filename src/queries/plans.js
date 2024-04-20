import { useQuery } from "react-query";
import { toast } from "react-toastify";
import PlansService from "../services/plans";

export const GetPlansQuery = (params) => {
  const {
    data: plan,
    isError: planIsError,
    error: planError,
    isLoading: loadingPlan,
    refetch: planRefetch,
  } = useQuery({
    queryKey: ["plans", params],
    queryFn: ({ signal }) => PlansService.getCategoryPlans(params, signal),
  });

  if (planIsError) {
    toast.error(planError.response?.data.message);
  }

  return { plan, loadingPlan, planRefetch };
};
