import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingLayout from "../layouts/LandingLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import { LoginPage } from "../features/authenticate/pages/LoginPage";
import { PrivateRoute } from "./PrivateRoute";
import Logout from "../features/authenticate/pages/Logout";
import NotFoundPage from "../components/NotFound";
import HomePage from "../pages/home/HomePage";
import { AdminDashboard } from "../features/admin/pages/Dashboard";
import ProfilePage from "../features/forum/pages/ProfilePage";
import NewFeeds from "../features/forum/pages/NewFeeds";
import ShoppingPage from "../features/shopping/pages/ShoppingPage";
import ProductDetail from "../features/shopping/pages/ProductDetail";


export const routes = {
  ALL_PATH: "*",
  HOME_PATH: "/",
  LOGIN_PATH: "/login",
  LOGOUT_PATH: "/logout",
  DASHBOARD_PATH: "/dashboard",
  ADMIN_PROFILE_PATH: "/dashboard/admin-profile",
  PROJECTS_PATH: "/dashboard/project",
  // add profile path for forum
  PROFILE_PATH: "/profile",
  NEWSFEED_PATH: "/news-feeds",
  PROJECTS_CREATE_PATH: "/dashboard/project/create",
  SHOPPING_PATH: "/shopping",
  PRODUCT_DETAIL_PATH: "/product/:id"

};

export const router = createBrowserRouter([
  {
    path: routes.HOME_PATH,
    element: <LandingLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: routes.LOGIN_PATH, element: <LoginPage /> },
      { path: routes.ALL_PATH, element: <NotFoundPage /> },
      { path: routes.PROFILE_PATH, element: <ProfilePage  /> },
      { path: routes.NEWSFEED_PATH, element: <NewFeeds /> },
      { path: routes.SHOPPING_PATH, element: <ShoppingPage /> },
      { path: routes.PRODUCT_DETAIL_PATH, element: <ProductDetail /> },
    ],
  },
  {
    path: routes.DASHBOARD_PATH,
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: routes.ADMIN_PROFILE_PATH, element: <AdminDashboard /> },
      { path: routes.PROJECTS_PATH, element: <AdminDashboard /> },
      { path: routes.PROJECTS_CREATE_PATH, element: <AdminDashboard /> },
    ],
  },
  { path: routes.LOGOUT_PATH, element: <Logout /> },
  { path: routes.ALL_PATH, element: <NotFoundPage /> },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;