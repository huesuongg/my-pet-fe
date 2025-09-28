import { Box, Button, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Vector2 from "../../../assets/vector2.svg"; // xanh nhạt (dashed line)
import Paw1 from "../../../assets/paw1.svg"; // paw dấu chân to

export default function HeroSection2() {
  return (
    <Box
      sx={{
        bgcolor: "white",
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
            color: "black",
            lineHeight: 1.2,
            fontSize: { xs: "2.5rem", md: "3.5rem" },
          }}
        >
          Yêu Thú Cưng Là Yêu Một Trái Tim Luôn Đập Vì Bạn
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontFamily: "Poppins",
            color: "black",
            mt: 3,
            maxWidth: 600,
            fontStyle: "italic",
            fontSize: "1rem",
            lineHeight: 1.6,
          }}
        >
          "Yêu thú cưng là yêu một trái tim nhỏ bé nhưng đầy chân thành – một
          trái tim không bao giờ phản bội, luôn chờ đợi bạn mỗi ngày, và chỉ cần
          sự hiện diện của bạn để cảm thấy hạnh phúc."
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
          Khám phá thêm
        </Button>
      </Box>

      {/* Right image */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop&crop=face"
          alt="cat"
          sx={{
            width: 300,
            height: 300,
            borderRadius: 3,
            objectFit: "cover",
            background: "linear-gradient(135deg, #FFB74D 0%, #FF8A65 100%)",
          }}
        />
      </Box>

      {/* Decorative yellow circle */}
      <Box
        sx={{
          position: "absolute",
          right: "15%",
          top: "15%",
          width: 20,
          height: 20,
          bgcolor: "#FFD54F",
          borderRadius: "50%",
          zIndex: 1,
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

      {/* Paw prints */}
      <Box
        component="img"
        src={Paw1}
        alt="paw"
        sx={{
          width: 40,
          position: "absolute",
          left: "5%",
          bottom: "15%",
          zIndex: 1,
          opacity: 0.6,
        }}
      />

      {/* Additional paw prints */}
      <Box
        component="img"
        src={Paw1}
        alt="paw"
        sx={{
          width: 30,
          position: "absolute",
          left: "8%",
          bottom: "20%",
          zIndex: 1,
          opacity: 0.4,
        }}
      />

      <Box
        component="img"
        src={Paw1}
        alt="paw"
        sx={{
          width: 25,
          position: "absolute",
          left: "12%",
          bottom: "25%",
          zIndex: 1,
          opacity: 0.3,
        }}
      />

      {/* Blue circle */}
      <Box
        sx={{
          position: "absolute",
          right: "10%",
          bottom: "20%",
          width: 15,
          height: 15,
          bgcolor: "#90CAF9",
          borderRadius: "50%",
          zIndex: 1,
        }}
      />
    </Box>
  );
}
