import React from "react";
import { Card, CardMedia, CardContent, Typography, IconButton } from "@mui/material";
import { AddShoppingCart } from "@mui/icons-material";

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
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(id);
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        position: "relative",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
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
        <IconButton
          onClick={handleAddToCart}
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            bgcolor: "#2F80ED",
            color: "white",
            "&:hover": {
              bgcolor: "#1976D2",
            },
          }}
        >
          <AddShoppingCart />
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default ProductCard;