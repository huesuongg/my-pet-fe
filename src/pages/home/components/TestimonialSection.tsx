import { Box, Button, Typography, Grid, Card, CardContent, Avatar } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Paw1 from "../../../assets/paw1.svg";

const testimonials = [
  {
    id: 1,
    name: "Sarah & Max",
    role: "(Happy Pet Parents)",
    content: "The team at Doris took amazing care of our dog while we were on vacation. We felt so at ease knowing he was in such good hands",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    bgColor: "#1565C0"
  },
  {
    id: 2,
    name: "Jessica",
    role: "(Cat Lover)",
    content: "Our cat came back from grooming looking like a million bucks! We can't recommend Doris enough",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    bgColor: "#1976D2"
  }
];

export default function TestimonialSection() {
  return (
    <Box sx={{ py: 8, bgcolor: "white" }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "black",
              fontSize: { xs: "1.8rem", md: "2.2rem" }
            }}
          >
            Khách Hàng Nói Gì Về My Pet
          </Typography>
          
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{
              bgcolor: "limegreen",
              color: "white",
              fontWeight: "bold",
              px: 3,
              py: 1,
              borderRadius: "999px",
              "&:hover": { bgcolor: "green" },
            }}
          >
            Tất cả đánh giá
          </Button>
        </Box>

        {/* Testimonial Cards */}
        <Grid container spacing={4} justifyContent="center">
          {testimonials.map((testimonial) => (
            <Grid xs={12} md={6} key={testimonial.id}>
              <Card
                sx={{
                  bgcolor: testimonial.bgColor,
                  borderRadius: 3,
                  height: "100%",
                  color: "white",
                }}
              >
                <CardContent sx={{ p: 4, textAlign: "center" }}>
                  <Avatar
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    sx={{
                      width: 80,
                      height: 80,
                      mx: "auto",
                      mb: 2,
                      border: "3px solid white",
                    }}
                  />
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                    {testimonial.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
                    {testimonial.role}
                  </Typography>
                  <Typography variant="body1" sx={{ fontStyle: "italic", lineHeight: 1.6 }}>
                    "{testimonial.content}"
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* CTA Section */}
        <Box
          sx={{
            bgcolor: "#90CAF9",
            borderRadius: 3,
            p: 6,
            mt: 8,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative paw print above */}
          <Box
            component="img"
            src={Paw1}
            alt="paw"
            sx={{
              position: "absolute",
              top: -20,
              left: "50%",
              transform: "translateX(-50%)",
              width: 40,
              opacity: 0.8,
            }}
          />

          {/* Decorative circles */}
          <Box
            sx={{
              position: "absolute",
              top: 20,
              left: 20,
              width: 15,
              height: 15,
              bgcolor: "#FFD54F",
              borderRadius: "50%",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 20,
              right: 20,
              width: 12,
              height: 12,
              bgcolor: "white",
              borderRadius: "50%",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 20,
              left: 20,
              width: 10,
              height: 10,
              bgcolor: "#FFD54F",
              borderRadius: "50%",
            }}
          />

          <Box sx={{ textAlign: "center", position: "relative", zIndex: 2 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                color: "white",
                mb: 3,
                fontSize: { xs: "1.8rem", md: "2.5rem" },
                lineHeight: 1.2,
              }}
            >
              Bạn Đã Sẵn Sàng Để Chăm Sóc Các Boss Đúng Cách ?
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                color: "white",
                mb: 4,
                maxWidth: 600,
                mx: "auto",
                fontSize: "1.1rem",
                lineHeight: 1.6,
              }}
            >
              Don't wait! Your pet deserves the best, and we're here to provide it. Whether you're looking for grooming, veterinary services, or just a safe place for your pet to stay, we're ready to help.
            </Typography>

            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: "limegreen",
                color: "white",
                fontWeight: "bold",
                px: 4,
                py: 1.5,
                borderRadius: "999px",
                "&:hover": { bgcolor: "green" },
              }}
            >
              Liên hệ bác sĩ ngay nhé
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
