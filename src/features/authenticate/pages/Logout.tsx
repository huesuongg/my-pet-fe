import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../authSlice";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../../store";
import { routes } from "../../../routes/AppRouter";
import { Box, CircularProgress, Typography, Paper } from "@mui/material";
import { toast } from "react-toastify";

export const Logout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    const performLogout = async () => {
      if (isAuthenticated) {
        try {
          dispatch(logout());
          toast.success("Đăng xuất thành công! Hẹn gặp lại bạn!");
          setTimeout(() => {
            navigate(routes.HOME_PATH);
          }, 1500);
        } catch (error) {
          toast.error("Có lỗi xảy ra khi đăng xuất");
          navigate(routes.HOME_PATH);
        }
      } else {
        navigate(routes.HOME_PATH);
      }
    };

    performLogout();
  }, [dispatch, navigate, isAuthenticated]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#F0F9FF",
      }}
    >
      <Paper
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 4,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6" color="primary" gutterBottom>
          Đang đăng xuất...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Vui lòng chờ trong giây lát
        </Typography>
      </Paper>
    </Box>
  );
};

export default Logout;
