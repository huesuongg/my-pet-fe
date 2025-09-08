import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../authSlice";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../../store";
import { routes } from "../../../routes/AppRouter";

export const Logout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token') !== null;
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(logout());
      navigate(routes.LOGIN_PATH);
    }
  }, [isAuthenticated]);

  return null;
};

export default Logout;
