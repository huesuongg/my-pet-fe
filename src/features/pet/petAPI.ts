import { Pet, PetFormData, VaccinationRecord, MedicalRecord } from './types';
import axiosInstance from '../../services/axiosInstance';

export const petAPI = {
  // Get pets by user ID (lấy tất cả pets của user hiện tại)
  getPetsByUserId: async (userId: string): Promise<Pet[]> => {
    try {
      const response = await axiosInstance.get('/api/pets', {
        params: userId ? { ownerId: userId } : {}
      });
      // Đảm bảo luôn trả về array
      const data = response.data;
      if (Array.isArray(data)) {
        return data;
      }
      // Nếu response có format { items: [...] }
      if (data && Array.isArray(data.items)) {
        return data.items;
      }
      // Nếu không phải array, trả về empty array
      console.warn('Unexpected response format:', data);
      return [];
    } catch (error: unknown) {
      console.error('Error fetching pets:', error);
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch pets'
        : 'Failed to fetch pets';
      throw new Error(errorMessage);
    }
  },

  // Get all pets (cho user hiện tại)
  getPets: async (): Promise<Pet[]> => {
    try {
      const response = await axiosInstance.get('/api/pets');
      // Đảm bảo luôn trả về array
      const data = response.data;
      if (Array.isArray(data)) {
        return data;
      }
      // Nếu response có format { items: [...] }
      if (data && Array.isArray(data.items)) {
        return data.items;
      }
      // Nếu không phải array, trả về empty array
      console.warn('Unexpected response format:', data);
      return [];
    } catch (error: unknown) {
      console.error('Error fetching pets:', error);
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch pets'
        : 'Failed to fetch pets';
      throw new Error(errorMessage);
    }
  },

  // Get pet by ID
  getPetById: async (petId: string): Promise<Pet | null> => {
    try {
      const response = await axiosInstance.get(`/api/pets/${petId}`);
      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching pet:', error);
      const axiosError = error && typeof error === 'object' && 'response' in error
        ? error as { response?: { status?: number; data?: { message?: string } } }
        : null;
      if (axiosError?.response?.status === 404) {
        return null;
      }
      const errorMessage = axiosError?.response?.data?.message || 'Failed to fetch pet';
      throw new Error(errorMessage);
    }
  },

  // Create new pet
  createPet: async (_userId: string, petData: PetFormData): Promise<Pet> => {
    try {
      const response = await axiosInstance.post('/api/pets', petData);
      return response.data;
    } catch (error: unknown) {
      console.error('Error creating pet:', error);
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to create pet'
        : 'Failed to create pet';
      throw new Error(errorMessage);
    }
  },

  // Update pet
  updatePet: async (petId: string, petData: Partial<PetFormData>): Promise<Pet | null> => {
    try {
      if (!petId || petId === 'undefined' || petId.trim() === '') {
        throw new Error('Pet ID is required for update');
      }
      console.log('Updating pet:', petId, petData);
      const response = await axiosInstance.put(`/api/pets/${petId}`, petData);
      return response.data;
    } catch (error: unknown) {
      console.error('Error updating pet:', error);
      const axiosError = error && typeof error === 'object' && 'response' in error
        ? error as { response?: { status?: number; data?: { message?: string } }; message?: string }
        : null;
      if (axiosError?.response?.status === 404) {
        return null;
      }
      const errorMessage = axiosError?.response?.data?.message || axiosError?.message || 'Failed to update pet';
      throw new Error(errorMessage);
    }
  },

  // Delete pet (hard delete)
  deletePet: async (petId: string): Promise<boolean> => {
    try {
      const response = await axiosInstance.delete(`/api/pets/${petId}`);
      return response.data?.success || true;
    } catch (error: unknown) {
      console.error('Error deleting pet:', error);
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to delete pet'
        : 'Failed to delete pet';
      throw new Error(errorMessage);
    }
  },

  // Add vaccination record (TODO: cần thêm endpoint này ở backend)
  addVaccinationRecord: async (petId: string, record: Omit<VaccinationRecord, 'id'>): Promise<VaccinationRecord | null> => {
    try {
      // Tạm thời update pet với vaccinationHistory mới
      const pet = await petAPI.getPetById(petId);
      if (!pet) return null;

      const newRecord: VaccinationRecord = {
        id: `vac_${Date.now()}`,
        ...record
      };

      const updatedHistory = [...pet.vaccinationHistory, newRecord];
      await axiosInstance.put(`/api/pets/${petId}`, {
        vaccinationHistory: updatedHistory
      });

      return newRecord;
    } catch (error: unknown) {
      console.error('Error adding vaccination record:', error);
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to add vaccination record'
        : 'Failed to add vaccination record';
      throw new Error(errorMessage);
    }
  },

  // Add medical record (TODO: cần thêm endpoint này ở backend)
  addMedicalRecord: async (petId: string, record: Omit<MedicalRecord, 'id'>): Promise<MedicalRecord | null> => {
    try {
      // Tạm thời update pet với medicalHistory mới
      const pet = await petAPI.getPetById(petId);
      if (!pet) return null;

      const newRecord: MedicalRecord = {
        id: `med_${Date.now()}`,
        ...record
      };

      const updatedHistory = [...pet.medicalHistory, newRecord];
      await axiosInstance.put(`/api/pets/${petId}`, {
        medicalHistory: updatedHistory
      });

      return newRecord;
    } catch (error: unknown) {
      console.error('Error adding medical record:', error);
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to add medical record'
        : 'Failed to add medical record';
      throw new Error(errorMessage);
    }
  }
};
