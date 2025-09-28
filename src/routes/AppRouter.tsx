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
import SchedulesPage from "../features/scheduling/pages/SchedulesPage";
import ServiceDetail from "../features/scheduling/pages/ServiceDetail";
import TestScheduling from "../features/scheduling/pages/TestScheduling";
import CartPage from "../features/shopping/pages/CartPage";
import CheckoutPage from "../features/shopping/pages/CheckoutPage";
import OrdersPage from "../features/shopping/pages/OrdersPage";
import OrderDetail from "../features/shopping/pages/OrderDetail";
import ChatSupportPage from "../features/chat-support/pages/ChatSupportPage";
import PetProfilePage from "../features/pet/pages/PetProfilePage";
import AppointmentHistory from "../features/scheduling/pages/AppointmentHistory";
import BookingPage from "../features/scheduling/pages/BookingPage";

export const routes = {
  ALL_PATH: "*",
  HOME_PATH: "/",
  LOGIN_PATH: "/login",
  LOGOUT_PATH: "/logout",
  DASHBOARD_PATH: "/dashboard",
  ADMIN_PROFILE_PATH: "/dashboard/admin-profile",
  PROJECTS_PATH: "/dashboard/project",
  PROFILE_PATH: "/profile",
  NEWSFEED_PATH: "/news-feeds",
  PROJECTS_CREATE_PATH: "/dashboard/project/create",
  SHOPPING_PATH: "/shopping",
  PRODUCT_DETAIL_PATH: "/product/:id",
  SCHEDULING_PATH: "/scheduling",
  DOCTOR_DETAIL_PATH: "/scheduling/doctor/:id",
  TEST_SCHEDULING_PATH: "/test-scheduling",
  CART_PATH: "/cart",
  CHECKOUT_PATH: "/checkout",
  ORDERS_PATH: "/orders",
  ORDER_DETAIL_PATH: "/orders/:id",
  SCHEDULING_HISTORY_PATH: "/scheduling/history",
  PET_PROFILE_PATH: "/pet-profile",
  CHAT_SUPPORT_PATH: "/chat-support",
  BOOKING_PATH: "/scheduling/booking/:id",
};

export const router = createBrowserRouter([
  {
    path: routes.HOME_PATH,
    element: <LandingLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: routes.LOGIN_PATH, element: <LoginPage /> },
      { path: routes.ALL_PATH, element: <NotFoundPage /> },
      { path: routes.SHOPPING_PATH, element: <ShoppingPage /> },
      { path: routes.PRODUCT_DETAIL_PATH, element: <ProductDetail /> },
      { path: routes.SCHEDULING_PATH, element: <SchedulesPage /> },
      { path: routes.DOCTOR_DETAIL_PATH, element: <ServiceDetail /> },
      { path: routes.TEST_SCHEDULING_PATH, element: <TestScheduling /> },
      { path: routes.CART_PATH, element: <CartPage /> },
      { path: routes.CHECKOUT_PATH, element: <CheckoutPage /> },
      { path: routes.ORDERS_PATH, element: <OrdersPage /> },
      { path: routes.ORDER_DETAIL_PATH, element: <OrderDetail /> },
      { path: routes.CHAT_SUPPORT_PATH, element: <ChatSupportPage /> },
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
  {
    path: routes.HOME_PATH,
    element: (
      <PrivateRoute>
        <LandingLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: routes.NEWSFEED_PATH, element: <NewFeeds /> },
      { path: routes.PROFILE_PATH, element: <ProfilePage /> },
      { path: routes.CART_PATH, element: <CartPage /> },
      { path: routes.BOOKING_PATH, element: <BookingPage /> },
      { path: routes.SCHEDULING_HISTORY_PATH, element: <AppointmentHistory /> },
      { path: routes.PET_PROFILE_PATH, element: <PetProfilePage /> },
    ],
  },
  { path: routes.LOGOUT_PATH, element: <Logout /> },
  { path: routes.ALL_PATH, element: <NotFoundPage /> },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
