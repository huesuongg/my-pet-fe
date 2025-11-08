import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  Stack,
  Divider,
  Button
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Clinic } from "../types";

interface ClinicCardProps {
  clinic: Clinic;
  onViewDetail?: () => void;
}

const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

export default function ClinicCard({ clinic, onViewDetail }: ClinicCardProps) {
  const formatWorkingHours = () => {
    if (!clinic.workingHours || clinic.workingHours.length === 0) {
      return 'Chưa có thông tin';
    }

    const has24h = clinic.workingHours.some(wh => wh.is24Hours);
    const hasEmergency24h = clinic.workingHours.some(wh => wh.emergency24h);

    if (has24h) {
      return '24/24 giờ';
    }

    const firstSchedule = clinic.workingHours[0];
    if (firstSchedule.daysOfWeek.length === 7) {
      const daysStr = 'Tất cả các ngày';
      const timeStr = `${firstSchedule.startTime} - ${firstSchedule.endTime}`;
      return `${daysStr}: ${timeStr}`;
    }

    const days = firstSchedule.daysOfWeek
      .map(day => dayNames[day])
      .join(', ');
    return `${days}: ${firstSchedule.startTime} - ${firstSchedule.endTime}`;
  };

  return (
    <Card
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
          "& .clinic-image": {
            transform: "scale(1.1)",
          },
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
          background: "linear-gradient(90deg, #3B82F6 0%, #1395DA 100%)",
        }}
      />

      {/* Clinic Image */}
      <Box
        sx={{
          width: "100%",
          height: 200,
          overflow: "hidden",
          position: "relative",
          bgcolor: "#f0f0f0",
        }}
      >
        <Box
          component="img"
          className="clinic-image"
          src={clinic.imgUrl || 'https://product.hstatic.net/200000731893/product/nam07651-scaled_01a414b13bde4702a49abb8c626450b5.png'}
          alt={clinic.name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.3s ease",
          }}
          onError={(e) => {
            e.currentTarget.src = 'https://product.hstatic.net/200000731893/product/nam07651-scaled_01a414b13bde4702a49abb8c626450b5.png';
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography 
          variant="h5" 
          fontWeight="bold" 
          gutterBottom
          sx={{ 
            color: "#1f2937",
            fontSize: "1.3rem",
            mb: 2,
            minHeight: 64,
          }}
        >
          {clinic.name}
        </Typography>

        <Stack spacing={2}>
          {/* Address */}
          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <LocationOnIcon sx={{ fontSize: 20, color: "#1395DA", mr: 1, mt: 0.5 }} />
            <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
              {clinic.address || 'Chưa có địa chỉ'}
            </Typography>
          </Box>

          {/* Phone */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PhoneIcon sx={{ fontSize: 20, color: "#1395DA", mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {clinic.phone || 'Chưa có số điện thoại'}
            </Typography>
          </Box>

          {/* Working Hours */}
          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <AccessTimeIcon sx={{ fontSize: 20, color: "#1395DA", mr: 1, mt: 0.5 }} />
            <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
              {formatWorkingHours()}
            </Typography>
          </Box>

          {/* Emergency 24h Badge */}
          {clinic.workingHours?.some(wh => wh.emergency24h) && (
            <Chip
              label="Trực cấp cứu 24/24h 🆘"
              size="small"
              sx={{
                bgcolor: "#EF4444",
                color: "white",
                fontWeight: "bold",
                fontSize: "0.75rem",
                alignSelf: "flex-start",
              }}
            />
          )}
        </Stack>
      </CardContent>

      <Divider sx={{ mx: 3, opacity: 0.3 }} />

      {/* Footer with View Detail Button */}
      <Box
        sx={{
          background: "#1395DA",
          color: "white",
          p: 2.5,
          transition: "all 0.3s ease",
          "&:hover": {
            background: "#20BD20",
          },
        }}
      >
        <Button
          fullWidth
          endIcon={<ArrowForwardIcon />}
          onClick={onViewDetail}
          sx={{
            color: "white",
            fontWeight: "bold",
            textTransform: "none",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          Xem chi tiết
        </Button>
      </Box>
    </Card>
  );
}

