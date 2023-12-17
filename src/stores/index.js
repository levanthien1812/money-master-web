import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "./wallets";
import authReducer from "./auth";
import notificationReducer from "./notifications"

const store = configureStore({
  reducer: {
    wallet: walletReducer,
    auth: authReducer,
    notification: notificationReducer
  },
});

export default store;
