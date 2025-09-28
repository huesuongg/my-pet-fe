import { Pet } from './types';

export const mockPets: Pet[] = [
  {
    id: 'pet1',
    userId: 2, // user1
    name: 'Buddy',
    species: 'dog',
    breed: 'Golden Retriever',
    age: 3,
    gender: 'male',
    weight: 25.5,
    color: 'Vàng',
    microchipId: 'CHIP001',
    profileImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop',
    notes: 'Thú cưng rất ngoan và thân thiện',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    vaccinationHistory: [
      {
        id: 'vac1',
        vaccineName: 'Vaccine 5 bệnh',
        vaccinationDate: '2024-01-10',
        nextDueDate: '2025-01-10',
        veterinarian: 'Dr. Sarah Johnson',
        notes: 'Không có phản ứng phụ'
      },
      {
        id: 'vac2',
        vaccineName: 'Vaccine dại',
        vaccinationDate: '2024-01-10',
        nextDueDate: '2025-01-10',
        veterinarian: 'Dr. Sarah Johnson',
        notes: 'Tiêm thành công'
      }
    ],
    medicalHistory: [
      {
        id: 'med1',
        date: '2024-01-15',
        diagnosis: 'Khám sức khỏe định kỳ',
        treatment: 'Kiểm tra tổng quát, tiêm vaccine',
        veterinarian: 'Dr. Sarah Johnson',
        notes: 'Sức khỏe tốt, cần theo dõi cân nặng'
      }
    ]
  },
  {
    id: 'pet2',
    userId: 2, // user1
    name: 'Whiskers',
    species: 'cat',
    breed: 'Persian',
    age: 2,
    gender: 'female',
    weight: 4.2,
    color: 'Trắng',
    microchipId: 'CHIP002',
    profileImage: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=300&h=300&fit=crop',
    notes: 'Mèo cưng rất dễ thương',
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
    vaccinationHistory: [
      {
        id: 'vac3',
        vaccineName: 'Vaccine 3 bệnh',
        vaccinationDate: '2024-02-05',
        nextDueDate: '2025-02-05',
        veterinarian: 'Dr. Michael Chen',
        notes: 'Mèo phản ứng bình thường'
      }
    ],
    medicalHistory: []
  },
  {
    id: 'pet3',
    userId: 4, // user2
    name: 'Coco',
    species: 'bird',
    breed: 'Cockatiel',
    age: 1,
    gender: 'male',
    weight: 0.1,
    color: 'Vàng xám',
    profileImage: 'https://images.unsplash.com/photo-1608699641130-a47cbef0ac44?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    notes: 'Chim rất thông minh và biết nói',
    isActive: true,
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
    vaccinationHistory: [],
    medicalHistory: []
  }
];

// Simulate API delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
