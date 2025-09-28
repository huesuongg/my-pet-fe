import { createSlice } from '@reduxjs/toolkit';
import { Pet } from './types';
import { 
  getPetsByUserId, 
  getPetById, 
  createPet, 
  updatePet, 
  deletePet,
  addVaccinationRecord,
  addMedicalRecord
} from './petThunk';
import { RejectPayload } from '../../types';

interface PetState {
  pets: Pet[];
  currentPet: Pet | null;
  loading: boolean;
  error: string | null;
}

const initialState: PetState = {
  pets: [],
  currentPet: null,
  loading: false,
  error: null
};

const petSlice = createSlice({
  name: 'pet',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPet: (state, action) => {
      state.currentPet = action.payload;
    },
    clearCurrentPet: (state) => {
      state.currentPet = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get pets by user ID
      .addCase(getPetsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPetsByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.pets = action.payload;
        state.error = null;
      })
      .addCase(getPetsByUserId.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as RejectPayload;
        state.error = payload.message;
      })
      
      // Get pet by ID
      .addCase(getPetById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPetById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPet = action.payload;
        state.error = null;
      })
      .addCase(getPetById.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as RejectPayload;
        state.error = payload.message;
      })
      
      // Create pet
      .addCase(createPet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPet.fulfilled, (state, action) => {
        state.loading = false;
        state.pets.push(action.payload);
        state.currentPet = action.payload;
        state.error = null;
      })
      .addCase(createPet.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as RejectPayload;
        state.error = payload.message;
      })
      
      // Update pet
      .addCase(updatePet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePet.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPet = action.payload;
        const index = state.pets.findIndex(pet => pet.id === updatedPet.id);
        if (index !== -1) {
          state.pets[index] = updatedPet;
        }
        if (state.currentPet?.id === updatedPet.id) {
          state.currentPet = updatedPet;
        }
        state.error = null;
      })
      .addCase(updatePet.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as RejectPayload;
        state.error = payload.message;
      })
      
      // Delete pet
      .addCase(deletePet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePet.fulfilled, (state, action) => {
        state.loading = false;
        const petId = action.payload;
        state.pets = state.pets.filter(pet => pet.id !== petId);
        if (state.currentPet?.id === petId) {
          state.currentPet = null;
        }
        state.error = null;
      })
      .addCase(deletePet.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as RejectPayload;
        state.error = payload.message;
      })
      
      // Add vaccination record
      .addCase(addVaccinationRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addVaccinationRecord.fulfilled, (state, action) => {
        state.loading = false;
        const { petId, record } = action.payload;
        const pet = state.pets.find(p => p.id === petId);
        if (pet) {
          pet.vaccinationHistory.push(record);
        }
        if (state.currentPet?.id === petId) {
          state.currentPet.vaccinationHistory.push(record);
        }
        state.error = null;
      })
      .addCase(addVaccinationRecord.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as RejectPayload;
        state.error = payload.message;
      })
      
      // Add medical record
      .addCase(addMedicalRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMedicalRecord.fulfilled, (state, action) => {
        state.loading = false;
        const { petId, record } = action.payload;
        const pet = state.pets.find(p => p.id === petId);
        if (pet) {
          pet.medicalHistory.push(record);
        }
        if (state.currentPet?.id === petId) {
          state.currentPet.medicalHistory.push(record);
        }
        state.error = null;
      })
      .addCase(addMedicalRecord.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as RejectPayload;
        state.error = payload.message;
      });
  }
});

export const { clearError, setCurrentPet, clearCurrentPet } = petSlice.actions;
export default petSlice.reducer;
