import React from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";

interface BlogCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  bgColor: string;
  onClick?: (id: number) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({
  id,
  title,
  description,
  image,
  bgColor,
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
        borderRadius: 3,
        boxShadow: 3,
        overflow: "hidden",
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
        alt={title}
      />
      <CardContent
        sx={{
          bgcolor: bgColor,
          minHeight: "150px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default BlogCard;