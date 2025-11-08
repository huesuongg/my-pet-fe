import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Container,
  Chip,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmergencyIcon from "@mui/icons-material/Emergency";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Clinic } from "../types";
import { clinicAPI } from "../clinicAPI";
import DoctorCard from "../../scheduling/components/DoctorCard";

const dayNames = [
  "Chủ nhật",
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
];

export default function ClinicDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClinic = async () => {
      if (id) {
        try {
          setLoading(true);
          setError(null);
          const clinicData = await clinicAPI.getClinicById(id);
          if (clinicData) {
            setClinic(clinicData);
          } else {
            setError("Không tìm thấy phòng khám");
          }
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : "Không thể tải thông tin phòng khám";
          setError(errorMessage);
          console.error("Error loading clinic:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    loadClinic();
  }, [id]);

  const handleBack = () => {
    navigate("/clinics");
  };

  const handleDoctorSelect = (doctor: { id: string; name: string }) => {
    navigate(`/scheduling/doctor/${doctor.id}`);
  };

  const formatWorkingHours = () => {
    if (!clinic?.workingHours || clinic.workingHours.length === 0) {
      return null;
    }

    return clinic.workingHours.map((wh, index) => {
      if (wh.is24Hours) {
        return (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", color: "#1f2937" }}
            >
              24/24 giờ - Tất cả các ngày trong tuần
            </Typography>
          </Box>
        );
      }

      // Sắp xếp daysOfWeek để hiển thị theo thứ tự
      const sortedDays = [...wh.daysOfWeek].sort((a, b) => a - b);
      const days = sortedDays.map((day) => dayNames[day]).join(", ");

      return (
        <Box key={index} sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", color: "#1f2937", mb: 0.5 }}
          >
            {days}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            {wh.startTime} - {wh.endTime}
          </Typography>
        </Box>
      );
    });
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

  if (!clinic) {
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
        <Alert severity="warning" sx={{ maxWidth: 500 }}>
          Không tìm thấy phòng khám
        </Alert>
      </Box>
    );
  }

  const hasEmergency24h = clinic.workingHours?.some((wh) => wh.emergency24h);

  return (
    <Box
      sx={{
        bgcolor: "#F0F9FF",
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            mb: 3,
            color: "#3b80f6",
            "&:hover": {
              bgcolor: "rgba(59, 130, 246, 0.1)",
            },
          }}
        >
          Quay lại danh sách
        </Button>

        {/* Clinic Image Header */}
        <Paper
          elevation={3}
          sx={{
            mb: 4,
            borderRadius: 3,
            overflow: "hidden",
            background: "white",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: { xs: 250, md: 400 },
              overflow: "hidden",
              position: "relative",
              bgcolor: "#f0f0f0",
            }}
          >
            <img
              src={
                clinic.imgUrl ||
                "https://product.hstatic.net/200000731893/product/nam07651-scaled_01a414b13bde4702a49abb8c626450b5.png"
              }
              alt={clinic.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.currentTarget.src =
                  "https://product.hstatic.net/200000731893/product/nam07651-scaled_01a414b13bde4702a49abb8c626450b5.png";
              }}
            />
          </Box>
        </Paper>

        {/* Clinic Information */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            background: "white",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#1f2937",
              mb: 3,
              fontSize: { xs: "1.8rem", md: "2.2rem" },
            }}
          >
            {clinic.name}
          </Typography>

          <Grid container spacing={3}>
            {/* Left Column - Basic Info */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                {/* Address */}
                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                  <LocationOnIcon
                    sx={{ fontSize: 24, color: "#1395DA", mr: 2, mt: 0.5 }}
                  />
                  <Box>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Địa chỉ
                    </Typography>
                    <Typography variant="body1">
                      {clinic.address || "Chưa có địa chỉ"}
                    </Typography>
                  </Box>
                </Box>

                {/* Phone */}
                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                  <PhoneIcon
                    sx={{ fontSize: 24, color: "#1395DA", mr: 2, mt: 0.5 }}
                  />
                  <Box>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Số điện thoại
                    </Typography>
                    <Typography variant="body1">
                      {clinic.phone || "Chưa có số điện thoại"}
                    </Typography>
                  </Box>
                </Box>

                {/* Working Hours */}
                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                  <AccessTimeIcon
                    sx={{ fontSize: 24, color: "#1395DA", mr: 2, mt: 0.5 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Thời gian làm việc
                    </Typography>
                    {formatWorkingHours() || (
                      <Typography variant="body2" color="text.secondary">
                        Chưa có thông tin
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Emergency 24h */}
                {hasEmergency24h && (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <EmergencyIcon
                      sx={{ fontSize: 24, color: "#EF4444", mr: 2 }}
                    />
                    <Chip
                      label="Trực cấp cứu 🆘 24/24h"
                      sx={{
                        bgcolor: "#EF4444",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    />
                  </Box>
                )}
              </Stack>
            </Grid>

            {/* Right Column - Technology Services */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", mb: 2, color: "#1f2937" }}
                >
                  Công nghệ - Dịch vụ
                </Typography>
                <Paper
                  sx={{
                    p: 3,
                    bgcolor: "#f9fafb",
                    borderRadius: 2,
                    maxHeight: 300,
                    overflow: "auto",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: "pre-line",
                      lineHeight: 1.8,
                      color: "#4b5563",
                    }}
                  >
                    {clinic.technologyServices ||
                      "Chưa có thông tin về công nghệ và dịch vụ"}
                  </Typography>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Doctors List */}
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#3b80f6",
              mb: 4,
              fontSize: { xs: "1.5rem", md: "1.8rem" },
            }}
          >
            Danh Sách Bác Sĩ
          </Typography>

          {clinic.doctors && clinic.doctors.length > 0 ? (
            <Grid container spacing={3} justifyContent="center">
              {clinic.doctors
                .filter((doctor) => doctor.isActive)
                .map((doctor) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={doctor.id}>
                    <DoctorCard
                      doctor={doctor}
                      onSchedule={() => handleDoctorSelect(doctor)}
                    />
                  </Grid>
                ))}
            </Grid>
          ) : (
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                bgcolor: "white",
                borderRadius: 2,
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Phòng khám này chưa có bác sĩ
              </Typography>
            </Paper>
          )}
        </Box>
      </Container>
    </Box>
  );
}
