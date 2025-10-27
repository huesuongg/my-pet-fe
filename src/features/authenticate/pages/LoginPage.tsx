import { useDispatch, useSelector } from "react-redux";
import { login } from "../authThunk";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { AppDispatch, RootState } from "../../../store";
import { Loading } from "../../../components/Loading";
import { isBlank } from "../../../utils/stringUtils";
import { toast } from "react-toastify";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { routes } from "../../../routes/AppRouter";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2F80ED", // xanh dương chủ đạo
    },
    secondary: {
      main: "#FFD43B", // vàng accent
    },
    success: {
      main: "#27AE60", // xanh lá cho nút login
    },
  },
});

export const LoginPage = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.auth.status);
  const error = useSelector((state: RootState) => state.auth.error);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberClient, setRememberClient] = useState(false);
  const [isLoadingBackdropOpen, setLoadingBackdropOpen] =
    useState<boolean>(false);

  const handleLogin = async () => {
    if (isBlank(username) || isBlank(password)) {
      toast.error("Invalid username or password");
    } else {
      dispatch(login({ username, password, rememberClient }));
      setSubmitted(true);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !submitted) {
      toast.info("You are already logged in!");
      navigate(routes.HOME_PATH);
    }
  }, [isAuthenticated]);

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!submitted) return;
    if (status === "success" && isAuthenticated) {
      setLoadingBackdropOpen(false);
      toast.success("Đăng nhập thành công! Chào mừng bạn trở lại!");
      
      // Kiểm tra role và redirect
      if (user?.role === "admin") {
        navigate(routes.DASHBOARD_PATH);
      } else {
        navigate(routes.HOME_PATH);
      }
    } else if (status === "error") {
      setLoadingBackdropOpen(false);
      toast.error(`Lỗi: ${error}`);
      setSubmitted(false); // Reset submitted state to allow retry
    } else if (status === "loading") {
      setLoadingBackdropOpen(true);
    }
  }, [status, isAuthenticated, navigate, error, user]);

  return (
    <ThemeProvider theme={theme}>
      <Loading isOpen={isLoadingBackdropOpen} />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#F5F9FF", // nền nhẹ
        }}
      >
        <Container maxWidth="xs">
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 4,
              textAlign: "center",
            }}
          >
            {/* Logo + Title */}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mb={2}
            >
              <PetsIcon sx={{ color: "secondary.main", fontSize: 40, mr: 1 }} />
              <Typography variant="h5" fontWeight="bold" color="primary">
                My Pet
              </Typography>
            </Box>

            <Typography variant="h6" mb={2} fontWeight="bold">
              Đăng nhập để chăm sóc Boss 🐾
            </Typography>

            {/* Inputs */}
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              variant="outlined"
            />
            <TextField
              margin="normal"
              fullWidth
              label="Mật khẩu"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberClient}
                  onChange={(e) => setRememberClient(e.target.checked)}
                  color="primary"
                />
              }
              label="Ghi nhớ đăng nhập"
              sx={{ mt: 1, mb: 2 }}
            />

            {/* Login Button */}
            <Button
              fullWidth
              variant="contained"
              color="success"
              size="large"
              sx={{ borderRadius: 8, fontWeight: "bold" }}
              onClick={handleLogin}
            >
              Đăng nhập
            </Button>

            {/* Register Link */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Chưa có tài khoản?{" "}
                <Link 
                  to="/register" 
                  style={{ 
                    color: theme.palette.primary.main, 
                    textDecoration: "none",
                    fontWeight: "bold"
                  }}
                >
                  Đăng ký ngay
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default LoginPage;
