import { Box, Typography, Grid, Button, Container, CircularProgress, Alert } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DoctorCard from "../components/DoctorCard";
import { useScheduling } from "../hook/useScheduling";
import { useNavigate } from "react-router-dom";

export default function SchedulesPage() {
  const { doctors, loading, error } = useScheduling();
  const navigate = useNavigate();

  const handleViewMore = () => {
    console.log("View more doctors");
  };

  const handleDoctorSelect = (doctor: any) => {
    console.log("Selected doctor:", doctor);
    console.log("Navigating to:", `/scheduling/doctor/${doctor.id}`);
    navigate(`/scheduling/doctor/${doctor.id}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#E3F2FD",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#E3F2FD",
          p: 4,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: "#F0F9FF",
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#3b80f6",
            textAlign: "center",
            mb: 6,
            fontSize: { xs: "1.8rem", md: "2.2rem" },
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Đặt Lịch Khám Bác Sĩ
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {doctors
            .filter(doctor => doctor.isActive)
            .map((doctor) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={doctor.id}>
                <DoctorCard
                  doctor={doctor}
                  onSchedule={() => handleDoctorSelect(doctor)}
                />
              </Grid>
            ))}
        </Grid>

        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={handleViewMore}
            sx={{
              bgcolor: "#1e40af",
              color: "white",
              fontWeight: "bold",
              px: 4,
              py: 1.5,
              borderRadius: "999px",
              fontSize: "1.1rem",
              "&:hover": { bgcolor: "#1395DA" },
            }}
          >
            Xem thêm
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
