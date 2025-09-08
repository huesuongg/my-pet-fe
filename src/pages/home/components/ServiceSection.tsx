import { Grid, Typography, Container } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ServiceCard from "../../../components/card/ServiceCard";

export default function ServiceSection() {
  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
        Dịch Vụ Chăm Sóc Boss
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        <Grid size={4}>
          <ServiceCard
            image="https://i.pinimg.com/736x/98/ac/c8/98acc8f2493eb1b1ef7a700f95cf0c56.jpg"
            icon={<PetsIcon color="success" />}
            title="Sản Phẩm Cho Boss"
            description="Keep your pet looking and feeling their best with our full-service."
          />
        </Grid>

        <Grid size={4}>
          <ServiceCard
            image="https://i.pinimg.com/736x/2c/c4/ba/2cc4ba67e7b6784e8e676f30738edf67.jpg"
            icon={<LocalHospitalIcon color="success" />}
            title="Đặt Lịch Khám"
            description="From routine check-ups to emergency care, our experience..."
          />
        </Grid>

        <Grid size={4}>
          <ServiceCard
            image="https://i.pinimg.com/736x/c2/98/c1/c298c13859ab4163ba7843438eefd384.jpg"
            icon={<PeopleAltIcon color="success" />}
            title="Mạng Xã Hội"
            description="Going away? Leave your pet in safe hands. Our boarding service."
          />
        </Grid>
      </Grid>
    </Container>
  );
}
