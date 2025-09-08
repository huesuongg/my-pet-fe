import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "./DashboardLayout.css";
import Logo from "../assets/logo.png";
import { useState } from "react";

const drawerWidth = 280;
const collapsedDrawerWidth = 80;

const navigationItems = [
  { title: "Admin profile", icon: <PersonIcon />, path: "/dashboard/admin-profile" },
  { title: "Schedule management", icon: <CalendarTodayIcon />, path: "/dashboard/project" },
  { title: "User management", icon: <GroupIcon />, path: "#" },
  { title: "Finance management", icon: <BarChartIcon />, path: "#" },
  { title: "Logout", icon: <LogoutIcon />, path: "/logout" },
];

const theme = createTheme({
  palette: {
    primary: {
      main: "#0049a9ff",
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#f5f5f5",
          borderRight: "none",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          margin: "4px 8px",
          borderRadius: "8px",
          "&.Mui-selected": {
            backgroundColor: "rgba(184, 25, 43, 0.1)",
            borderLeft: "3px solid #b8192b",
            "&:hover": {
              backgroundColor: "rgba(184, 25, 43, 0.15)",
            },
          },
          "&:hover": {
            backgroundColor: "rgba(184, 25, 43, 0.05)",
          },
        },
      },
    },
  },
});

export default function DashboardLayoutBasic() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleNavigation = (path: string) => {
    if (path !== "#") {
      navigate(path);
      setMobileOpen(false);
    }
  };

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const drawer = (
    <Box>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: isExpanded ? "space-between" : "center",
          backgroundColor: "#fff",
          minHeight: "64px !important",
        }}
      >
        {isExpanded && (
          <>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <img src={Logo} alt="Logo" style={{ height: "40px" }} />
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ color: "#b8192b", fontWeight: "bold" }}
              >
                TimeSheet
              </Typography>
            </Box>
          </>
        )}

        <IconButton onClick={handleToggleExpand} sx={{ color: "#b8192b" }}>
          {isExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Toolbar>
      <Divider />

      {isExpanded && (
        <>
          <Box sx={{ p: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: "text.secondary", mb: 1 }}
            >
              User info
            </Typography>
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  selected={isActive("/dashboard/profile")}
                  onClick={() => handleNavigation("/dashboard/profile")}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive("/dashboard/profile")
                        ? "#b8192b"
                        : "inherit",
                    }}
                  >
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="My profile"
                    sx={{
                      "& .MuiTypography-root": {
                        fontWeight: isActive("/dashboard/profile")
                          ? "bold"
                          : "normal",
                        color: isActive("/dashboard/profile")
                          ? "#b8192b"
                          : "inherit",
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>

          <Divider />

          <Box sx={{ p: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: "text.secondary", mb: 1 }}
            >
              Admin
            </Typography>
            <List>
              {navigationItems.slice(1, -1).map((item) => (
                <ListItem key={item.path} disablePadding>
                  <ListItemButton
                    selected={isActive(item.path)}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive(item.path) ? "#b8192b" : "inherit",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      sx={{
                        "& .MuiTypography-root": {
                          fontWeight: isActive(item.path) ? "bold" : "normal",
                          color: isActive(item.path) ? "#b8192b" : "inherit",
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>

          <Divider />
        </>
      )}

      <Box sx={{ p: isExpanded ? 2 : 1 }}>
        {isExpanded ? (
          <List>
            <ListItem disablePadding>
              <ListItemButton
                selected={isActive("/logout")}
                onClick={() => handleNavigation("/logout")}
              >
                <ListItemIcon
                  sx={{ color: isActive("/logout") ? "#b8192b" : "inherit" }}
                >
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Logout"
                  sx={{
                    "& .MuiTypography-root": {
                      fontWeight: isActive("/logout") ? "bold" : "normal",
                      color: isActive("/logout") ? "#b8192b" : "inherit",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        ) : (
          <List>
            {/* Collapsed navigation - only icons */}
            <ListItem disablePadding>
              <ListItemButton
                selected={isActive("/dashboard/profile")}
                onClick={() => handleNavigation("/dashboard/profile")}
                sx={{
                  minWidth: "auto",
                  justifyContent: "center",
                  px: 1,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive("/dashboard/profile")
                      ? "#b8192b"
                      : "inherit",
                    minWidth: "auto",
                  }}
                >
                  <PersonIcon />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>

            {navigationItems.slice(1).map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  selected={isActive(item.path)}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    minWidth: "auto",
                    justifyContent: "center",
                    px: 1,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive(item.path) ? "#b8192b" : "inherit",
                      minWidth: "auto",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );

  const currentDrawerWidth = isExpanded ? drawerWidth : collapsedDrawerWidth;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
            ml: { sm: `${currentDrawerWidth}px` },
            backgroundColor: "#fff",
            color: "#333",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{ width: { sm: currentDrawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: currentDrawerWidth,
                overflowX: "hidden",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            p: 3,
            mt: "64px",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
