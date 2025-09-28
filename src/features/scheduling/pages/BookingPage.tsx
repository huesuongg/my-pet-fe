import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  Avatar,
  Divider,
  IconButton
} from "@mui/material";
import { 
  ArrowBack, 
  CalendarToday, 
  AccessTime, 
  Person, 
  Phone, 
  Notes,
  CheckCircle
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useScheduling } from "../hook/useScheduling";
import { Doctor } from "../types";
import Paw1 from "../../../assets/paw1.svg";

interface BookingFormData {
  patientName: string;
  patientPhone: string;
  appointmentType: string;
  date: string;
  time: string;
  notes: string;
}

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDoctorById, createAppointment, doctorLoading, error } = useScheduling();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    patientName: '',
    patientPhone: '',
    appointmentType: '',
    date: '',
    time: '',
    notes: ''
  });
  const [availableSlots, setAvailableSlots] = useState<{date: string, time: string, available: boolean}[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const appointmentTypes = [
    "Khám tổng quát",
    "Tiêm phòng", 
    "Phẫu thuật",
    "Cấp cứu",
    "Tư vấn dinh dưỡng",
    "Khám da liễu",
    "Khám răng miệng",
    "Xét nghiệm"
  ];

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  useEffect(() => {
    const loadDoctor = async () => {
      if (id) {
        const doctorData = await getDoctorById(id);
        setDoctor(doctorData);
        if (doctorData?.availableSlots) {
          setAvailableSlots(doctorData.availableSlots);
        }
      }
    };
    loadDoctor();
  }, [id]);

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setFormData(prev => ({ ...prev, date, time: '' }));
  };

  const handleTimeSelect = (time: string) => {
    setFormData(prev => ({ ...prev, time }));
  };

  const getAvailableTimesForDate = (date: string) => {
    return availableSlots
      .filter(slot => slot.date === date && slot.available)
      .map(slot => slot.time);
  };

  const isFormValid = () => {
    return formData.patientName && 
           formData.patientPhone && 
           formData.appointmentType && 
           formData.date && 
           formData.time;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid() || !doctor) return;

    setIsSubmitting(true);
    try {
      await createAppointment({
        doctorId: doctor.id,
        date: formData.date,
        time: formData.time,
        type: formData.appointmentType,
        status: 'pending',
        phone: formData.patientPhone,
        patientName: formData.patientName,
        patientPhone: formData.patientPhone,
        notes: formData.notes
      });
      setBookingSuccess(true);
    } catch (err) {
      console.error('Booking failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(`/scheduling/doctor/${id}`);
  };

  if (doctorLoading) {
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
          bgcolor: "#F0F9FF",
          p: 4,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!doctor) {
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
        <Alert severity="warning" sx={{ maxWidth: 500 }}>
          Doctor not found
        </Alert>
      </Box>
    );
  }

  if (bookingSuccess) {
    return (
      <Box
        sx={{
          bgcolor: "#F0F9FF",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            maxWidth: 500,
            borderRadius: 4,
            boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
          }}
        >
          <CheckCircle sx={{ fontSize: 80, color: "#22C55E", mb: 3 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Đặt lịch thành công!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Lịch khám của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ lại để xác nhận.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              sx={{ px: 4 }}
            >
              Quay lại
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/scheduling")}
              sx={{ px: 4 }}
            >
              Xem lịch khác
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: "#F0F9FF",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative elements */}
      <Box
        component="img"
        src={Paw1}
        alt="paw"
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          width: 40,
          height: 40,
          opacity: 0.1,
        }}
      />
      <Box
        component="img"
        src={Paw1}
        alt="paw"
        sx={{
          position: "absolute",
          bottom: 20,
          left: 20,
          width: 30,
          height: 30,
          opacity: 0.1,
        }}
      />

      {/* Header */}
      <Box sx={{ p: 4, pb: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <IconButton onClick={handleBack} sx={{ bgcolor: "white" }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" fontWeight="bold">
            Đặt lịch khám
          </Typography>
        </Box>

        {/* Doctor Info Card */}
        <Paper
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)",
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Avatar
              src={doctor.profileImage}
              alt={doctor.name}
              sx={{ width: 80, height: 80, border: "3px solid white" }}
            />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {doctor.name}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {doctor.specialization}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {doctor.experience}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: "auto", p: 4, pt: 0 }}>
        <Grid container spacing={4}>
          {/* Left side - Form */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                Thông tin đặt lịch
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Patient Name */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Họ và tên"
                      value={formData.patientName}
                      onChange={(e) => handleInputChange('patientName', e.target.value)}
                      required
                      InputProps={{
                        startAdornment: <Person sx={{ mr: 1, color: "text.secondary" }} />
                      }}
                    />
                  </Grid>

                  {/* Patient Phone */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      value={formData.patientPhone}
                      onChange={(e) => handleInputChange('patientPhone', e.target.value)}
                      required
                      InputProps={{
                        startAdornment: <Phone sx={{ mr: 1, color: "text.secondary" }} />
                      }}
                    />
                  </Grid>

                  {/* Appointment Type */}
                  <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth required>
                      <InputLabel>Loại khám</InputLabel>
                      <Select
                        value={formData.appointmentType}
                        onChange={(e) => handleInputChange('appointmentType', e.target.value)}
                        label="Loại khám"
                      >
                        {appointmentTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Notes */}
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Ghi chú (tùy chọn)"
                      multiline
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      InputProps={{
                        startAdornment: <Notes sx={{ mr: 1, color: "text.secondary", mt: 1 }} />
                      }}
                    />
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          {/* Right side - Date and Time Selection */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                Chọn ngày và giờ
              </Typography>

              {/* Date Selection */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  <CalendarToday sx={{ mr: 1, verticalAlign: "middle" }} />
                  Chọn ngày
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                  {Array.from({ length: 7 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    const dateStr = date.toISOString().split('T')[0];
                    const isAvailable = availableSlots.some(slot => slot.date === dateStr);
                    const isSelected = selectedDate === dateStr;
                    
                    return (
                      <Chip
                        key={dateStr}
                        label={date.toLocaleDateString('vi-VN', { 
                          day: '2-digit', 
                          month: '2-digit' 
                        })}
                        onClick={() => isAvailable && handleDateSelect(dateStr)}
                        color={isSelected ? "primary" : "default"}
                        variant={isSelected ? "filled" : "outlined"}
                        disabled={!isAvailable}
                        sx={{
                          cursor: isAvailable ? 'pointer' : 'not-allowed',
                          opacity: isAvailable ? 1 : 0.5
                        }}
                      />
                    );
                  })}
                </Box>
              </Box>

              {/* Time Selection */}
              {selectedDate && (
                <Box>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    <AccessTime sx={{ mr: 1, verticalAlign: "middle" }} />
                    Chọn giờ
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                    {getAvailableTimesForDate(selectedDate).map((time) => (
                      <Chip
                        key={time}
                        label={time}
                        onClick={() => handleTimeSelect(time)}
                        color={formData.time === time ? "primary" : "default"}
                        variant={formData.time === time ? "filled" : "outlined"}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Submit Button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={!isFormValid() || isSubmitting}
                sx={{
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  borderRadius: 3,
                  background: "linear-gradient(45deg, #22C55E 0%, #16A34A 100%)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #16A34A 0%, #15803D 100%)",
                  }
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Đặt lịch ngay"
                )}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
