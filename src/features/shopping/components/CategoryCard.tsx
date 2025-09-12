import React from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";

interface CategoryCardProps {
  id: number;
  name: string;
  image: string;
  onClick?: (id: number) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  name,
  image,
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
        borderRadius: 3,
        boxShadow: 3,
        transition: "transform 0.2s",
        cursor: "pointer",
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
        <Typography variant="h6" fontWeight="bold">
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;