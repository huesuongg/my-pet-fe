import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { deletePet, getPetsByUserId } from '../petThunk';
import { useAuth } from '../../authenticate/hooks/useAuth';

export const PetDeleteTest: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const { pets, loading } = useSelector((state: RootState) => state.pet);

  const handleDeleteFirstPet = async () => {
    if (pets.length > 0) {
      try {
        await dispatch(deletePet(pets[0].id)).unwrap();
        console.log('Pet deleted successfully');
        // Refresh pets list
        if (user?.id) {
          dispatch(getPetsByUserId(user.id));
        }
      } catch (error) {
        console.error('Delete pet error:', error);
      }
    }
  };

  const handleRefreshPets = () => {
    if (user?.id) {
      dispatch(getPetsByUserId(user.id));
    }
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Pet Delete Test
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Current pets count: {pets.length}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button 
          variant="contained" 
          color="error"
          onClick={handleDeleteFirstPet}
          disabled={pets.length === 0 || loading}
        >
          Delete First Pet
        </Button>
        <Button 
          variant="outlined"
          onClick={handleRefreshPets}
          disabled={loading}
        >
          Refresh Pets
        </Button>
      </Box>
      {pets.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            First pet: {pets[0].name} (ID: {pets[0].id})
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default PetDeleteTest;
