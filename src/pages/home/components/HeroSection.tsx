import { Box, Button, Typography, Stack, Container, Grid } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import Vector1 from "../../../assets/vector1.svg"; // vàng (đường nét cong)
import Vector2 from "../../../assets/vector2.svg"; // xanh nhạt (dashed line)
import Paw1 from "../../../assets/paw1.svg"; // paw dấu chân to
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        background: "#2F80ED",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left content */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  color: "white",
                  lineHeight: 1.1,
                  fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                  fontFamily: "'Inter', sans-serif",
                  mb: 2,
                }}
              >
                Chăm Sóc{" "}
                <Box component="span" sx={{ color: "#FFD43B" }}>
                  Boss
                </Box>{" "}
                Như{" "}
                <Box component="span" sx={{ color: "#E0F2FE" }}>
                  Gia Đình
                </Box>
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  mt: 3,
                  maxWidth: 500,
                  //   fontStyle: "italic",
                  //   fontWeight: 400,
                  fontSize: "1rem",
                  opacity: 0.9,
                  lineHeight: 1.6,
                  fontFamily: "'Roboto', sans-serif",
                }}
              >
                "Là bác sĩ thú y, bạn không chỉ học y học – bạn học cách đồng
                cảm với những sinh linh chưa từng biết nói dối."
              </Typography>

              <Stack direction="row" spacing={2} mt={4}>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: "#22C55E",
                    color: "white",
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: "50px",
                    fontSize: "1.1rem",
                    textTransform: "none",
                    fontFamily: "'Inter', sans-serif",
                    "&:hover": {
                      bgcolor: "#16A34A",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(34, 197, 94, 0.3)",
                    },
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => navigate("/scheduling")}
                >
                  Đặt lịch ngay
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<LocalHospitalIcon />}
                  sx={{
                    borderColor: "white",
                    color: "white",
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: "50px",
                    fontSize: "1.1rem",
                    textTransform: "none",
                    fontFamily: "'Inter', sans-serif",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.1)",
                      borderColor: "white",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Dịch vụ
                </Button>
              </Stack>

              {/* Stats */}
              <Stack direction="row" spacing={4} mt={6}>
                <Box textAlign="center">
                  <Typography
                    variant="h4"
                    sx={{
                      color: "#FFD43B",
                      fontWeight: 700,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    10K+
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "white",
                      opacity: 0.8,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Khách hàng tin tưởng
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography
                    variant="h4"
                    sx={{
                      color: "#FFD43B",
                      fontWeight: 700,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    50+
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "white",
                      opacity: 0.8,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Bác sĩ chuyên nghiệp
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography
                    variant="h4"
                    sx={{
                      color: "#FFD43B",
                      fontWeight: 700,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    24/7
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "white",
                      opacity: 0.8,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Cấp cứu khẩn cấp
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* Right content - Real cat image */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                position: "relative",
                height: "500px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Real cat image placeholder - you can replace with actual cat image */}
              <Box
                sx={{
                  width: "100%",
                  height: "400px",
                  background:
                    "url('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "20px",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Background decorative elements - Large vectors only */}
      <Box
        component="img"
        src={Paw1}
        alt="paw"
        sx={{
          width: 300,
          position: "absolute",
          right: "0%",
          top: "0%",
          zIndex: 999,
        }}
      />

      <Box
        component="img"
        src={Vector1}
        alt="vector yellow"
        sx={{
          position: "absolute",
          left: "0%",
          bottom: "20%",
          width: 150,
          zIndex: 1,
          color: "yellow",
        }}
      />

      <Box
        component="img"
        src={Vector2}
        alt="vector blue"
        sx={{
          position: "absolute",
          bottom: "2%",
          width: 200,
          left: "50%",
          zIndex: 1,
          color: "yellow",
        }}
      />
    </Box>
  );
}
