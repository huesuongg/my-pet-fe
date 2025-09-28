import {
  Box,
  Typography,
  Button,
  InputBase,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import PetsIcon from "@mui/icons-material/Pets";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Shop2 } from "@mui/icons-material";
import { useCart } from "../../contexts/CartContext";
import { ShoppingCart, Receipt as ReceiptIcon } from "@mui/icons-material";
import { useAuth } from "../../features/authenticate/hooks/useAuth";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 9999,
  backgroundColor: "#fff",
  marginLeft: theme.spacing(2),
  width: "250px",
  display: "flex",
  alignItems: "center",
  padding: "2px 8px",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  flex: 1,
}));

export const Header = () => {
  const navigate = useNavigate();
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] =
    useState<null | HTMLElement>(null);
  const { cartState } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const navigationItems = [
    { label: "Trang chủ", path: "/", icon: <HomeIcon /> },
    { label: "Đặt lịch", path: "/scheduling", icon: <CalendarTodayIcon /> },
    { label: "Sản phẩm", path: "/shopping", icon: <Shop2 /> },
    { label: "Mạng xã hội", path: "/news-feeds", icon: <PersonIcon /> },
    { label: "Hồ sơ thú cưng", path: "/pet-profile", icon: <PetsIcon /> },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    setProfileAnchor(null);
    navigate("/");
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchor(null);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchor(null);
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleOrdersClick = () => {
    navigate("/orders");
    handleProfileMenuClose();
  };

  return (
    <Box
      position="static"
      color="transparent"
      sx={{
        bgcolor: "#2f80ed",
        boxShadow: "0 4px 20px rgba(59, 130, 246, 0.3)",
        px: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 1,
          maxWidth: 1400,
          mx: "auto",
        }}
      >
        {/* Logo */}
        <Box
          display="flex"
          alignItems="center"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <PetsIcon sx={{ color: "#FDE047", fontSize: 40, mr: 1.5 }} />
          <Typography
            variant="h5"
            noWrap
            sx={{
              fontWeight: "bold",
              color: "white",
              fontSize: "1.8rem",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            My Pet
          </Typography>
        </Box>
        {/* Navigation */}
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            gap: 1,
          }}
        >
          {navigationItems.map((item) => (
            <Button
              key={item.label}
              onClick={() => handleNavigation(item.path)}
              sx={{
                color: "white",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                px: 2,
                py: 1,
                borderRadius: 3,
                fontFamily: "'Inter', sans-serif",
                "&:hover": {
                  bgcolor: "rgba(253, 224, 71, 0.2)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Right Section */}
        <Box display="flex" alignItems="center" gap={1}>
          {/* Search */}
          <Search sx={{ display: { xs: "none", sm: "flex" } }}>
            <StyledInputBase
              placeholder="Tìm kiếm bác sĩ, dịch vụ..."
              inputProps={{ "aria-label": "search" }}
            />
            <IconButton size="small" sx={{ color: "#3B82F6" }}>
              <SearchIcon />
            </IconButton>
          </Search>

          {/* Notifications */}
          <IconButton
            size="large"
            sx={{ color: "white" }}
            onClick={handleNotificationMenuOpen}
          >
            <Badge badgeContent={2} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            size="large"
            sx={{ color: "white" }}
            onClick={handleCartClick}
          >
            <Badge badgeContent={cartState.totalItems} color="info">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {/* Profile or Auth Buttons */}
          {isAuthenticated ? (
            <IconButton
              size="large"
              onClick={handleProfileMenuOpen}
              sx={{ color: "white" }}
            >
              <Avatar
                src={user?.avatar}
                sx={{ width: 32, height: 32, bgcolor: "#FDE047" }}
              >
                <PersonIcon sx={{ color: "#3B82F6" }} />
              </Avatar>
            </IconButton>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<LoginIcon />}
                onClick={() => navigate("/login")}
                sx={{
                  color: "white",
                  borderColor: "white",
                  "&:hover": {
                    borderColor: "#FDE047",
                    bgcolor: "rgba(253, 224, 71, 0.1)",
                  },
                }}
              >
                Đăng nhập
              </Button>
              {/* <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={() => navigate("/register")}
                sx={{
                  bgcolor: "#FDE047",
                  color: "#3B82F6",
                  "&:hover": {
                    bgcolor: "#F2BA05",
                  },
                }}
              >
                Đăng ký
              </Button> */}
            </Box>
          )}

          {/* Mobile Menu */}
          <IconButton
            size="large"
            sx={{ color: "white", display: { xs: "block", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={handleProfileMenuClose}
        sx={{
          "& .MuiPaper-root": {
            mt: 1,
            minWidth: 250,
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          },
        }}
      >
        {/* User Info */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              src={user?.avatar}
              sx={{ width: 40, height: 40, bgcolor: "#3B82F6" }}
            >
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {user?.fullName || "User"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
              <Typography variant="caption" color="primary">
                {user?.role === "admin"
                  ? "Quản trị viên"
                  : user?.role === "doctor"
                    ? "Bác sĩ"
                    : "Người dùng"}
              </Typography>
            </Box>
          </Box>
        </Box>

        <MenuItem
          onClick={() => {
            handleProfileMenuClose();
            navigate("/profile");
          }}
        >
          <PersonIcon sx={{ mr: 1, color: "#3B82F6" }} />
          Hồ sơ cá nhân
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleProfileMenuClose();
            navigate("/scheduling/history");
          }}
        >
          <CalendarTodayIcon sx={{ mr: 1, color: "#3B82F6" }} />
          Lịch hẹn của tôi
        </MenuItem>
        <MenuItem onClick={handleOrdersClick}>
          <ReceiptIcon sx={{ mr: 1, color: "#3B82F6" }} />
          Đơn hàng của tôi
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleProfileMenuClose();
            navigate("/pet-profile");
          }}
        >
          <PetsIcon sx={{ mr: 1, color: "#3B82F6" }} />
          Hồ sơ thú cưng
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout} sx={{ color: "#EF4444" }}>
          <LogoutIcon sx={{ mr: 1 }} />
          Đăng xuất
        </MenuItem>
      </Menu>

      {/* Notification Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationMenuClose}
        sx={{
          "& .MuiPaper-root": {
            mt: 1,
            minWidth: 300,
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          },
        }}
      >
        <MenuItem onClick={handleNotificationMenuClose}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: "bold", color: "#3B82F6" }}
          >
            Thông báo mới
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleNotificationMenuClose}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Lịch hẹn với Dr. Smith vào 14:00
            </Typography>
            <Typography variant="caption" color="text.secondary">
              2 giờ trước
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleNotificationMenuClose}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Kết quả xét nghiệm đã có
            </Typography>
            <Typography variant="caption" color="text.secondary">
              1 ngày trước
            </Typography>
          </Box>
        </MenuItem>
      </Menu>
    </Box>
  );
};
export default Header;
