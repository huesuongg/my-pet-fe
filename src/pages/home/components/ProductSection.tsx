import { Box, Button, Typography, Grid, Card, CardContent, CardMedia, IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Paw1 from "../../../assets/paw1.svg";

const products = [
  {
    id: 1,
    name: "Thức Ăn Cho Chó",
    price: "50.000 VNĐ",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=200&fit=crop",
    brand: "Royal Canin"
  },
  {
    id: 2,
    name: "Thức Ăn Cho Mèo",
    price: "50.000 VNĐ",
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=200&fit=crop",
    brand: "Royal Canin Indoor"
  },
  {
    id: 3,
    name: "Bánh Thưởng Cho Chó",
    price: "60.000 VNĐ",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=200&fit=crop",
    brand: "Royal Canin Puppy Maxi"
  },
  {
    id: 4,
    name: "Bánh Thưởng Cho Mèo",
    price: "80.000 VNĐ",
    image: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=300&h=200&fit=crop",
    brand: "Kitekat"
  }
];

export default function ProductSection() {
  return (
    <Box
      sx={{
        bgcolor: "#1976D2",
        py: 8,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 4 } }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
            mb: 6,
            fontSize: { xs: "2rem", md: "2.5rem" },
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Khám Phá Sản Phẩm
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {products.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {product.brand}
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                    {product.price}
                  </Typography>
                  <IconButton
                    sx={{
                      bgcolor: "#90CAF9",
                      color: "white",
                      "&:hover": {
                        bgcolor: "#64B5F6",
                      },
                    }}
                  >
                    <ShoppingCartIcon />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: "center", mt: 6 }}>
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
            Xem thêm
          </Button>
        </Box>
      </Box>

      {/* Decorative paw print */}
      <Box
        component="img"
        src={Paw1}
        alt="paw"
        sx={{
          position: "absolute",
          right: "5%",
          bottom: "5%",
          width: 30,
          opacity: 0.6,
        }}
      />
    </Box>
  );
}
