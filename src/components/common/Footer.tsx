import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import Grid from "@mui/material/Grid";

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#2F80ED",
        color: "white",
        px: 8,
        py: 6,
      }}
    >
      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid size={4}>
          <Box display="flex" alignItems="center" mb={2}>
            <PetsIcon sx={{ color: "#FFD43B", fontSize: 32, mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: "bold", fontFamily: "'Inter', sans-serif" }}>
              My Pet
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Đăng ký để nhận thông tin khuyến mãi và tin tức mới nhất.
          </Typography>

          {/* Email form */}
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: 50,
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
              maxWidth: 300,
            }}
          >
            <TextField
              placeholder="Email Here"
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: { px: 2, flex: 1, fontSize: 14 },
              }}
            />
            <Button
              variant="contained"
              sx={{
                borderRadius: 50,
                bgcolor: "#D9E6FB",
                color: "black",
                textTransform: "none",
                fontWeight: "bold",
                px: 3,
                ":hover": { bgcolor: "#c6daf7" },
              }}
            >
              Subs
            </Button>
          </Box>
        </Grid>

        {/* Middle Column */}
        <Grid size={4}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Links
          </Typography>
          {["Trang chủ", "Dịch vụ", "Về chúng tôi", "Shop", "Liên hệ"].map((link) => (
            <Typography key={link} sx={{ mb: 1, cursor: "pointer" }}>
              {link}
            </Typography>
          ))}
        </Grid>

        {/* Right Column */}
        <Grid size={4}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Thông tin liên hệ
          </Typography>
          <Typography sx={{ mb: 1 }}>Email: info@agencyname.com</Typography>
          <Typography sx={{ mb: 1 }}>Điện thoại: +1 123 456 7890</Typography>
          <Typography sx={{ mb: 2 }}>
            Địa chỉ: 123 Anywhere St., Any City, ST 12345
          </Typography>

          {/* Social Icons */}
          <Box display="flex" gap={1}>
            <IconButton sx={{ bgcolor: "white", color: "#2F80ED" }}>
              <FacebookIcon />
            </IconButton>
            <IconButton sx={{ bgcolor: "white", color: "#2F80ED" }}>
              <YouTubeIcon />
            </IconButton>
            <IconButton sx={{ bgcolor: "white", color: "#2F80ED" }}>
              <InstagramIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      {/* Bottom copyright */}
      <Box textAlign="center" mt={6}>
        <Typography variant="body2">
          ©2027 Doris. All Rights Reserved
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
