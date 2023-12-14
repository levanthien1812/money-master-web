import React from "react";
import { Outlet } from "react-router";
import { useSelector } from "react-redux";
import NotAllowed from "../../pages/others/NotAllowed";

function AuthorizedRoute({ allowedRoles }) {
  const roles = useSelector((state) => state.auth.roles);

  if (roles.some((role) => allowedRoles.includes(role))) {
    return <Outlet />;
  }

  return <NotAllowed />;
}

export default AuthorizedRoute;
