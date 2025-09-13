import { Box, Typography, Button, InputBase, IconButton, Badge } from "@mui/material";

import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PetsIcon from "@mui/icons-material/Pets";
import { useNavigate } from "react-router-dom";

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

  const navigationItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Lịch khám", path: "#" },
    { label: "Sản phẩm", path: "/shopping" },
    { label: "Về chúng tôi", path: "#" },
    { label: "Hồ sơ thú y", path: "#" },
    { label: "Mạng xã hội", path: "#" },
  ];

  const handleNavigation = (path: string) => {
    if (path !== "#") {
      navigate(path);
    }
  };

  return (
    <Box
      position="static"
      color="transparent"
      sx={{
        bgcolor: "#2F80ED", 
        boxShadow: "none",
        px: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 2,
        }}
      >
        <Box display="flex" alignItems="center">
          <PetsIcon sx={{ color: "#FFD43B", fontSize: 32, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            sx={{ fontWeight: "bold", color: "white" , fontSize: "1.3rem",}}
          >
            My Pet
          </Typography>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            gap: 3,
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
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Search>
            <StyledInputBase
              placeholder="Tìm kiếm"
              inputProps={{ "aria-label": "search" }}
            />
            <IconButton size="small">
              <SearchIcon />
            </IconButton>
          </Search>
          <IconButton size="large" sx={{ color: "white" }}>
            <Badge badgeContent={3} color="info">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};
export default Header;
