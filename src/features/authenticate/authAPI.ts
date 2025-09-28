import { LoginPayload, RegisterPayload, User, AuthResult } from "./types";
import { mockUsers, mockCredentials } from "./mockData";

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const loginAPI = async (data: LoginPayload): Promise<{ data: { result: AuthResult } }> => {
  await delay(1000); // Simulate network delay
  
  const user = mockUsers.find(u => 
    (u.username === data.username || u.email === data.username) && 
    mockCredentials[u.username as keyof typeof mockCredentials] === data.password
  );

  if (!user || !user.isActive) {
    throw new Error('Invalid credentials');
  }

  const token = `mock_token_${user.id}_${Date.now()}`;
  
  return {
    data: {
      result: {
        accessToken: token,
        encryptedAccessToken: token,
        expireInSeconds: 3600,
        userId: user.id
      }
    }
  };
};

export const registerAPI = async (data: RegisterPayload): Promise<{ data: { result: AuthResult } }> => {
  await delay(1000); // Simulate network delay
  
  // Check if user already exists
  const existingUser = mockUsers.find(u => 
    u.username === data.username || u.email === data.email
  );

  if (existingUser) {
    throw new Error('User already exists');
  }

  // Check password confirmation
  if (data.password !== data.confirmPassword) {
    throw new Error('Passwords do not match');
  }

  // Create new user
  const newUser: User = {
    id: mockUsers.length + 1,
    username: data.username,
    email: data.email,
    fullName: data.fullName,
    phone: data.phone,
    role: 'user',
    isActive: true,
    createdAt: new Date().toISOString()
  };

  // Add to mock data
  mockUsers.push(newUser);
  mockCredentials[data.username as keyof typeof mockCredentials] = data.password;

  const token = `mock_token_${newUser.id}_${Date.now()}`;
  
  return {
    data: {
      result: {
        accessToken: token,
        encryptedAccessToken: token,
        expireInSeconds: 3600,
        userId: newUser.id
      }
    }
  };
};

export const getUserByIdAPI = async (userId: number): Promise<{ data: User }> => {
  await delay(500);
  
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  return { data: user };
};
