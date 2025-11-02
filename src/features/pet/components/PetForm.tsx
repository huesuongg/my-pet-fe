import React, { useState, useEffect } from 'react';
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
  Avatar
} from '@mui/material';
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import { useAuth } from '../../authenticate/hooks/useAuth';
import { Pet, PetFormData, PET_SPECIES, PET_GENDERS } from '../types';
import { petAPI } from '../petAPI';
import { toast } from 'react-toastify';

interface PetFormProps {
  pet?: Pet | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PetForm({ pet, onClose, onSuccess }: PetFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Reset form khi pet thay đổi hoặc khi đóng form
  useEffect(() => {
    if (pet) {
      // Edit mode - load data từ pet
      if (!pet.id) {
        console.error('PetForm: pet object missing id:', pet);
        setError('Lỗi: Không tìm thấy ID của thú cưng. Vui lòng tải lại trang.');
        return;
      }
      console.log('PetForm: Loading pet data for edit, ID:', pet.id);
      setFormData({
        name: pet.name || '',
        species: pet.species || 'dog',
        breed: pet.breed || '',
        age: pet.age || 0,
        gender: pet.gender || 'male',
        weight: pet.weight || 0,
        color: pet.color || '',
        microchipId: pet.microchipId || '',
        profileImage: pet.profileImage || '',
        notes: pet.notes || ''
      });
      setFormErrors({});
      setError(null);
    } else {
      // Create mode - reset về default
      setFormData({
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
      setFormErrors({});
      setError(null);
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

    // Tuổi và cân nặng không bắt buộc, nhưng nếu có thì phải > 0
    if (formData.age < 0) {
      errors.age = 'Tuổi không được âm';
    }
    if (formData.age > 30) {
      errors.age = 'Tuổi không được vượt quá 30 năm';
    }

    if (formData.weight < 0) {
      errors.weight = 'Cân nặng không được âm';
    }
    if (formData.weight > 200) {
      errors.weight = 'Cân nặng không được vượt quá 200kg';
    }

    if (formData.color && !formData.color.trim()) {
      errors.color = 'Màu sắc không được để trống nếu đã nhập';
    }

    // Validate URL nếu có nhập profileImage
    if (formData.profileImage && formData.profileImage.trim()) {
      try {
        new URL(formData.profileImage);
      } catch {
        errors.profileImage = 'URL ảnh không hợp lệ';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    try {
      setLoading(true);
      setError(null);
      
      // Chuẩn bị data để gửi - loại bỏ các trường rỗng/0 nếu không cần thiết
      const submitData: PetFormData = {
        name: formData.name.trim(),
        species: formData.species,
        breed: formData.breed.trim(),
        age: formData.age > 0 ? formData.age : 0, // Gửi 0 nếu không nhập
        gender: formData.gender,
        weight: formData.weight > 0 ? formData.weight : 0, // Gửi 0 nếu không nhập
        color: formData.color?.trim() || '',
        microchipId: formData.microchipId?.trim() || '',
        profileImage: formData.profileImage?.trim() || '',
        notes: formData.notes?.trim() || ''
      };
      
      if (pet && pet.id) {
        // Update existing pet - gửi tất cả data để đảm bảo cập nhật đầy đủ
        console.log('Updating pet with ID:', pet.id);
        await petAPI.updatePet(pet.id, submitData);
        toast.success('Cập nhật thú cưng thành công!');
      } else {
        // Create new pet - gửi tất cả data
        await petAPI.createPet(Number(user.id), submitData);
        toast.success('Thêm thú cưng mới thành công!');
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi lưu thú cưng');
      toast.error(err.message || 'Có lỗi xảy ra khi lưu thú cưng');
      console.error('Error saving pet:', err);
    } finally {
      setLoading(false);
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
        {/* Profile Image Preview */}
        <Grid size={{ xs: 12 }} sx={{ textAlign: 'center' }}>
          <Box sx={{ mb: 2 }}>
            <Avatar
              src={formData.profileImage || undefined}
              sx={{ 
                width: 120, 
                height: 120, 
                mx: 'auto', 
                mb: 1,
                border: formData.profileImage ? '3px solid' : '2px dashed',
                borderColor: formData.profileImage ? 'primary.main' : 'grey.300',
                bgcolor: formData.profileImage ? 'transparent' : 'grey.100'
              }}
            >
              <PhotoCameraIcon sx={{ fontSize: 40, color: 'grey.400' }} />
            </Avatar>
            <Typography variant="body2" color="text.secondary">
              {formData.profileImage ? 'Ảnh đại diện hiện tại' : 'Chưa có ảnh đại diện'}
            </Typography>
          </Box>
        </Grid>

        {/* Name */}
        <Grid size={{ xs: 12, sm: 6 }}>
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
        <Grid size={{ xs: 12, sm: 6 }}>
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
        <Grid size={{ xs: 12, sm: 6 }}>
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
        <Grid size={{ xs: 12, sm: 6 }}>
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
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Tuổi (năm)"
            type="number"
            value={formData.age || ''}
            onChange={(e) => handleInputChange('age', e.target.value ? parseInt(e.target.value) : 0)}
            error={!!formErrors.age}
            helperText={formErrors.age || 'Ví dụ: 2'}
            inputProps={{ min: 0, max: 30 }}
            placeholder="Nhập tuổi"
          />
        </Grid>

        {/* Weight */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Cân nặng (kg)"
            type="number"
            value={formData.weight || ''}
            onChange={(e) => handleInputChange('weight', e.target.value ? parseFloat(e.target.value) : 0)}
            error={!!formErrors.weight}
            helperText={formErrors.weight || 'Ví dụ: 5.5'}
            inputProps={{ min: 0, max: 200, step: 0.1 }}
            placeholder="Nhập cân nặng"
          />
        </Grid>

        {/* Color */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Màu sắc"
            value={formData.color || ''}
            onChange={(e) => handleInputChange('color', e.target.value)}
            error={!!formErrors.color}
            helperText={formErrors.color || 'Ví dụ: Vàng, Đen trắng, Xám...'}
            placeholder="Nhập màu sắc"
          />
        </Grid>

        {/* Microchip ID */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Mã chip (tùy chọn)"
            value={formData.microchipId}
            onChange={(e) => handleInputChange('microchipId', e.target.value)}
          />
        </Grid>

        {/* Profile Image URL */}
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Link ảnh đại diện (tùy chọn)"
            value={formData.profileImage || ''}
            onChange={(e) => handleInputChange('profileImage', e.target.value)}
            error={!!formErrors.profileImage}
            helperText={formErrors.profileImage || 'Dán URL ảnh từ internet'}
            placeholder="https://example.com/pet-image.jpg"
          />
          {formData.profileImage && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Xem trước:
              </Typography>
              <Avatar
                src={formData.profileImage}
                sx={{ width: 100, height: 100, mx: 'auto', border: '2px solid', borderColor: 'primary.main' }}
              >
                <PhotoCameraIcon />
              </Avatar>
            </Box>
          )}
        </Grid>

        {/* Notes */}
        <Grid size={{ xs: 12 }}>
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
