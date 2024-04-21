import { useQuery } from "react-query";
import { toast } from "react-toastify";
import PlansService from "../services/plans";

export const GetCategoryPlansQuery = (params) => {
  const {
    data: plans,
    isError: plansIsError,
    error: plansError,
    isLoading: loadingPlans,
    refetch: plansRefetch,
  } = useQuery({
    queryKey: ["category-plans", params],
    queryFn: ({ signal }) => PlansService.getCategoryPlans(params, signal),
    enabled: false,
  });

  if (plansIsError) {
    toast.error(plansError.response?.data.message);
  }

  return { plans, loadingPlans, plansRefetch };
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
    enabled: false,
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

export const GetCategoryPlansYears = (params) => {
  const {
    data: years,
    isError: yearsIsError,
    error: yearsError,
    isLoading: loadingYears,
    refetch: refetchYears,
  } = useQuery({
    queryKey: ["category-plans-years", params],
    queryFn: ({ signal }) => PlansService.getCategoryPlansYears(params, signal),
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
