import { User } from './types';

export const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@mypet.com',
    fullName: 'Administrator',
    phone: '0123456789',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    username: 'user1',
    email: 'user1@example.com',
    fullName: 'Nguyễn Văn A',
    phone: '0987654321',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 3,
    username: 'doctor1',
    email: 'doctor1@mypet.com',
    fullName: 'Dr. Sarah Johnson',
    phone: '0912345678',
    role: 'doctor',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    isActive: true,
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 4,
    username: 'user2',
    email: 'user2@example.com',
    fullName: 'Trần Thị B',
    phone: '0876543210',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z'
  },
  {
    id: 5,
    username: 'doctor2',
    email: 'doctor2@mypet.com',
    fullName: 'Dr. Michael Chen',
    phone: '0934567890',
    role: 'doctor',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
    isActive: true,
    createdAt: '2024-01-20T00:00:00Z'
  }
];

// Mock credentials for easy testing
export const mockCredentials = {
  'admin': 'admin123',
  'user1': 'user123',
  'doctor1': 'doctor123',
  'user2': 'user123',
  'doctor2': 'doctor123'
};
