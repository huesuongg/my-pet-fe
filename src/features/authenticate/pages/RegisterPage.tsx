import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store";
import { setUser } from "../authSlice";
import { Loading } from "../../../components/Loading";
import { isBlank } from "../../../utils/stringUtils";
import { toast } from "react-toastify";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  InputAdornment,
  IconButton,
  Alert
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axiosInstance from "../../../services/axiosInstance";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2F80ED",
    },
    secondary: {
      main: "#FFD43B",
    },
    success: {
      main: "#27AE60",
    },
  },
});

export const RegisterPage = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showOTP, setShowOTP] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: ""
  });

  const [otp, setOtp] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (isBlank(formData.username)) {
      errors.username = "Tên đăng nhập là bắt buộc";
    } else if (formData.username.length < 3) {
      errors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
    }

    if (isBlank(formData.email)) {
      errors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email không hợp lệ";
    }

    if (isBlank(formData.password)) {
      errors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (isBlank(formData.confirmPassword)) {
      errors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Mật khẩu không khớp";
    }

    if (isBlank(formData.fullName)) {
      errors.fullName = "Họ và tên là bắt buộc";
    }

    if (isBlank(formData.phone)) {
      errors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      errors.phone = "Số điện thoại không hợp lệ";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    if (validateForm()) {
      setIsLoading(true);
      setError("");
      
      try {
        const response = await axiosInstance.post('/api/auth/register-request', {
          fullname: formData.fullName,
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
        
        if (response.status === 200) {
          setUserEmail(formData.email);
          setShowOTP(true);
          toast.success("Mã OTP đã được gửi đến email của bạn!");
        }
      } catch (err) {
        interface ErrorResponse {
          response?: {
            data?: {
              message?: string;
            };
          };
          message?: string;
        }
        const error = err as ErrorResponse;
        const errorMessage = error.response?.data?.message || error.message || "Đăng ký thất bại";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Mã OTP phải có 6 chữ số");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const response = await axiosInstance.post('/api/auth/verify-register', {
        email: userEmail,
        otp: otp
      });
      
      // Lưu user data và tokens vào localStorage
      const { user, accessToken, refreshToken } = response.data || {};
      
      if (user && accessToken && refreshToken) {
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
        
        // Cập nhật Redux state
        dispatch(setUser(user));
        
        toast.success("Đăng ký thành công! Chào mừng bạn đến với My Pet!");
        
        // Navigate đến trang chủ
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        throw new Error("Dữ liệu phản hồi không đầy đủ");
      }
    } catch (err) {
      interface ErrorResponse {
        response?: {
          data?: {
            message?: string;
            error?: string;
          };
        };
        message?: string;
      }
      const error = err as ErrorResponse;
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Xác thực OTP thất bại";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Loading isOpen={isLoading} />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#F5F9FF",
          py: 4,
        }}
      >
        <Container maxWidth="md">
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
              mb={3}
            >
              <PetsIcon sx={{ color: "secondary.main", fontSize: 40, mr: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="primary">
                My Pet
              </Typography>
            </Box>

            <Typography variant="h5" mb={3} fontWeight="bold">
              {showOTP ? "Xác thực Email" : "Đăng ký tài khoản mới 🐾"}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {showOTP ? (
              /* OTP Verification */
              <Box sx={{ my: 3 }}>
                <Typography variant="body1" mb={2} color="text.secondary">
                  Mã OTP đã được gửi đến email: <strong>{userEmail}</strong>
                </Typography>
                <TextField
                  fullWidth
                  label="Mã OTP (6 chữ số)"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  inputProps={{ maxLength: 6 }}
                  placeholder="Nhập mã OTP"
                  sx={{ mb: 3 }}
                />
                <Box display="flex" gap={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setShowOTP(false)}
                  >
                    Quay lại
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    size="large"
                    sx={{ borderRadius: 8, fontWeight: "bold", py: 1.5 }}
                    onClick={handleVerifyOTP}
                  >
                    Xác thực
                  </Button>
                </Box>
              </Box>
            ) : (
              /* Registration Form */
              <>
                {/* Form */}
                <Grid container spacing={3}>
                  {/* Username */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Tên đăng nhập"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      error={!!formErrors.username}
                      helperText={formErrors.username}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Email */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      error={!!formErrors.email}
                      helperText={formErrors.email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Full Name */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Họ và tên"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      error={!!formErrors.fullName}
                      helperText={formErrors.fullName}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Phone */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      error={!!formErrors.phone}
                      helperText={formErrors.phone}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Password */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Mật khẩu"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      error={!!formErrors.password}
                      helperText={formErrors.password}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Confirm Password */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Xác nhận mật khẩu"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      error={!!formErrors.confirmPassword}
                      helperText={formErrors.confirmPassword}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Register Button */}
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  size="large"
                  sx={{ 
                    borderRadius: 8, 
                    fontWeight: "bold",
                    mt: 3,
                    py: 1.5
                  }}
                  onClick={handleRegister}
                >
              Đăng ký
                </Button>

                {/* Login Link */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                Đã có tài khoản?{" "}
                    <Link 
                      to="/login" 
                      style={{ 
                        color: theme.palette.primary.main, 
                        textDecoration: "none",
                        fontWeight: "bold"
                      }}
                    >
                  Đăng nhập ngay
                    </Link>
                  </Typography>
                </Box>
              </>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default RegisterPage;
