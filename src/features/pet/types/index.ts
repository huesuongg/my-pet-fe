export interface Pet {
  id: string;
  userId: number;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster' | 'fish' | 'other';
  breed: string;
  age: number;
  gender: 'male' | 'female';
  weight: number;
  color?: string;
  microchipId?: string;
  vaccinationHistory: VaccinationRecord[];
  medicalHistory: MedicalRecord[];
  profileImage?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VaccinationRecord {
  id: string;
  vaccineName: string;
  vaccinationDate: string;
  nextDueDate?: string;
  veterinarian: string;
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  date: string;
  diagnosis: string;
  treatment: string;
  veterinarian: string;
  notes?: string;
}

export interface PetFormData {
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster' | 'fish' | 'other';
  breed: string;
  age: number;
  gender: 'male' | 'female';
  weight: number;
  color?: string;
  microchipId?: string;
  profileImage?: string;
  notes?: string;
}

export interface PetState {
  pets: Pet[];
  currentPet: Pet | null;
  loading: boolean;
  error: string | null;
}

export const PET_SPECIES = [
  { value: 'dog', label: 'Chó' },
  { value: 'cat', label: 'Mèo' },
  { value: 'bird', label: 'Chim' },
  { value: 'rabbit', label: 'Thỏ' },
  { value: 'hamster', label: 'Hamster' },
  { value: 'fish', label: 'Cá' },
  { value: 'other', label: 'Khác' }
] as const;

export const PET_GENDERS = [
  { value: 'male', label: 'Đực' },
  { value: 'female', label: 'Cái' }
] as const;
