

import { Box, Typography } from '@mui/material';

export default function NotFoundPage() {
  return (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h3" color="error">404</Typography>
      <Typography variant="h5">Page Not Found</Typography>
      <Typography variant="body1">The page you're looking for doesn't exist.</Typography>
    </Box>
  );
}
