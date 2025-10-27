import axiosInstance from "../../services/axiosInstance";

export interface AdminUser {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  role: string;
  clinicsOwned: any[];
  primaryClinicId: string | null;
  doctorProfileId: string | null;
  isBanned: boolean;
  banReason: string | null;
  banExpires: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const adminAPI = {
  // Get all users
  getUsers: async (): Promise<AdminUser[]> => {
    const response = await axiosInstance.get('/api/users');
    return response.data;
  },
  
  // Get user by ID
  getUserById: async (userId: string): Promise<AdminUser> => {
    const response = await axiosInstance.get(`/api/users/${userId}`);
    return response.data;
  },
  
  // Ban user
  banUser: async (userId: string, reason: string, expires: string): Promise<void> => {
    await axiosInstance.put(`/api/users/${userId}/ban`, { reason, expires });
  },
  
  // Unban user
  unbanUser: async (userId: string): Promise<void> => {
    await axiosInstance.put(`/api/users/${userId}/unban`);
  },
  
  // Update user role
  updateUserRole: async (userId: string, role: string): Promise<void> => {
    await axiosInstance.put(`/api/users/${userId}/role`, { role });
  },
};

