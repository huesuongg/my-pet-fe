import React from "react";
import { Card, CardMedia, CardContent, Typography, IconButton, Box } from "@mui/material";
import { AddShoppingCart, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  image: string;
  onAddToCart?: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  onAddToCart,
}) => {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(id);
    }
  };

  const handleViewDetail = () => {
    navigate(`/product/${id}`);
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        position: "relative",
        transition: "transform 0.2s",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
      onClick={handleViewDetail}
    >
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt={name}
        sx={{ borderRadius: "12px 12px 0 0" }}
      />
      <CardContent>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          {name}
        </Typography>
        <Typography variant="h6" color="primary" fontWeight="bold">
          {price}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetail();
            }}
            sx={{
              bgcolor: "#2F80ED",
              color: "white",
              "&:hover": {
                bgcolor: "#1976D2",
              },
            }}
          >
            <Visibility />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            sx={{
              bgcolor: "#4CAF50",
              color: "white",
              "&:hover": {
                bgcolor: "#45a049",
              },
            }}
          >
            <AddShoppingCart />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;