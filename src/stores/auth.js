import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: Cookies.get("token"),
    user: Cookies.get("token") ? JSON.parse(Cookies.get("user")) : null,
    roles: Cookies.get("roles") ? JSON.parse(Cookies.get("roles")) : [],
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.roles = action.payload.roles;

      Cookies.set("user", JSON.stringify(action.payload.user));
      Cookies.set("token", action.payload.token);
      Cookies.set("roles", JSON.stringify(action.payload.roles));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.roles = [];

      Cookies.remove("user");
      Cookies.remove("token");
      Cookies.remove("roles");
    },

    update: (state, action) => {
      state.user = action.payload;

      Cookies.set("user", JSON.stringify(action.payload));
    },
  },
});

export default authSlice.reducer;

export const authActions = authSlice.actions;
