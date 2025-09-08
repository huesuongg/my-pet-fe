import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import { ReactNode } from "react";

interface ServiceCardProps {
  image: string;
  icon: ReactNode;
  title: string;
  description: string;
}

export default function ServiceCard({ image, icon, title, description }: ServiceCardProps) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        textAlign: "center",
        p: 2,
        height: "100%",
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={image}
        alt={title}
        sx={{ borderRadius: 2 }}
      />
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
          <Box sx={{ fontSize: 24 }}>{icon}</Box>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}
