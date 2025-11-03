import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk } from "../authThunk";
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
          // unwrap() để có thể catch error khi API thất bại
          await dispatch(logoutThunk()).unwrap();
          toast.success("Đăng xuất thành công! Hẹn gặp lại bạn!");
          setTimeout(() => {
            navigate(routes.HOME_PATH);
          }, 1500);
        } catch (error) {
          console.error("Logout error:", error);
          // Vẫn xóa token local và chuyển về trang chủ nếu API lỗi
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          toast.info("Đã đăng xuất khỏi thiết bị này");
          setTimeout(() => {
            navigate(routes.HOME_PATH);
            // Reload để clear state
            window.location.reload();
          }, 1000);
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
