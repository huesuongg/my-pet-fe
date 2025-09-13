import React from "react";
import { Card, CardMedia, CardContent, Typography, IconButton } from "@mui/material";
import { AddShoppingCart } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useCart } from "../../../contexts/CartContext";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  brand?: string;
  weight?: string;
  color?: string;
  size?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  brand = "Thương hiệu",
  weight = "400g",
  color = "Xanh",
  size = "M",
}) => {
  const { dispatch } = useCart();

  const handleAddToCart = (event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch({
      type: "ADD_ITEM",
      payload: {
        product: { id, name, price, image, brand, weight, color, size },
        quantity: 1,
      },
    });
  };

  return (
    <Link to={`/product/${id}`} style={{ textDecoration: 'none' }}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 345,
          borderRadius: 3,
          boxShadow: 3,
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
          sx={{ borderRadius: "12px 12px 0 0", objectFit: 'cover' }}
        />
        <CardContent sx={{ flex: 1, position: 'relative' }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {brand}
          </Typography>
          <Typography variant="h6" color="primary" fontWeight="bold">
            {price.toLocaleString("vi-VN")} VNĐ
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
    </Link>
  );
};

export default ProductCard;
