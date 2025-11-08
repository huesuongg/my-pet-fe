import { Box, Typography, Grid, Container, CircularProgress, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClinicCard from "../components/ClinicCard";
import { clinicAPI } from "../clinicAPI";
import { Clinic } from "../types";

export default function ClinicsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadClinics = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await clinicAPI.getClinics();
        setClinics(data);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách phòng khám';
        setError(errorMessage);
        console.error('Error loading clinics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadClinics();
  }, []);

  const handleViewDetail = (clinicId: string) => {
    navigate(`/clinics/${clinicId}`);
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
          Danh Sách Phòng Khám Thú Y
        </Typography>

        {clinics.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Chưa có phòng khám nào
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {clinics.map((clinic) => (
              <Grid size={4} key={clinic._id}>
                <ClinicCard
                  clinic={clinic}
                  onViewDetail={() => handleViewDetail(clinic._id)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

