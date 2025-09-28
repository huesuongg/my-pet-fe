import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  Container,
  Stack,
  Badge,
  Tooltip,
  Fade,
  Zoom
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Pets as PetsIcon,
  Vaccines as VaccineIcon,
  MedicalServices as MedicalIcon,
  CalendarToday as CalendarIcon,
  Scale as ScaleIcon,
  Palette as ColorIcon,
  Male as MaleIcon,
  Female as FemaleIcon,
  AccessTime as TimeIcon,
  LocalHospital as HospitalIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { RootState, AppDispatch } from '../../../store';
import { getPetsByUserId, deletePet } from '../petThunk';
import { useAuth } from '../../authenticate/hooks/useAuth';
import { Pet, PET_SPECIES, PET_GENDERS } from '../types';
import PetForm from '../components/PetForm';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`pet-tabpanel-${index}`}
      aria-labelledby={`pet-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function PetProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  // const navigate = useNavigate();
  const { user } = useAuth();
  const { pets, loading, error } = useSelector((state: RootState) => state.pet);
  
  const [tabValue, setTabValue] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<Pet | null>(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(getPetsByUserId(user.id));
    }
  }, [dispatch, user?.id]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddPet = () => {
    setEditingPet(null);
    setOpenForm(true);
  };

  const handleEditPet = (pet: Pet) => {
    setEditingPet(pet);
    setOpenForm(true);
  };

  const handleDeletePet = (pet: Pet) => {
    setDeleteDialog(pet);
  };

  const confirmDelete = async () => {
    if (deleteDialog) {
      try {
        await dispatch(deletePet(deleteDialog.id)).unwrap();
        toast.success(`Đã xóa thú cưng "${deleteDialog.name}" thành công!`);
        setDeleteDialog(null);
        // Refresh pets list
        if (user?.id) {
          dispatch(getPetsByUserId(user.id));
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa thú cưng');
        console.error('Delete pet error:', error);
      }
    }
  };

  const getSpeciesLabel = (species: string) => {
    return PET_SPECIES.find(s => s.value === species)?.label || species;
  };

  const getGenderLabel = (gender: string) => {
    return PET_GENDERS.find(g => g.value === gender)?.label || gender;
  };

  const getGenderIcon = (gender: string) => {
    return gender === 'male' ? <MaleIcon /> : <FemaleIcon />;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Fade in timeout={600}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          p: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 3,
          color: 'white',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              🐾 Hồ sơ thú cưng
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Quản lý thông tin và lịch sử sức khỏe của thú cưng
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddPet}
            sx={{ 
              borderRadius: 3,
              px: 3,
              py: 1.5,
              bgcolor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            Thêm thú cưng
          </Button>
        </Box>
      </Fade>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {pets.length === 0 ? (
        <Zoom in timeout={800}>
          <Paper sx={{ 
            p: 8, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <PetsIcon sx={{ 
              fontSize: 120, 
              color: 'primary.main', 
              mb: 3,
              opacity: 0.7
            }} />
            <Typography variant="h5" color="text.primary" gutterBottom fontWeight="bold">
              Chưa có thú cưng nào
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
              Hãy thêm thông tin thú cưng đầu tiên của bạn để bắt đầu quản lý sức khỏe và lịch sử y tế
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={handleAddPet}
              startIcon={<AddIcon />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontSize: '1.1rem',
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Thêm thú cưng ngay
            </Button>
          </Paper>
        </Zoom>
      ) : (
        <>
          {/* Tabs */}
          <Fade in timeout={600}>
            <Paper sx={{ 
              mb: 4, 
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': {
                    py: 2,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                  },
                  '& .Mui-selected': {
                    color: 'primary.main',
                  }
                }}
              >
                <Tab 
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <PetsIcon />
                      <span>Danh sách thú cưng</span>
                    </Stack>
                  } 
                />
                <Tab 
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <VaccineIcon />
                      <span>Lịch sử tiêm phòng</span>
                    </Stack>
                  } 
                />
                <Tab 
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <MedicalIcon />
                      <span>Lịch sử khám bệnh</span>
                    </Stack>
                  } 
                />
              </Tabs>
            </Paper>
          </Fade>

          {/* Tab Panels */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              {pets.map((pet, index) => (
                <Grid key={pet.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Zoom in timeout={600 + index * 100}>
                    <Card sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: 3,
                      overflow: 'hidden',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
                      }
                    }}>
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="220"
                          image={pet.profileImage || 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=face'}
                          alt={pet.name}
                          sx={{ objectFit: 'cover' }}
                        />
                        <Box sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          display: 'flex',
                          gap: 1
                        }}>
                          <Tooltip title="Chỉnh sửa">
                            <IconButton
                              size="small"
                              onClick={() => handleEditPet(pet)}
                              sx={{ 
                                bgcolor: 'rgba(255,255,255,0.9)',
                                backdropFilter: 'blur(10px)',
                                '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <IconButton
                              size="small"
                              onClick={() => handleDeletePet(pet)}
                              sx={{ 
                                bgcolor: 'rgba(255,255,255,0.9)',
                                backdropFilter: 'blur(10px)',
                                color: 'error.main',
                                '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Box sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                          p: 2
                        }}>
                          <Typography variant="h6" fontWeight="bold" color="white">
                            {pet.name}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Stack spacing={2}>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            <Chip
                              label={getSpeciesLabel(pet.species)}
                              size="small"
                              color="primary"
                              variant="filled"
                            />
                            <Chip
                              label={pet.breed}
                              size="small"
                              variant="outlined"
                              color="secondary"
                            />
                            <Chip
                              icon={getGenderIcon(pet.gender)}
                              label={getGenderLabel(pet.gender)}
                              size="small"
                              color={pet.gender === 'male' ? 'primary' : 'secondary'}
                              variant="outlined"
                            />
                          </Box>

                          <Stack spacing={1}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CalendarIcon sx={{ fontSize: 18, mr: 1.5, color: 'primary.main' }} />
                              <Typography variant="body2" color="text.secondary">
                                <strong>{pet.age}</strong> tuổi
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <ScaleIcon sx={{ fontSize: 18, mr: 1.5, color: 'primary.main' }} />
                              <Typography variant="body2" color="text.secondary">
                                <strong>{pet.weight}</strong> kg
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <ColorIcon sx={{ fontSize: 18, mr: 1.5, color: 'primary.main' }} />
                              <Typography variant="body2" color="text.secondary">
                                Màu: <strong>{pet.color || 'Chưa xác định'}</strong>
                              </Typography>
                            </Box>
                          </Stack>

                          {pet.notes && (
                            <Box sx={{ 
                              p: 2, 
                              bgcolor: 'grey.50', 
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: 'grey.200'
                            }}>
                              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                "{pet.notes}"
                              </Typography>
                            </Box>
                          )}

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Thêm ngày: {new Date(pet.createdAt).toLocaleDateString('vi-VN')}
                            </Typography>
                            <Badge 
                              badgeContent={pet.vaccinationHistory.length + pet.medicalHistory.length} 
                              color="primary"
                              sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem' } }}
                            >
                              <HospitalIcon color="action" />
                            </Badge>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Fade in timeout={600}>
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                  💉 Lịch sử tiêm phòng
                </Typography>
                {pets.map((pet) => (
                  <Card key={pet.id} sx={{ 
                    mb: 3, 
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}>
                    <Box sx={{ 
                      p: 3, 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white'
                    }}>
                      <Typography variant="h6" fontWeight="bold">
                        🐾 {pet.name}
                      </Typography>
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                      {pet.vaccinationHistory.length === 0 ? (
                        <Box sx={{ 
                          textAlign: 'center', 
                          py: 4,
                          bgcolor: 'grey.50',
                          borderRadius: 2
                        }}>
                          <VaccineIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                          <Typography color="text.secondary" variant="h6">
                            Chưa có lịch sử tiêm phòng
                          </Typography>
                          <Typography color="text.secondary" variant="body2">
                            Hãy đưa thú cưng đi tiêm phòng để bảo vệ sức khỏe
                          </Typography>
                        </Box>
                      ) : (
                        <List sx={{ p: 0 }}>
                          {pet.vaccinationHistory.map((record) => (
                            <ListItem key={record.id} sx={{ 
                              p: 0, 
                              mb: 2,
                              '&:last-child': { mb: 0 }
                            }}>
                              <Card sx={{ 
                                width: '100%',
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'grey.200',
                                '&:hover': {
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }
                              }}>
                                <CardContent sx={{ p: 3 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                    <Avatar sx={{ 
                                      bgcolor: 'primary.main',
                                      width: 48,
                                      height: 48
                                    }}>
                                      <VaccineIcon />
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        {record.vaccineName}
                                      </Typography>
                                      <Stack spacing={1}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <CalendarIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                          <Typography variant="body2" color="text.secondary">
                                            Ngày tiêm: <strong>{new Date(record.vaccinationDate).toLocaleDateString('vi-VN')}</strong>
                                          </Typography>
                                        </Box>
                                        {record.nextDueDate && (
                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <TimeIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                                            <Typography variant="body2" color="text.secondary">
                                              Lần tiếp theo: <strong>{new Date(record.nextDueDate).toLocaleDateString('vi-VN')}</strong>
                                            </Typography>
                                          </Box>
                                        )}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <HospitalIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                          <Typography variant="body2" color="text.secondary">
                                            Bác sĩ: <strong>{record.veterinarian}</strong>
                                          </Typography>
                                        </Box>
                                        {record.notes && (
                                          <Box sx={{ 
                                            mt: 2, 
                                            p: 2, 
                                            bgcolor: 'grey.50', 
                                            borderRadius: 1,
                                            border: '1px solid',
                                            borderColor: 'grey.200'
                                          }}>
                                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                              💬 {record.notes}
                                            </Typography>
                                          </Box>
                                        )}
                                      </Stack>
                                    </Box>
                                  </Box>
                                </CardContent>
                              </Card>
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Fade>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Fade in timeout={600}>
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                  🏥 Lịch sử khám bệnh
                </Typography>
                {pets.map((pet) => (
                  <Card key={pet.id} sx={{ 
                    mb: 3, 
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}>
                    <Box sx={{ 
                      p: 3, 
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      color: 'white'
                    }}>
                      <Typography variant="h6" fontWeight="bold">
                        🐾 {pet.name}
                      </Typography>
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                      {pet.medicalHistory.length === 0 ? (
                        <Box sx={{ 
                          textAlign: 'center', 
                          py: 4,
                          bgcolor: 'grey.50',
                          borderRadius: 2
                        }}>
                          <MedicalIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                          <Typography color="text.secondary" variant="h6">
                            Chưa có lịch sử khám bệnh
                          </Typography>
                          <Typography color="text.secondary" variant="body2">
                            Thú cưng của bạn có vẻ rất khỏe mạnh!
                          </Typography>
                        </Box>
                      ) : (
                        <List sx={{ p: 0 }}>
                          {pet.medicalHistory.map((record) => (
                            <ListItem key={record.id} sx={{ 
                              p: 0, 
                              mb: 2,
                              '&:last-child': { mb: 0 }
                            }}>
                              <Card sx={{ 
                                width: '100%',
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'grey.200',
                                '&:hover': {
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }
                              }}>
                                <CardContent sx={{ p: 3 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                    <Avatar sx={{ 
                                      bgcolor: 'error.main',
                                      width: 48,
                                      height: 48
                                    }}>
                                      <MedicalIcon />
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                      <Typography variant="h6" fontWeight="bold" gutterBottom color="error.main">
                                        {record.diagnosis}
                                      </Typography>
                                      <Stack spacing={1}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <CalendarIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                          <Typography variant="body2" color="text.secondary">
                                            Ngày khám: <strong>{new Date(record.date).toLocaleDateString('vi-VN')}</strong>
                                          </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <HospitalIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                          <Typography variant="body2" color="text.secondary">
                                            Điều trị: <strong>{record.treatment}</strong>
                                          </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <HospitalIcon sx={{ fontSize: 16, color: 'info.main' }} />
                                          <Typography variant="body2" color="text.secondary">
                                            Bác sĩ: <strong>{record.veterinarian}</strong>
                                          </Typography>
                                        </Box>
                                        {record.notes && (
                                          <Box sx={{ 
                                            mt: 2, 
                                            p: 2, 
                                            bgcolor: 'grey.50', 
                                            borderRadius: 1,
                                            border: '1px solid',
                                            borderColor: 'grey.200'
                                          }}>
                                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                              💬 {record.notes}
                                            </Typography>
                                          </Box>
                                        )}
                                      </Stack>
                                    </Box>
                                  </Box>
                                </CardContent>
                              </Card>
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Fade>
          </TabPanel>
        </>
      )}

      {/* Pet Form Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPet ? 'Chỉnh sửa thú cưng' : 'Thêm thú cưng mới'}
        </DialogTitle>
        <DialogContent>
          <PetForm
            pet={editingPet}
            onClose={() => setOpenForm(false)}
            onSuccess={() => {
              setOpenForm(false);
              if (user?.id) {
                dispatch(getPetsByUserId(user.id));
              }
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={!!deleteDialog} 
        onClose={() => setDeleteDialog(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ 
          p: 4, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
          color: 'white'
        }}>
          <WarningIcon sx={{ fontSize: 64, mb: 2 }} />
          <DialogTitle sx={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
            Xác nhận xóa thú cưng
          </DialogTitle>
        </Box>
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Bạn có chắc chắn muốn xóa thú cưng
            </Typography>
            <Typography variant="h5" color="error" fontWeight="bold" gutterBottom>
              "{deleteDialog?.name}"?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến thú cưng này sẽ bị xóa vĩnh viễn.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={() => setDeleteDialog(null)}
            variant="outlined"
            size="large"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Hủy
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained"
            size="large"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Xóa vĩnh viễn
          </Button>
        </DialogActions>
      </Dialog>
      
    </Container>
  );
}
