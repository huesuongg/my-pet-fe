import { 
  Box, 
  Typography, 
  Button, 
  Avatar, 
  Grid, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  IconButton,
  Paper,
  CircularProgress,
  Alert
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import PhoneIcon from "@mui/icons-material/Phone";
import { useParams, useNavigate } from "react-router-dom";
import { useScheduling } from "../hook/useScheduling";
import { useEffect, useState } from "react";
import { Doctor } from "../types";
import Paw1 from "../../../assets/paw1.svg";

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDoctorById, doctorLoading, error } = useScheduling();
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    const loadDoctor = async () => {
      if (id) {
        console.log('Loading doctor with ID:', id);
        const doctorData = await getDoctorById(id);
        console.log('Doctor data loaded:', doctorData);
        setDoctor(doctorData);
      }
    };
    loadDoctor();
  }, [id]);

  const handleSchedule = () => {
    console.log("Schedule appointment with", doctor?.name);
    navigate(`/scheduling/booking/${id}`);
  };

  const handleClose = () => {
    navigate("/scheduling");
  };

  if (doctorLoading) {
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

  if (!doctorLoading && !doctor) {
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
          Doctor not found
        </Alert>
      </Box>
    );
  }

  if (!doctor) {
    return null;
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
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          width: 40,
          height: 40,
          bgcolor: "#EAB308",
          borderRadius: "50%",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 60,
          right: 60,
          width: 20,
          height: 20,
          bgcolor: "#3B82F6",
          borderRadius: "50%",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 100,
          right: 40,
          width: 15,
          height: 15,
          bgcolor: "#22C55E",
          borderRadius: "50%",
        }}
      />

      {/* Close button */}
      <IconButton
        onClick={handleClose}
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 10,
          bgcolor: "rgba(255,255,255,0.8)",
          "&:hover": {
            bgcolor: "rgba(255,255,255,0.9)",
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      <Box sx={{ maxWidth: 1200, mx: "auto", p: 4 }}>
        {/* Hero Section - Modern Design */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #60A5FA 0%, #3B82F6 50%, #1E40AF 100%)",
            borderRadius: 4,
            p: 6,
            mb: 6,
            position: "relative",
            overflow: "hidden",
            minHeight: 400,
            boxShadow: "0 20px 60px rgba(59, 130, 246, 0.3)",
          }}
        >
          {/* Top accent strip */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              background: "linear-gradient(90deg, #FBBF24 0%, #F59E0B 50%, #D97706 100%)",
            }}
          />

          {/* Floating decorative elements */}
          <Box
            component="img"
            src={Paw1}
            alt="paw"
            sx={{
              position: "absolute",
              top: 30,
              left: 30,
              width: 60,
              height: 60,
              opacity: 0.15,
              animation: "float 6s ease-in-out infinite",
            }}
          />
          <Box
            component="img"
            src={Paw1}
            alt="paw"
            sx={{
              position: "absolute",
              top: 50,
              right: 50,
              width: 80,
              height: 80,
              opacity: 0.12,
              animation: "float 8s ease-in-out infinite reverse",
            }}
          />
          <Box
            component="img"
            src={Paw1}
            alt="paw"
            sx={{
              position: "absolute",
              bottom: 40,
              left: 40,
              width: 45,
              height: 45,
              opacity: 0.18,
              animation: "float 7s ease-in-out infinite",
            }}
          />
          <Box
            component="img"
            src={Paw1}
            alt="paw"
            sx={{
              position: "absolute",
              bottom: 60,
              right: 80,
              width: 55,
              height: 55,
              opacity: 0.1,
              animation: "float 9s ease-in-out infinite reverse",
            }}
          />

          {/* Animated circles */}
          <Box
            sx={{
              position: "absolute",
              top: 80,
              left: "20%",
              width: 30,
              height: 30,
              bgcolor: "#FBBF24",
              borderRadius: "50%",
              opacity: 0.8,
              animation: "pulse 3s ease-in-out infinite",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 100,
              left: "15%",
              width: 20,
              height: 20,
              bgcolor: "white",
              borderRadius: "50%",
              opacity: 0.9,
              animation: "pulse 4s ease-in-out infinite",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 80,
              left: "25%",
              width: 35,
              height: 35,
              bgcolor: "#F87171",
              borderRadius: "50%",
              opacity: 0.7,
              animation: "pulse 5s ease-in-out infinite",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 120,
              right: "20%",
              width: 25,
              height: 25,
              bgcolor: "#3B82F6",
              borderRadius: "50%",
              opacity: 0.8,
              animation: "pulse 3.5s ease-in-out infinite",
            }}
          />

          {/* Decorative wave pattern */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 200,
              height: 100,
              background: "linear-gradient(45deg, rgba(251, 191, 36, 0.1) 0%, rgba(251, 191, 36, 0.05) 100%)",
              clipPath: "polygon(0 100%, 100% 0, 100% 100%)",
            }}
          />

          <Grid container spacing={6} alignItems="center" sx={{ position: "relative", zIndex: 2 }}>
            {/* Left side - Doctor profile */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                {/* Doctor Avatar with enhanced styling */}
                <Box sx={{ position: "relative" }}>
                  <Box
                    sx={{
                      position: "absolute",
                      top: -10,
                      left: -10,
                      right: -10,
                      bottom: -10,
                      background: "linear-gradient(45deg, #FBBF24, #F59E0B, #D97706)",
                      borderRadius: "50%",
                      opacity: 0.3,
                      animation: "rotate 10s linear infinite",
                    }}
                  />
                  <Avatar
                    src={doctor.profileImage}
                    alt={doctor.name}
                    sx={{
                      width: 200,
                      height: 200,
                      border: "8px solid white",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.2), 0 0 0 4px rgba(251, 191, 36, 0.3)",
                      position: "relative",
                      zIndex: 2,
                    }}
                  />
                  {/* Experience badge */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 10,
                      right: 10,
                      bgcolor: "#FBBF24",
                      color: "white",
                      px: 2,
                      py: 1,
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      boxShadow: "0 4px 15px rgba(251, 191, 36, 0.4)",
                    }}
                  >
                    {doctor.experience}
                  </Box>
                </Box>
                
                {/* Doctor Info */}
                <Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: "800", 
                      color: "white",
                      mb: 2,
                      fontFamily: "'Inter', sans-serif",
                      //   boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                      background: "linear-gradient(45deg, #ffffff, #f0f9ff)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {doctor.name}
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: "white",
                      opacity: 0.95,
                      fontFamily: "'Inter', sans-serif",
                      textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      fontWeight: "500",
                    }}
                  >
                    {doctor.specialization}
                  </Typography>
                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        bgcolor: "rgba(255,255,255,0.2)",
                        px: 2,
                        py: 1,
                        borderRadius: "20px",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: "#22C55E",
                          borderRadius: "50%",
                        }}
                      />
                      <Typography variant="body2" sx={{ color: "white", fontWeight: "500" }}>
                        Đang hoạt động
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Right side - Schedule button */}
            <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: { xs: "center", md: "center" } }}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: "white", 
                    fontWeight: "600",
                    textAlign: "center",
                    mb: 2,
                    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  Đặt lịch khám ngay
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleSchedule}
                  sx={{
                    background: "linear-gradient(45deg, #22C55E 0%, #16A34A 100%)",
                    color: "white",
                    fontWeight: "bold",
                    px: 8,
                    py: 3,
                    borderRadius: "50px",
                    fontSize: "1.4rem",
                    textTransform: "none",
                    fontFamily: "'Inter', sans-serif",
                    boxShadow: "0 10px 30px rgba(34, 197, 94, 0.4), 0 0 0 1px rgba(255,255,255,0.1)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      transform: "translateY(-6px) scale(1.05)",
                      boxShadow: "0 20px 40px rgba(34, 197, 94, 0.5), 0 0 0 1px rgba(255,255,255,0.2)",
                      background: "linear-gradient(45deg, #16A34A 0%, #15803D 100%)",
                    },
                    "&:active": {
                      transform: "translateY(-2px) scale(1.02)",
                      boxShadow: "0 8px 25px rgba(34, 197, 94, 0.4)",
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                      transition: "left 0.5s",
                    },
                    "&:hover::before": {
                      left: "100%",
                    },
                  }}
                >
                  Đặt lịch ngay
                </Button>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: "white", 
                    opacity: 0.8,
                    textAlign: "center",
                    maxWidth: 300,
                  }}
                >
                  Đặt lịch khám với bác sĩ chuyên nghiệp, tận tâm và giàu kinh nghiệm
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* CSS Animations */}
          {/* <style jsx>{`
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-20px) rotate(5deg); }
            }
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 0.8; }
              50% { transform: scale(1.1); opacity: 1; }
            }
            @keyframes rotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style> */}
        </Box>
        {/* Experience and Skills Section */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {doctor.experience}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Trình độ chuyên môn:
              </Typography>
              <List dense>
                {doctor.qualifications.map((qualification, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 20 }}>
                      <StarIcon sx={{ fontSize: 16, color: "#EAB308" }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={qualification}
                      primaryTypographyProps={{ fontSize: "0.9rem" }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Kỹ năng chuyên gia
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                {doctor.skills.map((skill, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      bgcolor: "#f5f5f5",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      flex: "1 1 calc(50% - 8px)",
                      minWidth: "120px",
                    }}
                  >
                    <StarIcon sx={{ fontSize: 16, color: "#3B82F6", mr: 1 }} />
                    <Typography variant="body2">{skill}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Biography Section */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Thông tin bác sĩ
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, textAlign: "justify" }}>
            {doctor.biography}
          </Typography>
        </Paper>

        {/* Contact and Location Section */}
        <Paper
          sx={{
            bgcolor: "#1E40AF",
            color: "white",
            p: 4,
            borderRadius: 3,
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                03 Hoàng Văn Thụ
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Đến ngay nào!
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {doctor.address}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <PhoneIcon sx={{ mr: 1 }} />
                <Typography variant="body1">{doctor.phone}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  width: "100%",
                  height: 300,
                  bgcolor: "rgba(255,255,255,0.1)",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid rgba(255,255,255,0.2)",
                }}
              >
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  [Google Maps Embed]
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
}
