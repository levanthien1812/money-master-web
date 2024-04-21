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
    queryKey: ["category-plans", params],
    queryFn: ({ signal }) => PlansService.getCategoryPlans(params, signal),
  });

  if (planIsError) {
    toast.error(planError.response?.data.message);
  }

  return { plan, loadingPlan, planRefetch };
};

export const GetMonthPlansQuery = (params) => {
  const {
    data: plans,
    isError: plansIsError,
    error: plansError,
    isLoading: loadingPlans,
    refetch: refetchPlans,
  } = useQuery({
    queryKey: ["month-plans", params],
    queryFn: ({ signal }) => PlansService.getMonthPlans(params, signal),
  });

  if (plansIsError) {
    toast.error(plansError.response?.data.message);
  }

  return { plans, loadingPlans, refetchPlans };
};

export const GetMonthPlansYears = (params) => {
  const {
    data: years,
    isError: yearsIsError,
    error: yearsError,
    isLoading: loadingYears,
    refetch: refetchYears,
  } = useQuery({
    queryKey: ["month-plans-years", params],
    queryFn: ({ signal }) => PlansService.getMonthPlansYears(params, signal),
  });

  if (yearsIsError) {
    toast.error(yearsError.response?.data.message);
  }

  return {
    years: years && years.map((y) => {
      return { id: y, name: y };
    }),
    loadingYears,
    refetchYears,
  };
};
