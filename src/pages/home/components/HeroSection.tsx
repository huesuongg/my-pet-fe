import { Box, Button, Typography, Stack } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Vector1 from "../../../assets/vector1.svg"; // vàng (đường nét cong)
import Vector2 from "../../../assets/vector2.svg"; // xanh nhạt (dashed line)
import Paw1 from "../../../assets/paw1.svg"; // paw dấu chân to

export default function HeroSection() {
  return (
    <Box
      sx={{
        bgcolor: "#2F80ED",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        px: { xs: 2, md: 8 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Left content */}
      <Box flex={1} zIndex={2}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            color: "white",
            lineHeight: 1.2,
          }}
        >
          Chăm Sóc <br />
          <Box component="span" color="#FFD54F">
            Boss<br />
          </Box>{" "}
          Như{" "}
          <Box component="span" color="#90CAF9">
            Gia Đình
          </Box>
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "white", mt: 3, maxWidth: 480, fontStyle: "italic" }}
        >
          "Là bác sĩ thú y, bạn không chỉ học y học – bạn học cách đồng cảm với
          những sinh linh chưa từng biết nói dối."
        </Typography>

        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          sx={{
            mt: 4,
            bgcolor: "limegreen",
            color: "white",
            fontWeight: "bold",
            px: 4,
            py: 1.5,
            borderRadius: "999px",
            "&:hover": { bgcolor: "green" },
          }}
        >
          Liên hệ ngay
        </Button>

        <Stack direction="row" alignItems="center" spacing={2} mt={6}>
          <Typography sx={{ color: "white", fontSize: 14 }}>
            Trusted By More Than 10K Customer
          </Typography>
        </Stack>
      </Box>

      {/* Right decorative paw (big paw like mockup) */}
      <Box
        component="img"
        src={Paw1}
        alt="paw"
        sx={{
          width: 370,
          position: "absolute",
          right: "30%",
          top: "20%",
          zIndex: 1,
        }}
      />

      {/* Vector vàng */}
      <Box
        component="img"
        src={Vector1}
        alt="vector yellow"
        sx={{
          position: "absolute",
          right: "15%",
          top: "55%",
          width: 150,
          zIndex: 0,
        }}
      />

      {/* Vector xanh nhạt */}
      <Box
        component="img"
        src={Vector2}
        alt="vector blue"
        sx={{
          position: "absolute",
          left: "20%",
          bottom: "8%",
          width: 160,
          zIndex: 0,
        }}
      />
    </Box>
  );
}
