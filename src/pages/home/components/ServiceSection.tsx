import { Grid, Typography, Container, Box, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PetsIcon from "@mui/icons-material/Pets";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ServiceCard from "../../../components/card/ServiceCard";
import { useNavigate } from "react-router-dom";

export default function ServiceSection() {
  const navigate = useNavigate();
  return (
    <Container sx={{ py: 6 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        align="center"
        gutterBottom
        sx={{ fontFamily: "'Inter', sans-serif" }}
      >
        Dịch Vụ Chăm Sóc Boss
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        <Grid size={4} onClick={() => navigate("/shopping")}>
          <ServiceCard
            image="https://i.pinimg.com/736x/98/ac/c8/98acc8f2493eb1b1ef7a700f95cf0c56.jpg"
            icon={<PetsIcon color="success" />}
            title="Sản Phẩm Cho Boss"
            description="Giữ gìn và chăm sóc Boss chu đáo với các sản phẩm chất lượng."
          />
        </Grid>

        <Grid size={4} onClick={() => navigate("/scheduling")}>
          <ServiceCard
            image="https://i.pinimg.com/736x/2c/c4/ba/2cc4ba67e7b6784e8e676f30738edf67.jpg"
            icon={<LocalHospitalIcon color="success" />}
            title="Đặt Lịch Khám"
            description="Từ khám thường xuyên đến khám khẩn cấp, chúng tôi sẽ giúp bạn đặt lịch khám một cách dễ dàng và tiện lợi."
          />
        </Grid>

        <Grid size={4} onClick={() => navigate("/news-feeds")}>
          <ServiceCard
            image="https://i.pinimg.com/736x/c2/98/c1/c298c13859ab4163ba7843438eefd384.jpg"
            icon={<PeopleAltIcon color="success" />}
            title="Mạng Xã Hội"
            description="Hãy chia sẻ với mọi người những hình ảnh và video đáng yêu nhất của Boss của bạn."
          />
        </Grid>
      </Grid>

      {/* AI Chat Button */}
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          sx={{
            bgcolor: "limegreen",
            color: "white",
            fontWeight: "bold",
            px: 6,
            py: 2,
            borderRadius: "999px",
            fontSize: "1.1rem",
            fontFamily: "'Inter', sans-serif",
            "&:hover": { bgcolor: "green" },
          }}
        >
          Box chat AI, Tư vấn online
        </Button>
      </Box>
    </Container>
  );
}
