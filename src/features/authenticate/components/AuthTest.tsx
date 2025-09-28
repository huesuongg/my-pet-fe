import React from 'react';
import { Box, Typography, Button, Paper, Grid, Chip } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

export const AuthTest: React.FC = () => {
  const { user, isAuthenticated, login, register, logout, status, error } = useAuth();

  const handleTestLogin = () => {
    login({
      username: 'admin',
      password: 'admin123',
      rememberClient: false
    });
  };

  const handleTestRegister = () => {
    register({
      username: 'testuser',
      email: 'test@example.com',
      password: 'test123',
      confirmPassword: 'test123',
      fullName: 'Test User',
      phone: '0123456789'
    });
  };

  if (!isAuthenticated) {
    return (
      <Paper sx={{ p: 3, m: 2 }}>
        <Typography variant="h6" gutterBottom>
          Authentication Test Panel
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Status: {status} | Error: {error || 'None'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={handleTestLogin}>
            Test Login (admin/admin123)
          </Button>
          <Button variant="outlined" onClick={handleTestRegister}>
            Test Register
          </Button>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Welcome, {user?.fullName}!
      </Typography>
      
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Email:</strong> {user?.email}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Phone:</strong> {user?.phone}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Role:</strong> 
            <Chip 
              label={user?.role} 
              color={user?.role === 'admin' ? 'error' : user?.role === 'doctor' ? 'warning' : 'primary'}
              size="small" 
              sx={{ ml: 1 }}
            />
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Status:</strong> {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" color="error" onClick={logout}>
          Logout
        </Button>
      </Box>
    </Paper>
  );
};

export default AuthTest;
