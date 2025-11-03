import { LoginPayload, RegisterPayload, User } from './types';
import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI, registerAPI, getUserByIdAPI, verifyRegisterAPI, logoutAPI, updateUserAPI, UpdateUserPayload } from './authAPI';
import { RejectPayload } from '../../types';

export const login = createAsyncThunk<
  { user: User; accessToken: string; refreshToken: string }, 
  LoginPayload,
  { rejectValue: RejectPayload }
>("auth/login", async(data: LoginPayload, {rejectWithValue}) => {
  try{
    const response = await loginAPI(data);
    return {
      user: response.user,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken
    };
  }catch(err){
    const error = err as Error;
    return rejectWithValue({
      status: 400,
      message: error.message,
    });
  }
});

export const register = createAsyncThunk<
  void, 
  RegisterPayload,
  { rejectValue: RejectPayload }
>("auth/register", async(data: RegisterPayload, {rejectWithValue}) => {
  try{
    await registerAPI(data);
  }catch(err){
    const error = err as Error;
    return rejectWithValue({
      status: 400,
      message: error.message,
    });
  }
});

export const verifyRegister = createAsyncThunk<
  { user: User; accessToken: string; refreshToken: string }, 
  { email: string; otp: string },
  { rejectValue: RejectPayload }
>("auth/verifyRegister", async(data: { email: string; otp: string }, {rejectWithValue}) => {
  try{
    const response = await verifyRegisterAPI({ email: data.email, otp: data.otp });
    return {
      user: response.user,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken
    };
  }catch(err){
    const error = err as Error;
    return rejectWithValue({
      status: 400,
      message: error.message,
    });
  }
});

export const logoutThunk = createAsyncThunk<
  void, 
  void,
  { rejectValue: RejectPayload }
>("auth/logout", async(_, {rejectWithValue}) => {
  try{
    await logoutAPI();
  }catch(err){
    const error = err as Error;
    return rejectWithValue({
      status: 400,
      message: error.message,
    });
  }
});

export const getUserById = createAsyncThunk<
  User, 
  number | string,
  { rejectValue: RejectPayload }
>("auth/getUserById", async(userId: number | string, {rejectWithValue}) => {
  try{
    const response = await getUserByIdAPI(userId);
    const userData = response.data;
    
    // Update localStorage với user data mới nhất
    localStorage.setItem("user", JSON.stringify(userData));
    
    return userData;
  }catch(err){
    const error = err as Error;
    return rejectWithValue({
      status: 400,
      message: error.message,
    });
  }
});

export const updateUser = createAsyncThunk<
  User,
  { userId: string; payload: UpdateUserPayload },
  { rejectValue: RejectPayload }
>("auth/updateUser", async({ userId, payload }, {rejectWithValue}) => {
  try{
    const updatedUser = await updateUserAPI(userId, payload);
    return updatedUser;
  }catch(err){
    const error = err as Error;
    return rejectWithValue({
      status: 400,
      message: error.message,
    });
  }
});