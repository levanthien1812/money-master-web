import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "./wallets";
import authReducer from "./auth";

const store = configureStore({
  reducer: {
    wallet: walletReducer,
    auth: authReducer,
  },
});

export default store;
