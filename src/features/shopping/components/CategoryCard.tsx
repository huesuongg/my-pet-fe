import React from "react";
import { Card, CardMedia, CardContent, Typography, Box, Chip } from "@mui/material";

interface CategoryCardProps {
  id: number;
  name: string;
  image: string;
  description?: string;
  productCount?: number;
  onClick?: (id: number) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  name,
  image,
  description,
  productCount,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        textAlign: "center",
        borderRadius: 4,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        overflow: "hidden",
        position: "relative",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="180"
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
        {/* Product Count Badge */}
        {productCount && (
          <Chip
            label={`${productCount} sản phẩm`}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              bgcolor: "rgba(30, 64, 175, 0.9)",
              color: "white",
              fontWeight: "600",
              fontSize: "0.8rem",
              backdropFilter: "blur(10px)",
            }}
          />
        )}
      </Box>
      
      <CardContent sx={{ p: 3 }}>
        <Typography 
          variant="h6" 
          fontWeight="700"
          sx={{ 
            mb: 1,
            fontFamily: "'Inter', sans-serif",
            color: "#1E40AF",
            fontSize: "1.1rem",
          }}
        >
          {name}
        </Typography>
        
        {description && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              fontSize: "0.9rem",
              lineHeight: 1.4,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryCard;