import { createAsyncThunk } from '@reduxjs/toolkit';
import { Pet, PetFormData, VaccinationRecord, MedicalRecord } from './types';
import { petAPI } from './petAPI';
import { RejectPayload } from '../../types';

export const getPetsByUserId = createAsyncThunk<
  Pet[],
  number,
  { rejectValue: RejectPayload }
>('pet/getPetsByUserId', async (userId, { rejectWithValue }) => {
  try {
    const pets = await petAPI.getPetsByUserId(userId.toString());
    return pets;
  } catch {
    return rejectWithValue({
      status: 400,
      message: 'Failed to fetch pets'
    });
  }
});

export const getPetById = createAsyncThunk<
  Pet,
  string,
  { rejectValue: RejectPayload }
>('pet/getPetById', async (petId, { rejectWithValue }) => {
  try {
    const pet = await petAPI.getPetById(petId);
    if (!pet) {
      return rejectWithValue({
        status: 404,
        message: 'Pet not found'
      });
    }
    return pet;
  } catch {
    return rejectWithValue({
      status: 400,
      message: 'Failed to fetch pet'
    });
  }
});

export const createPet = createAsyncThunk<
  Pet,
  PetFormData,
  { rejectValue: RejectPayload }
>('pet/createPet', async (petData, { rejectWithValue, getState }) => {
  try {
    interface RootState {
      auth?: {
        user?: {
          id?: string;
        };
      };
    }
    const state = getState() as RootState;
    const userId = state.auth?.user?.id;
    if (!userId) {
      return rejectWithValue({
        status: 401,
        message: 'User not authenticated'
      });
    }
    const pet = await petAPI.createPet(String(userId), petData);
    return pet;
  } catch {
    return rejectWithValue({
      status: 400,
      message: 'Failed to create pet'
    });
  }
});

export const updatePet = createAsyncThunk<
  Pet,
  { petId: string; updates: Partial<PetFormData> },
  { rejectValue: RejectPayload }
>('pet/updatePet', async ({ petId, updates }, { rejectWithValue }) => {
  try {
    const pet = await petAPI.updatePet(petId, updates);
    if (!pet) {
      return rejectWithValue({
        status: 404,
        message: 'Pet not found'
      });
    }
    return pet;
  } catch {
    return rejectWithValue({
      status: 400,
      message: 'Failed to update pet'
    });
  }
});

export const deletePet = createAsyncThunk<
  string,
  string,
  { rejectValue: RejectPayload }
>('pet/deletePet', async (petId, { rejectWithValue }) => {
  try {
    const success = await petAPI.deletePet(petId);
    if (!success) {
      return rejectWithValue({
        status: 404,
        message: 'Pet not found'
      });
    }
    return petId;
  } catch {
    return rejectWithValue({
      status: 400,
      message: 'Failed to delete pet'
    });
  }
});

export const addVaccinationRecord = createAsyncThunk<
  { petId: string; record: VaccinationRecord },
  { petId: string; record: Omit<VaccinationRecord, 'id'> },
  { rejectValue: RejectPayload }
>('pet/addVaccinationRecord', async ({ petId, record }, { rejectWithValue }) => {
  try {
    const newRecord = await petAPI.addVaccinationRecord(petId, record);
    if (!newRecord) {
      return rejectWithValue({
        status: 404,
        message: 'Pet not found'
      });
    }
    return { petId, record: newRecord };
  } catch {
    return rejectWithValue({
      status: 400,
      message: 'Failed to add vaccination record'
    });
  }
});

export const addMedicalRecord = createAsyncThunk<
  { petId: string; record: MedicalRecord },
  { petId: string; record: Omit<MedicalRecord, 'id'> },
  { rejectValue: RejectPayload }
>('pet/addMedicalRecord', async ({ petId, record }, { rejectWithValue }) => {
  try {
    const newRecord = await petAPI.addMedicalRecord(petId, record);
    if (!newRecord) {
      return rejectWithValue({
        status: 404,
        message: 'Pet not found'
      });
    }
    return { petId, record: newRecord };
  } catch {
    return rejectWithValue({
      status: 400,
      message: 'Failed to add medical record'
    });
  }
});
