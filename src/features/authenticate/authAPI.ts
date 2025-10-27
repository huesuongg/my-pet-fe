import axiosInstance from "../../services/axiosInstance";
import { LoginPayload, RegisterPayload, User, RegisterRequestPayload, VerifyRegisterPayload, LoginRequestPayload, LoginResponse } from "./types";

export const loginAPI = async (data: LoginPayload): Promise<LoginResponse> => {
  const payload: LoginRequestPayload = {
    usernameOrEmail: data.username,
    password: data.password
  };
  
  const response = await axiosInstance.post('/api/auth/login', payload);
  
  return {
    user: response.data.user,
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken
  };
};

export const registerAPI = async (data: RegisterPayload): Promise<void> => {
  // Send register request to get OTP
  const registerPayload: RegisterRequestPayload = {
    fullname: data.fullName,
    username: data.username,
    email: data.email,
    password: data.password
  };
  
  await axiosInstance.post('/api/auth/register-request', registerPayload);
};

export const verifyRegisterAPI = async (data: VerifyRegisterPayload): Promise<LoginResponse> => {
  const payload: VerifyRegisterPayload = {
    email: data.email,
    otp: data.otp
  };
  
  const response = await axiosInstance.post('/api/auth/verify-register', payload);
  
  return {
    user: response.data.user,
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken
  };
};

export const logoutAPI = async (): Promise<void> => {
  await axiosInstance.post('/api/auth/logout');
};

export const getUserByIdAPI = async (userId: number): Promise<{ data: User }> => {
  const response = await axiosInstance.get(`/api/users/${userId}`);
  
  if (!response.data) {
    throw new Error('User not found');
  }

  return { data: response.data };
};
