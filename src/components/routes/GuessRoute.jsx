import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

function GuessRoute() {
  const { isAuthenticated, roles } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return (
      <Navigate to={roles.includes("admin") ? "/admin" : "transactions"} />
    );
  }

  return <Outlet />;
}

export default GuessRoute;
