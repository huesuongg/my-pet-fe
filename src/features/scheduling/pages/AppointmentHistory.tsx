import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Paper,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  IconButton,
  Container
} from "@mui/material";
import { 
  ArrowBack, 
  CalendarToday, 
  AccessTime, 
  Person, 
  Phone, 
  CheckCircle,
  Schedule,
  Cancel
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useScheduling } from "../hook/useScheduling";
import { Appointment, Doctor } from "../types";

export default function AppointmentHistory() {
  const navigate = useNavigate();
  const { appointments, doctors, loading, error } = useScheduling();
  const [appointmentHistory, setAppointmentHistory] = useState<Array<Appointment & { doctor?: Doctor }>>([]);

  useEffect(() => {
    if (appointments && doctors) {
      const historyWithDoctors = appointments.map(appointment => {
        const doctor = doctors.find(d => d.id === appointment.doctorId);
        return { ...appointment, doctor };
      });
      setAppointmentHistory(historyWithDoctors);
    }
  }, [appointments, doctors]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#22C55E';
      case 'pending':
        return '#F59E0B';
      case 'cancelled':
        return '#EF4444';
      case 'completed':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      case 'completed':
        return 'Hoàn thành';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle sx={{ fontSize: 16 }} />;
      case 'pending':
        return <Schedule sx={{ fontSize: 16 }} />;
      case 'cancelled':
        return <Cancel sx={{ fontSize: 16 }} />;
      case 'completed':
        return <CheckCircle sx={{ fontSize: 16 }} />;
      default:
        return <Schedule sx={{ fontSize: 16 }} />;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#F0F9FF",
        }}
      >
        <Typography>Đang tải...</Typography>
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
          bgcolor: "#F0F9FF",
          p: 4,
        }}
      >
        <Typography color="error">{error}</Typography>
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
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <IconButton onClick={() => navigate('/scheduling')} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" fontWeight="bold" color="#1E40AF">
              Lịch sử đặt lịch
            </Typography>
          </Box>
          
          <Typography variant="body1" color="text.secondary">
            Quản lý và theo dõi các lịch hẹn của bạn
          </Typography>
        </Box>

        {/* Appointment List */}
        {appointmentHistory.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
            <CalendarToday sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Chưa có lịch hẹn nào
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Hãy đặt lịch khám đầu tiên của bạn
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/scheduling')}
              sx={{
                bgcolor: "#3B82F6",
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontSize: "1.1rem",
                fontWeight: "bold",
                "&:hover": {
                  bgcolor: "#2563EB",
                },
              }}
            >
              Đặt lịch ngay
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {appointmentHistory.map((appointment) => (
              <Grid size={{ xs: 12, md: 6 }} key={appointment.id}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    {/* Header with Status */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold">
                        #{appointment.id}
                      </Typography>
                      <Chip
                        icon={getStatusIcon(appointment.status)}
                        label={getStatusText(appointment.status)}
                        sx={{
                          bgcolor: getStatusColor(appointment.status),
                          color: "white",
                          fontWeight: "bold",
                        }}
                      />
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* Doctor Info */}
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar
                        src={appointment.doctor?.profileImage}
                        alt={appointment.doctor?.name}
                        sx={{ width: 50, height: 50, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {appointment.doctor?.name || 'Bác sĩ không xác định'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {appointment.doctor?.specialization || 'Chuyên khoa không xác định'}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Appointment Details */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <CalendarToday sx={{ fontSize: 16, color: "text.secondary", mr: 1 }} />
                        <Typography variant="body2">
                          {appointment.date}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <AccessTime sx={{ fontSize: 16, color: "text.secondary", mr: 1 }} />
                        <Typography variant="body2">
                          {appointment.time}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Person sx={{ fontSize: 16, color: "text.secondary", mr: 1 }} />
                        <Typography variant="body2">
                          {appointment.patientName}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Phone sx={{ fontSize: 16, color: "text.secondary", mr: 1 }} />
                        <Typography variant="body2">
                          {appointment.patientPhone}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Appointment Type */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Loại khám:
                      </Typography>
                      <Chip
                        label={appointment.type}
                        variant="outlined"
                        sx={{ borderColor: "#3B82F6", color: "#3B82F6" }}
                      />
                    </Box>

                    {/* Notes */}
                    {appointment.notes && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Ghi chú:
                        </Typography>
                        <Typography variant="body2">
                          {appointment.notes}
                        </Typography>
                      </Box>
                    )}

                    {/* Action Buttons */}
                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                      {appointment.status === 'pending' && (
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          sx={{ flex: 1 }}
                        >
                          Hủy lịch
                        </Button>
                      )}
                      
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ 
                          flex: 1,
                          bgcolor: "#3B82F6",
                          "&:hover": {
                            bgcolor: "#2563EB",
                          },
                        }}
                      >
                        Chi tiết
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Back Button */}
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/scheduling')}
            sx={{
              borderColor: "#3B82F6",
              color: "#3B82F6",
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontSize: "1.1rem",
              fontWeight: "bold",
              "&:hover": {
                borderColor: "#2563EB",
                bgcolor: "#F0F9FF",
              },
            }}
          >
            Quay lại đặt lịch
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
