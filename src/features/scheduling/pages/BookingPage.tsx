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
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Card,
  Container,
  Stack,
  Fade,
  Zoom,
  Slide,
  Divider,
  Badge,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack,
  CalendarToday,
  AccessTime,
  Person,
  Phone,
  Notes,
  CheckCircle,
  Payment,
  AccountBalance,
  Pets as PetsIcon,
  Star,
  LocationOn,
  Schedule,
  LocalHospital,
  Verified,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useScheduling } from "../hook/useScheduling";
import { Doctor } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store";
import { getPetsByUserId } from "../../pet/petThunk";
import Paw1 from "../../../assets/paw1.svg";

interface BookingFormData {
  patientName: string;
  patientPhone: string;
  appointmentType: string;
  date: string;
  time: string;
  notes: string;
  paymentMethod: string;
  petId: string;
}

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { getDoctorById, createAppointment, doctorLoading, error } =
    useScheduling();
  const { user } = useSelector((state: RootState) => state.auth);
  const { pets, loading: petsLoading } = useSelector(
    (state: RootState) => state.pet
  );
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    patientName: "",
    patientPhone: "",
    appointmentType: "",
    date: "",
    time: "",
    notes: "",
    paymentMethod: "cash",
    petId: "",
  });
  const [availableSlots, setAvailableSlots] = useState<
    { date: string; time: string; available: boolean }[]
  >([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [appointmentId, setAppointmentId] = useState<string>("");

  const appointmentTypes = [
    "Khám tổng quát",
    "Tiêm phòng",
    "Phẫu thuật",
    "Cấp cứu",
    "Tư vấn dinh dưỡng",
    "Khám da liễu",
    "Khám răng miệng",
    "Xét nghiệm",
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

  useEffect(() => {
    if (user?.id) {
      dispatch(getPetsByUserId(Number(user.id)));
    }
  }, [dispatch, user?.id]);

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setFormData((prev) => ({ ...prev, date, time: "" }));
  };

  const handleTimeSelect = (time: string) => {
    setFormData((prev) => ({ ...prev, time }));
  };

  const getAvailableTimesForDate = (date: string) => {
    const times = availableSlots
      .filter((slot) => slot.date === date && slot.available)
      .map((slot) => slot.time);
    // Remove duplicates and sort
    return [...new Set(times)].sort();
  };

  const isFormValid = () => {
    return (
      formData.patientName &&
      formData.patientPhone &&
      formData.appointmentType &&
      formData.date &&
      formData.time &&
      formData.petId
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid() || !doctor) return;

    setIsSubmitting(true);
    try {
      const newAppointment = await createAppointment({
        doctorId: doctor.id,
        date: formData.date,
        time: formData.time,
        type: formData.appointmentType,
        status: "confirmed",
        phone: formData.patientPhone,
        patientName: formData.patientName,
        patientPhone: formData.patientPhone,
        notes: formData.notes,
        paymentMethod: formData.paymentMethod,
      });
      setAppointmentId(newAppointment.id);
      setBookingSuccess(true);
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.");
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
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated background */}
        <Box
          component="img"
          src={Paw1}
          alt="paw"
          sx={{
            position: "absolute",
            top: "20%",
            right: "20%",
            width: 80,
            height: 80,
            opacity: 0.1,
            animation: "float 3s ease-in-out infinite",
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(-20px)" },
            },
          }}
        />
        <Box
          component="img"
          src={Paw1}
          alt="paw"
          sx={{
            position: "absolute",
            bottom: "20%",
            left: "20%",
            width: 60,
            height: 60,
            opacity: 0.1,
            animation: "float 3s ease-in-out infinite reverse",
          }}
        />

        <Fade in timeout={600}>
          <Paper
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 4,
              boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <CircularProgress size={60} sx={{ color: "white", mb: 3 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Đang tải thông tin bác sĩ...
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Vui lòng chờ trong giây lát
            </Typography>
          </Paper>
        </Fade>
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
          position: "relative",
        }}
      >
        <Fade in timeout={600}>
          <Paper
            sx={{
              p: 6,
              maxWidth: 500,
              textAlign: "center",
              borderRadius: 4,
              boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                bgcolor: "#EF4444",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <LocalHospital sx={{ fontSize: 40, color: "white" }} />
            </Box>
            <Typography
              variant="h5"
              fontWeight="bold"
              color="error"
              gutterBottom
            >
              Có lỗi xảy ra
            </Typography>
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{ mt: 3 }}
            >
              Thử lại
            </Button>
          </Paper>
        </Fade>
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
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated background elements */}
        <Box
          component="img"
          src={Paw1}
          alt="paw"
          sx={{
            position: "absolute",
            top: "10%",
            right: "10%",
            width: 60,
            height: 60,
            opacity: 0.1,
            animation: "float 4s ease-in-out infinite",
          }}
        />
        <Box
          component="img"
          src={Paw1}
          alt="paw"
          sx={{
            position: "absolute",
            bottom: "10%",
            left: "10%",
            width: 40,
            height: 40,
            opacity: 0.1,
            animation: "float 4s ease-in-out infinite reverse",
          }}
        />

        <Zoom in timeout={800}>
          <Paper
            sx={{
              p: 6,
              maxWidth: 600,
              textAlign: "center",
              borderRadius: 4,
              boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
              background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
            }}
          >
            {/* Success Icon with animation */}
            <Box
              sx={{
                width: 100,
                height: 100,
                background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 4,
                animation: "pulse 2s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%, 100%": { transform: "scale(1)" },
                  "50%": { transform: "scale(1.05)" },
                },
              }}
            >
              <CheckCircle sx={{ fontSize: 50, color: "white" }} />
            </Box>

            {/* Success Message */}
            <Typography
              variant="h4"
              fontWeight="bold"
              color="#1E40AF"
              gutterBottom
            >
              🎉 Đặt lịch thành công!
            </Typography>

            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi
            </Typography>

            {/* Appointment Details */}
            <Slide in timeout={1000} direction="up">
              <Card
                sx={{
                  p: 4,
                  mb: 4,
                  background:
                    "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                  border: "2px solid #cbd5e1",
                  borderRadius: 3,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Verified sx={{ color: "#22C55E", mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold" color="#1E40AF">
                    Thông tin lịch hẹn
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Person sx={{ color: "#3B82F6", fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Bác sĩ
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {doctor?.name}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <LocalHospital sx={{ color: "#8B5CF6", fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Chuyên khoa
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {doctor?.specialization}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <CalendarToday sx={{ color: "#F59E0B", fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Ngày & Giờ
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {formData.date} - {formData.time}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Schedule sx={{ color: "#10B981", fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Loại khám
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {formData.appointmentType}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Payment sx={{ color: "#EF4444", fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Thanh toán
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {formData.paymentMethod === "cash"
                          ? "Tại chỗ"
                          : formData.paymentMethod}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "#3B82F6",
                      borderRadius: 2,
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Mã lịch hẹn
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      #{appointmentId}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Slide>

            {/* Action Buttons */}
            <Slide in timeout={1200} direction="up">
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/scheduling/history")}
                  startIcon={<Schedule />}
                  sx={{
                    background:
                      "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
                    px: 4,
                    py: 2,
                    borderRadius: 3,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 35px rgba(59, 130, 246, 0.4)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Xem lịch sử đặt lịch
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/scheduling")}
                  startIcon={<CalendarToday />}
                  sx={{
                    borderColor: "#3B82F6",
                    color: "#3B82F6",
                    px: 4,
                    py: 2,
                    borderRadius: 3,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    borderWidth: 2,
                    "&:hover": {
                      borderColor: "#2563EB",
                      bgcolor: "#F0F9FF",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(59, 130, 246, 0.2)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Đặt lịch mới
                </Button>
              </Box>
            </Slide>

            {/* Additional Info */}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
              Chúng tôi sẽ gửi thông báo nhắc nhở trước ngày khám 1 ngày
            </Typography>
          </Paper>
        </Zoom>
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

  return (
    <Box
      sx={{
        bgcolor: "#F0F9FF",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated decorative elements */}
      <Box
        component="img"
        src={Paw1}
        alt="paw"
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          width: 50,
          height: 50,
          opacity: 0.1,
          animation: "float 6s ease-in-out infinite",
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
          width: 35,
          height: 35,
          opacity: 0.1,
          animation: "float 6s ease-in-out infinite reverse",
        }}
      />
      <Box
        component="img"
        src={Paw1}
        alt="paw"
        sx={{
          position: "absolute",
          top: "50%",
          right: "10%",
          width: 25,
          height: 25,
          opacity: 0.05,
          animation: "float 8s ease-in-out infinite",
        }}
      />

      {/* Header */}
      <Container maxWidth="xl">
        <Fade in timeout={600}>
          <Box sx={{ p: 4, pb: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
              <Tooltip title="Quay lại">
                <IconButton
                  onClick={handleBack}
                  sx={{
                    bgcolor: "white",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    "&:hover": {
                      bgcolor: "#f8fafc",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <ArrowBack />
                </IconButton>
              </Tooltip>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="#1E40AF">
                  🐾 Đặt lịch khám
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Chọn thời gian phù hợp cho thú cưng của bạn
                </Typography>
              </Box>
            </Box>

            {/* Doctor Info Card */}
            <Zoom in timeout={800}>
              <Paper
                sx={{
                  p: 4,
                  mb: 4,
                  borderRadius: 4,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
                    pointerEvents: "none",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <Avatar
                    src={doctor.profileImage}
                    alt={doctor.name}
                    sx={{
                      width: 100,
                      height: 100,
                      border: "4px solid rgba(255,255,255,0.3)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 1,
                      }}
                    >
                      <Typography variant="h4" fontWeight="bold">
                        {doctor.name}
                      </Typography>
                      <Badge
                        badgeContent={<Star sx={{ fontSize: 12 }} />}
                        color="warning"
                        sx={{ "& .MuiBadge-badge": { bgcolor: "#F59E0B" } }}
                      >
                        <Box />
                      </Badge>
                    </Box>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                      {doctor.specialization}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.8, mb: 2 }}>
                      {doctor.experience}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <LocationOn sx={{ fontSize: 16 }} />
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          {doctor.city}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Phone sx={{ fontSize: 16 }} />
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          {doctor.phone}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Zoom>
          </Box>
        </Fade>

        <Box sx={{ maxWidth: 1200, mx: "auto", p: 4, pt: 0 }}>
          <Grid container spacing={4}>
            {/* Left side - Form */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Fade in timeout={1000}>
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 4,
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: "#3B82F6",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Person sx={{ color: "white", fontSize: 20 }} />
                    </Box>
                    <Typography variant="h5" fontWeight="bold" color="#1E40AF">
                      Thông tin đặt lịch
                    </Typography>
                  </Box>

                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      {/* Patient Name */}
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Họ và tên"
                          value={formData.patientName}
                          onChange={(e) =>
                            handleInputChange("patientName", e.target.value)
                          }
                          required
                          InputProps={{
                            startAdornment: (
                              <Person sx={{ mr: 1, color: "text.secondary" }} />
                            ),
                          }}
                        />
                      </Grid>

                      {/* Patient Phone */}
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Số điện thoại"
                          value={formData.patientPhone}
                          onChange={(e) =>
                            handleInputChange("patientPhone", e.target.value)
                          }
                          required
                          InputProps={{
                            startAdornment: (
                              <Phone sx={{ mr: 1, color: "text.secondary" }} />
                            ),
                          }}
                        />
                      </Grid>

                      {/* Appointment Type */}
                      <Grid size={{ xs: 12 }}>
                        <FormControl fullWidth required>
                          <InputLabel>Loại khám</InputLabel>
                          <Select
                            value={formData.appointmentType}
                            onChange={(e) =>
                              handleInputChange(
                                "appointmentType",
                                e.target.value
                              )
                            }
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

                      {/* Pet Selection */}
                      <Grid size={{ xs: 12 }}>
                        <FormControl fullWidth required>
                          <InputLabel>Chọn thú cưng</InputLabel>
                          <Select
                            value={formData.petId}
                            onChange={(e) =>
                              handleInputChange("petId", e.target.value)
                            }
                            label="Chọn thú cưng"
                            disabled={petsLoading || pets.length === 0}
                          >
                            {pets.length === 0 ? (
                              <MenuItem disabled>
                                <Box sx={{ textAlign: "center", py: 2 }}>
                                  <Typography color="text.secondary">
                                    Bạn chưa có thú cưng nào
                                  </Typography>
                                  <Button
                                    size="small"
                                    onClick={() => navigate("/pet-profile")}
                                    sx={{ mt: 1 }}
                                  >
                                    Thêm thú cưng
                                  </Button>
                                </Box>
                              </MenuItem>
                            ) : (
                              pets.map((pet) => (
                                <MenuItem key={pet.id} value={pet.id}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 2,
                                    }}
                                  >
                                    <Avatar
                                      src={pet.profileImage}
                                      sx={{ width: 40, height: 40 }}
                                    >
                                      <PetsIcon />
                                    </Avatar>
                                    <Box>
                                      <Typography
                                        variant="body1"
                                        fontWeight="bold"
                                      >
                                        {pet.name}
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        {pet.species} - {pet.breed} - {pet.age}{" "}
                                        tuổi
                                      </Typography>
                                    </Box>
                                  </Box>
                                </MenuItem>
                              ))
                            )}
                          </Select>
                        </FormControl>
                        {pets.length === 0 && (
                          <Box sx={{ mt: 1, textAlign: "center" }}>
                            <Button
                              variant="outlined"
                              onClick={() => navigate("/pet-profile")}
                              startIcon={<PetsIcon />}
                            >
                              Tạo hồ sơ thú cưng
                            </Button>
                          </Box>
                        )}
                      </Grid>

                      {/* Notes */}
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Ghi chú (tùy chọn)"
                          multiline
                          rows={3}
                          value={formData.notes}
                          onChange={(e) =>
                            handleInputChange("notes", e.target.value)
                          }
                          InputProps={{
                            startAdornment: (
                              <Notes
                                sx={{ mr: 1, color: "text.secondary", mt: 1 }}
                              />
                            ),
                          }}
                        />
                      </Grid>

                      {/* Payment Method */}
                      <Grid size={{ xs: 12 }}>
                        <FormControl component="fieldset" fullWidth>
                          <FormLabel
                            component="legend"
                            sx={{
                              mb: 2,
                              fontWeight: "bold",
                              color: "text.primary",
                            }}
                          >
                            Phương thức thanh toán
                          </FormLabel>
                          <RadioGroup
                            value={formData.paymentMethod}
                            onChange={(e) =>
                              handleInputChange("paymentMethod", e.target.value)
                            }
                            sx={{ gap: 1 }}
                          >
                            <Card
                              sx={{
                                p: 2,
                                border:
                                  formData.paymentMethod === "cash"
                                    ? "2px solid #3B82F6"
                                    : "1px solid #E5E7EB",
                              }}
                            >
                              <FormControlLabel
                                value="cash"
                                control={<Radio />}
                                label={
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <Payment sx={{ color: "#22C55E" }} />
                                    <Typography>Thanh toán tại quầy</Typography>
                                  </Box>
                                }
                                sx={{ width: "100%", m: 0 }}
                              />
                            </Card>

                            <Card
                              sx={{
                                p: 2,
                                border:
                                  formData.paymentMethod === "bank"
                                    ? "2px solid #3B82F6"
                                    : "1px solid #E5E7EB",
                                opacity: 0.6,
                              }}
                            >
                              <FormControlLabel
                                value="bank"
                                control={<Radio disabled />}
                                label={
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <AccountBalance sx={{ color: "#6B7280" }} />
                                    <Typography color="text.secondary">
                                      Đặt cọc trước (Sắp có)
                                    </Typography>
                                  </Box>
                                }
                                sx={{ width: "100%", m: 0 }}
                              />
                            </Card>
                          </RadioGroup>
                        </FormControl>
                      </Grid>

                      {/* Submit Button */}
                      <Grid size={{ xs: 12 }}>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          size="large"
                          disabled={!isFormValid() || isSubmitting}
                          sx={{
                            py: 2,
                            fontSize: "1.1rem",
                            fontWeight: "bold",
                            borderRadius: 3,
                            background:
                              "linear-gradient(45deg, #22C55E 0%, #16A34A 100%)",
                            "&:hover": {
                              background:
                                "linear-gradient(45deg, #16A34A 0%, #15803D 100%)",
                            },
                          }}
                        >
                          {isSubmitting ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            "Đặt lịch ngay"
                          )}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              </Fade>
            </Grid>

            {/* Right side - Date and Time Selection */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Slide in timeout={1200} direction="left">
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                    background:
                      "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                    border: "1px solid #bae6fd",
                    height: "fit-content",
                    position: "sticky",
                    top: 20,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 4,
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: "#0EA5E9",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CalendarToday sx={{ color: "white", fontSize: 20 }} />
                    </Box>
                    <Typography variant="h5" fontWeight="bold" color="#0C4A6E">
                      Chọn ngày và giờ
                    </Typography>
                  </Box>

                  {/* Date Selection */}
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="600"
                      gutterBottom
                      sx={{ color: "#0C4A6E", mb: 2 }}
                    >
                      <CalendarToday
                        sx={{
                          mr: 1,
                          verticalAlign: "middle",
                          color: "#0EA5E9",
                        }}
                      />
                      Chọn ngày
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1.5,
                        mt: 2,
                      }}
                    >
                      {Array.from({ length: 7 }, (_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() + i);
                        const dateStr = date.toISOString().split("T")[0];
                        const isAvailable = availableSlots.some(
                          (slot) => slot.date === dateStr
                        );
                        const isSelected = selectedDate === dateStr;

                        return (
                          <Chip
                            key={dateStr}
                            label={date.toLocaleDateString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                            })}
                            onClick={() =>
                              isAvailable && handleDateSelect(dateStr)
                            }
                            color={isSelected ? "primary" : "default"}
                            variant={isSelected ? "filled" : "outlined"}
                            disabled={!isAvailable}
                            sx={{
                              cursor: isAvailable ? "pointer" : "not-allowed",
                              opacity: isAvailable ? 1 : 0.5,
                              fontWeight: isSelected ? "bold" : "normal",
                              fontSize: "0.9rem",
                              py: 2,
                              px: 1,
                              "&:hover": isAvailable
                                ? {
                                  transform: "translateY(-2px)",
                                  boxShadow:
                                      "0 4px 12px rgba(14, 165, 233, 0.3)",
                                }
                                : {},
                              transition: "all 0.3s ease",
                            }}
                          />
                        );
                      })}
                    </Box>
                  </Box>

                  {/* Time Selection */}
                  {selectedDate && (
                    <Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight="600"
                        gutterBottom
                        sx={{ color: "#0C4A6E", mb: 2 }}
                      >
                        <AccessTime
                          sx={{
                            mr: 1,
                            verticalAlign: "middle",
                            color: "#0EA5E9",
                          }}
                        />
                        Chọn giờ
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1.5,
                          mt: 2,
                        }}
                      >
                        {getAvailableTimesForDate(selectedDate).map((time) => (
                          <Chip
                            key={time}
                            label={time}
                            onClick={() => handleTimeSelect(time)}
                            color={
                              formData.time === time ? "primary" : "default"
                            }
                            variant={
                              formData.time === time ? "filled" : "outlined"
                            }
                            sx={{
                              cursor: "pointer",
                              fontWeight:
                                formData.time === time ? "bold" : "normal",
                              fontSize: "0.9rem",
                              py: 2,
                              px: 1,
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 12px rgba(14, 165, 233, 0.3)",
                              },
                              transition: "all 0.3s ease",
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Paper>
              </Slide>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
