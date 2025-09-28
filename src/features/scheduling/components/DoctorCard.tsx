import { 
  Card, 
  CardContent, 
  Avatar, 
  Typography, 
  Box, 
  IconButton, 
  Chip,
  Stack,
  Divider,
  Badge
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import StarIcon from "@mui/icons-material/Star";
import { DoctorCardProps } from "../types";

export default function DoctorCard({ doctor, onSchedule }: DoctorCardProps) {
  const getStatusColor = (isActive: boolean) => {
    return isActive ? '#FFCA0D' : '#6B7280'; // Green-500 for active, Gray-500 for inactive
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Đang hoạt động' : 'Không hoạt động';
  };

  return (
    <Card
      onClick={onSchedule}
      sx={{
        borderRadius: 4,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        background: "#ffffff",
          "&:hover": {
            transform: "translateY(-8px) scale(1.02)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
            "& .doctor-avatar": {
              transform: "scale(1.1)",
            },
            "& .doctor-info-section": {
              background: "#20BD20",
            }
          },
      }}
    >
      {/* Decorative gradient overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "#3B82F6",
        }}
      />

      {/* Header with menu and status badge */}
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "flex-start",
        p: 2,
        pb: 1
      }}>
        <Chip
          label={getStatusText(doctor.isActive)}
          size="small"
          sx={{
            bgcolor: getStatusColor(doctor.isActive),
            color: "white",
            fontWeight: "bold",
            fontSize: "0.75rem",
            height: 24,
            "& .MuiChip-label": {
              px: 1.5,
            },
          }}
        />
        <IconButton 
          size="small" 
          sx={{ 
            color: "text.secondary",
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.04)",
            }
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Doctor Profile */}
      <CardContent sx={{ 
        flexGrow: 1, 
        textAlign: "center", 
        pt: 0,
        pb: 2,
        px: 3
      }}>
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  bgcolor: "#EAB308",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <StarIcon sx={{ fontSize: 10, color: "white" }} />
              </Box>
            }
          >
            <Avatar
              src={doctor.profileImage}
              alt={doctor.name}
              className="doctor-avatar"
              sx={{
                width: 90,
                height: 90,
                mx: "auto",
                mb: 2,
                border: "4px solid #f0f0f0",
                transition: "transform 0.3s ease",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            />
          </Badge>
        </Box>

        <Typography 
          variant="h6" 
          fontWeight="bold" 
          gutterBottom
          sx={{ 
            color: "#1f2937",
            fontSize: "1.1rem",
            lineHeight: 1.3,
            mb: 1
          }}
        >
          {doctor.name}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            fontSize: "0.85rem",
            fontWeight: 500,
            color: "#6b7280"
          }}
        >
          {doctor.specialization}
        </Typography>

        {/* Experience indicator */}
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          mb: 2,
          py: 1,
          px: 2,
          bgcolor: "#FFFCD1",
          borderRadius: 2,
          border: "1px solid #FDE047",
        }}>
          <StarIcon sx={{ fontSize: 16, color: "#FFCA0D", mr: 0.5 }} />
          <Typography variant="caption" sx={{ 
            color: "#F2BA05", 
            fontWeight: "bold",
            fontSize: "0.75rem"
          }}>
            {doctor.experience}
          </Typography>
        </Box>
      </CardContent>

      <Divider sx={{ mx: 2, opacity: 0.3 }} />

      {/* Doctor Contact Information */}
      <Box
        className="doctor-info-section"
        sx={{
          background: "#1395DA",
          color: "white",
          p: 2.5,
          transition: "all 0.3s ease",
        }}
      >
        <Stack spacing={2}>
          {/* Phone and Address Row */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
              <PhoneIcon sx={{ fontSize: 18, mr: 1, opacity: 0.9 }} />
              <Box>
                <Typography variant="caption" sx={{ display: "block", opacity: 0.8, fontSize: "0.7rem" }}>
                  Số điện thoại
                </Typography>
                <Typography variant="body2" fontWeight="bold" sx={{ fontSize: "0.85rem" }}>
                  {doctor.phone}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: "flex", alignItems: "center", flex: 1, justifyContent: "center" }}>
              <CalendarTodayIcon sx={{ fontSize: 18, mr: 1, opacity: 0.9 }} />
              <Box>
                <Typography variant="caption" sx={{ display: "block", opacity: 0.8, fontSize: "0.7rem" }}>
                  Địa chỉ
                </Typography>
                <Typography variant="body2" fontWeight="bold" sx={{ fontSize: "0.85rem" }}>
                  {doctor.city}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Specialization Row */}
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            py: 1,
            px: 2,
            bgcolor: "rgba(255,255,255,0.1)",
            borderRadius: 2,
            backdropFilter: "blur(10px)",
          }}>
            <MedicalServicesIcon sx={{ fontSize: 16, mr: 1, opacity: 0.9 }} />
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.85rem" }}>
              {doctor.specialization}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Card>
  );
}
