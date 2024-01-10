import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Layout from "./components/layout/Layout";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import GuessRoute from "./components/routes/GuessRoute";
import TransactionsPage from "./pages/transactions/TransactionsPage";
import ReportsPage from "./pages/reports/ReportsPage";
import CategoriesPage from "./pages/categories/CategoriesPage";
import PlansPage from "./pages/plans/PlansPage";
import { Provider } from "react-redux";
import store from "./stores";
import { ToastContainer } from "react-toastify";
import AdminPage from "./pages/admin/AdminPage";
import DefaultCategoriesPage from "./pages/admin/DefaultCategoriesPage";
import UsersPage from "./pages/admin/UsersPage";
import AuthorizedRoute from "./components/routes/AuthorizedRoute";
import NotFound from "./pages/others/NotFound";
import GoalsPage from "./pages/goals/GoalsPage";
import EventsPage from "./pages/events/EventsPage";

function App() {
  const router = createBrowserRouter([
    {
      element: <ProtectedRoute />,
      children: [
        {
          element: <Layout />,
          children: [
            {
              element: <AuthorizedRoute allowedRoles={["admin"]} />,
              children: [
                {
                  path: "/admin",
                  children: [
                    {
                      index: true,
                      element: <AdminPage />,
                    },
                    {
                      path: "categories",
                      element: <DefaultCategoriesPage />,
                    },
                    {
                      path: "users",
                      element: <UsersPage />,
                    },
                  ],
                },
              ],
            },
            {
              element: <AuthorizedRoute allowedRoles={["user"]} />,
              children: [
                {
                  path: "/",
                  element: <TransactionsPage />,
                },
                {
                  path: "/reports",
                  element: <ReportsPage />,
                },
                {
                  path: "/transactions",
                  element: <TransactionsPage />,
                },
                {
                  path: "/categories",
                  element: <CategoriesPage />,
                },
                {
                  path: "/plans",
                  element: <PlansPage />,
                },
                {
                  path: "/goals",
                  element: <GoalsPage />,
                },
                {
                  path: "/events",
                  element: <EventsPage />,
                },
              ],
            },
          ],
        },
        {},
      ],
    },
    {
      element: <GuessRoute />,
      children: [
        {
          path: "/register",
          element: <RegisterPage />,
        },
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/reset-password/:token",
          element: <ResetPasswordPage />,
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <Provider store={store}>
      <ToastContainer position="top-center" autoClose="4000" />
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
