import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import WalletsService from "../services/wallets";
import { toast } from "react-toastify";

export const fetchWallets = createAsyncThunk(
  "wallet/fetchWallets",
  async () => {
    try {
      const responseData = await WalletsService.getWallets();
      return responseData.data.wallets;
    } catch (e) {
      toast.error(e.response.data.message);
    }
  }
);

const walletsSlice = createSlice({
  name: "wallets",
  initialState: {
    wallets: [],
    walletChosen: null,
    haveDefaultWallet: true,
    loadingWallets: false,
  },
  reducers: {
    setWalletChosen: (state, action) => {
      state.walletChosen = action.payload;
    },
    setHaveDefaultWallet: (state, action) => {
      state.haveDefaultWallet = action.payload;
    },
    setLoadingWallet: (state, action) => {
      state.loadingWallets = action.payload;
    },
    resetWallets: (state) => {
      state.wallets = [];
      state.walletChosen = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWallets.fulfilled, (state, action) => {
      state.wallets = action.payload;

      if (action.payload) {
        state.haveDefaultWallet = action.payload.length > 0;

        if (!state.walletChosen) {
          state.walletChosen = action.payload.find(
            (wallet) => wallet.default === 1
          );
        }
      }
    });
  },
});

export default walletsSlice.reducer;

export const walletActions = walletsSlice.actions;
