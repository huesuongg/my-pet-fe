import React from "react";
import { Card, CardMedia, CardContent, Typography, IconButton, Box, Chip, Rating } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: string;
  image: string;
  rating?: number;
  reviews?: number;
  onAddToCart?: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  originalPrice,
  image,
  rating = 0,
  reviews = 0,
}) => {
  const navigate = useNavigate();



  const handleViewDetail = () => {
    navigate(`/product/${id}`);
  };

  const discountPercentage = originalPrice 
    ? Math.round(((parseFloat(originalPrice.replace(/[^\d]/g, '')) - price) / parseFloat(originalPrice.replace(/[^\d]/g, '')) * 100))
    : 0;

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        position: "relative",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
        },
      }}
      onClick={handleViewDetail}
    >
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <Chip
          label={`-${discountPercentage}%`}
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            bgcolor: "#EF4444",
            color: "white",
            fontWeight: "bold",
            fontSize: "0.8rem",
            zIndex: 2,
          }}
        />
      )}

      <CardMedia
        component="img"
        height="220"
        image={image}
        alt={name}
        sx={{ 
          borderRadius: "16px 16px 0 0",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      />
      
      <CardContent sx={{ p: 3 }}>
        {/* Rating */}
        {rating > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Rating 
              value={rating} 
              readOnly 
              size="small"
              sx={{ 
                "& .MuiRating-iconFilled": { color: "#FBBF24" },
                "& .MuiRating-iconEmpty": { color: "#E5E7EB" },
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
              ({reviews} đánh giá)
            </Typography>
          </Box>
        )}

        {/* Product Name */}
        <Typography 
          variant="h6" 
          fontWeight="600" 
          sx={{ 
            mb: 2,
            fontFamily: "'Inter', sans-serif",
            fontSize: "1rem",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {name}
        </Typography>

        {/* Price */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            color="#1E40AF"
            fontWeight="700"
            sx={{
              fontSize: "1.1rem",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {`${price.toLocaleString("vi-VN")} VNĐ`}
          </Typography>
          {originalPrice && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                textDecoration: "line-through",
                fontSize: "0.9rem",
                mt: 0.5,
              }}
            >
              {originalPrice}
            </Typography>
          )}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetail();
            }}
            sx={{
              bgcolor: "#3B82F6",
              color: "white",
              flex: 1,
              py: 1.5,
              borderRadius: 2,
              fontSize: "0.9rem",
              fontWeight: "600",
              textTransform: "none",
              "&:hover": {
                bgcolor: "#1E40AF",
                transform: "translateY(-2px)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <Visibility sx={{ mr: 1, fontSize: "1.1rem" }} />
            Xem
          </IconButton>
          {/* <IconButton
            onClick={handleAddToCart}
            sx={{
              bgcolor: "#22C55E",
              color: "white",
              flex: 1,
              py: 1.5,
              borderRadius: 2,
              fontSize: "0.9rem",
              fontWeight: "600",
              textTransform: "none",
              "&:hover": {
                bgcolor: "#16A34A",
                transform: "translateY(-2px)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <AddShoppingCart sx={{ mr: 1, fontSize: "1.1rem" }} />
            Mua
          </IconButton> */}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;