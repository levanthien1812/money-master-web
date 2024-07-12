import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import WalletsService from "../services/wallets";
import { toast } from "react-toastify";

const walletsSlice = createSlice({
  name: "wallets",
  initialState: {
    wallets: [],
    loadingWallets: false,
    walletChosen: null,
    haveDefaultWallet: true,
    loadingWallets: false,
  },
  reducers: {
    setWallets: (state, action) => {
      state.wallets = action.payload;
    },
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
});

export default walletsSlice.reducer;

export const walletActions = walletsSlice.actions;
