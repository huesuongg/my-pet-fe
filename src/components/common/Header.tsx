import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PetsIcon from "@mui/icons-material/Pets";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 9999, // bo tròn full
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
      <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
        {/* Logo */}
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

        {/* Menu */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            gap: 3,
          }}
        >
          {[
            "Trang chủ",
            "Lịch khám",
            "Sản phẩm",
            "Về chúng tôi",
            "Hồ sơ thú y",
            "Mạng xã hội",
          ].map((item) => (
            <Button
              key={item}
              sx={{
                color: "white",
                // fontWeight: "bold",
                textTransform: "none",
                 fontSize: "1rem",
              }}
            >
              {item}
            </Button>
          ))}
        </Box>

        {/* Search + Cart */}
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
      </Toolbar>
    </Box>
  );
};
export default Header;
