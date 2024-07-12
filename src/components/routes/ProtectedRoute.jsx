import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

function ProtectedRoute() {
  const { isAuthenticated, roles } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
