import { useQuery } from "react-query";
import { toast } from "react-toastify";
import WalletsService from "../services/wallets";
import { useDispatch } from "react-redux";
import { walletActions } from "../stores/wallets";

export const GetWalletsQuery = (params) => {
  const {
    data: wallets,
    isError: walletsIsError,
    error: walletsError,
    isLoading: loadingWallets,
    refetch: refetchWallets,
  } = useQuery({
    queryKey: ["wallets", params],
    queryFn: ({ signal }) => WalletsService.getWallets(),
    enabled: false,
  });

  if (walletsIsError) {
    toast.error(walletsError.response?.data.message);
  }

  return {
    wallets,
    loadingWallets,
    refetchWallets,
  };
};
