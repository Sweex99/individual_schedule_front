import { createBrowserRouter } from "react-router-dom";
import { SignIn } from "../Pages/SignIn/SignIn";
import { Dashboard } from "../Pages/Dashboard/Dashboard";
import { SignInAccepted } from "../Pages/SignInAccepted/SignInAccepted";
import App from "../App";
import ProtectedRoute from "./ProtectedRoute";
import { SettingsPage } from "../Pages/Setting/Setting";
import UnprotectedRoute from "./UnprotectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
      { path: "/login", element: <UnprotectedRoute><SignIn /></UnprotectedRoute> },
      { path: "/login/accepted", element: <SignInAccepted /> },
      { path: "/settings", element: <ProtectedRoute><SettingsPage /></ProtectedRoute> },
    ]
  },
]);