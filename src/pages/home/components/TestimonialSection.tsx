import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Paw1 from "../../../assets/paw1.svg";

const testimonials = [
  {
    id: 1,
    name: "Văn Toàn",
    role: "(Bố mẹ Puppy)",
    content:
      "Nhóm tại My Pet đã chăm sóc tuyệt vời cho chó của chúng tôi trong khi chúng tôi đang ở nơi khác. Chúng tôi cảm thấy rất thoải mái khi biết rằng anh ấy đang ở trong tay của những người tốt",
    avatar: "https://a-z-animals.com/media/2022/06/Alaskan-Malamute.jpg",
    bgColor: "#1565C0",
  },
  {
    id: 2,
    name: "Linh Meo",
    role: "(Người yêu mèo)",
    content:
      "Mèo của chúng tôi trở về sau khi được chăm sóc rất đẹp! Không thể diễn tả đủ lời cảm ơn đối với nhóm tại My Pet",
    avatar:
      "https://th.bing.com/th/id/R.23e7d4f38fe7e2e41099c25948d6b5fc?rik=8yxk0rvsDq6TZA&pid=ImgRaw&r=0",
    bgColor: "#1976D2",
  },
];

export default function TestimonialSection() {
  return (
    <Box sx={{ py: 8, bgcolor: "white" }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 6,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "black",
              fontSize: { xs: "1.8rem", md: "2.2rem" },
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
            <Grid size={{ xs: 12, md: 6 }} key={testimonial.id}>
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
                  <Typography
                    variant="body1"
                    sx={{ fontStyle: "italic", lineHeight: 1.6 }}
                  >
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
              Đừng chần chừ nữa! Thú cưng của bạn xứng đáng nhận được những điều
              tốt nhất — và chúng tôi luôn sẵn sàng mang điều đó đến cho bạn. Dù
              bạn đang tìm dịch vụ chăm sóc, thú y, hay một nơi an toàn để thú
              cưng nghỉ ngơi, chúng tôi đều sẵn lòng đồng hành và hỗ trợ.
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
