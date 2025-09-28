import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  Avatar,
  IconButton
} from '@mui/material';
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import { RootState, AppDispatch } from '../../../store';
import { createPet, updatePet } from '../petThunk';
import { Pet, PetFormData, PET_SPECIES, PET_GENDERS } from '../types';

interface PetFormProps {
  pet?: Pet | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PetForm({ pet, onClose, onSuccess }: PetFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { loading, error } = useSelector((state: RootState) => state.pet);

  const [formData, setFormData] = useState<PetFormData>({
    name: '',
    species: 'dog',
    breed: '',
    age: 0,
    gender: 'male',
    weight: 0,
    color: '',
    microchipId: '',
    profileImage: '',
    notes: ''
  });

  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
        gender: pet.gender,
        weight: pet.weight,
        color: pet.color,
        microchipId: pet.microchipId || '',
        profileImage: pet.profileImage || '',
        notes: pet.notes || ''
      });
    }
  }, [pet]);

  const handleInputChange = (field: keyof PetFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      errors.name = 'Tên thú cưng là bắt buộc';
    }

    if (!formData.breed.trim()) {
      errors.breed = 'Giống loài là bắt buộc';
    }

    if (formData.age <= 0) {
      errors.age = 'Tuổi phải lớn hơn 0';
    }

    if (formData.weight <= 0) {
      errors.weight = 'Cân nặng phải lớn hơn 0';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    try {
      if (pet) {
        // Update existing pet
        await dispatch(updatePet({ petId: pet.id, updates: formData })).unwrap();
      } else {
        // Create new pet
        await dispatch(createPet(formData)).unwrap();
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving pet:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Image */}
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <Avatar
            src={formData.profileImage}
            sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
          >
            <PhotoCameraIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Ảnh đại diện (tùy chọn)
          </Typography>
        </Grid>

        {/* Name */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Tên thú cưng *"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={!!formErrors.name}
            helperText={formErrors.name}
          />
        </Grid>

        {/* Species */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!formErrors.species}>
            <InputLabel>Loài *</InputLabel>
            <Select
              value={formData.species}
              onChange={(e) => handleInputChange('species', e.target.value)}
              label="Loài *"
            >
              {PET_SPECIES.map((species) => (
                <MenuItem key={species.value} value={species.value}>
                  {species.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Breed */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Giống loài *"
            value={formData.breed}
            onChange={(e) => handleInputChange('breed', e.target.value)}
            error={!!formErrors.breed}
            helperText={formErrors.breed}
          />
        </Grid>

        {/* Gender */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Giới tính *</InputLabel>
            <Select
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              label="Giới tính *"
            >
              {PET_GENDERS.map((gender) => (
                <MenuItem key={gender.value} value={gender.value}>
                  {gender.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Age */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Tuổi (năm) *"
            type="number"
            value={formData.age}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
            error={!!formErrors.age}
            helperText={formErrors.age}
            inputProps={{ min: 0, max: 30 }}
          />
        </Grid>

        {/* Weight */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Cân nặng (kg) *"
            type="number"
            value={formData.weight}
            onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
            error={!!formErrors.weight}
            helperText={formErrors.weight}
            inputProps={{ min: 0, step: 0.1 }}
          />
        </Grid>

        {/* Color */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Màu sắc *"
            value={formData.color}
            onChange={(e) => handleInputChange('color', e.target.value)}
            error={!!formErrors.color}
            helperText={formErrors.color}
          />
        </Grid>

        {/* Microchip ID */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Mã chip (tùy chọn)"
            value={formData.microchipId}
            onChange={(e) => handleInputChange('microchipId', e.target.value)}
          />
        </Grid>

        {/* Profile Image URL */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Link ảnh đại diện (tùy chọn)"
            value={formData.profileImage}
            onChange={(e) => handleInputChange('profileImage', e.target.value)}
            placeholder="https://example.com/pet-image.jpg"
          />
        </Grid>

        {/* Notes */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Ghi chú (tùy chọn)"
            multiline
            rows={3}
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
          />
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
        <Button onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Đang lưu...' : (pet ? 'Cập nhật' : 'Tạo mới')}
        </Button>
      </Box>
    </Box>
  );
}
