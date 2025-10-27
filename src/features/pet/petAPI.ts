import { Pet, PetFormData, VaccinationRecord, MedicalRecord } from './types';
import { mockPets, delay } from './mockData';

export const petAPI = {
  // Get pets by user ID
  getPetsByUserId: async (userId: string): Promise<Pet[]> => {
    await delay(500);
    return mockPets.filter(pet => pet.userId.toString() === userId && pet.isActive);
  },

  // Get pet by ID
  getPetById: async (petId: string): Promise<Pet | null> => {
    await delay(300);
    const pet = mockPets.find(p => p.id === petId);
    return pet || null;
  },

  // Create new pet
  createPet: async (userId: number, petData: PetFormData): Promise<Pet> => {
    await delay(1000);
    
    const newPet: Pet = {
      id: `pet${Date.now()}`,
      userId,
      ...petData,
      vaccinationHistory: [],
      medicalHistory: [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockPets.push(newPet);
    return newPet;
  },

  // Update pet
  updatePet: async (petId: string, petData: Partial<PetFormData>): Promise<Pet | null> => {
    await delay(800);
    
    const petIndex = mockPets.findIndex(p => p.id === petId);
    if (petIndex === -1) return null;

    mockPets[petIndex] = {
      ...mockPets[petIndex],
      ...petData,
      updatedAt: new Date().toISOString()
    };

    return mockPets[petIndex];
  },

  // Delete pet (hard delete)
  deletePet: async (petId: string): Promise<boolean> => {
    await delay(500);
    
    const petIndex = mockPets.findIndex(p => p.id === petId);
    if (petIndex === -1) return false;

    mockPets.splice(petIndex, 1);
    return true;
  },

  // Add vaccination record
  addVaccinationRecord: async (petId: string, record: Omit<VaccinationRecord, 'id'>): Promise<VaccinationRecord | null> => {
    await delay(600);
    
    const pet = mockPets.find(p => p.id === petId);
    if (!pet) return null;

    const newRecord: VaccinationRecord = {
      id: `vac${Date.now()}`,
      ...record
    };

    pet.vaccinationHistory.push(newRecord);
    pet.updatedAt = new Date().toISOString();
    
    return newRecord;
  },

  // Add medical record
  addMedicalRecord: async (petId: string, record: Omit<MedicalRecord, 'id'>): Promise<MedicalRecord | null> => {
    await delay(600);
    
    const pet = mockPets.find(p => p.id === petId);
    if (!pet) return null;

    const newRecord: MedicalRecord = {
      id: `med${Date.now()}`,
      ...record
    };

    pet.medicalHistory.push(newRecord);
    pet.updatedAt = new Date().toISOString();
    
    return newRecord;
  }
};
