import { useQuery } from "react-query";
import CategoriesService from "../services/categories";
import { toast } from "react-toastify";

export const GetCategoriesQuery = (params) => {
  const {
    data: categories,
    isError: categoriesIsError,
    error: categoriesError,
    isLoading: loadingCategories,
    refetch: refetchCategories
  } = useQuery({
    queryKey: ["categories", params],
    queryFn: ({ signal }) => CategoriesService.getCategories(params, signal),
  });

  if (categoriesIsError) {
    toast.error(categoriesError.response?.data.message);
  }

  return { categories, loadingCategories, refetchCategories };
};
