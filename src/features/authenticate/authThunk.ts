import { LoginPayload, RegisterPayload, User } from './types';
import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI, registerAPI, getUserByIdAPI } from './authAPI';
import { RejectPayload } from '../../types';

export const login = createAsyncThunk<
  { authResult: any; user: User }, 
  LoginPayload,
  { rejectValue: RejectPayload }
>("auth/login", async(data: LoginPayload, {rejectWithValue}) => {
  try{
    const response = await loginAPI(data);
    const userResponse = await getUserByIdAPI(response.data.result.userId);
    return {
      authResult: response.data.result,
      user: userResponse.data
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
  { authResult: any; user: User }, 
  RegisterPayload,
  { rejectValue: RejectPayload }
>("auth/register", async(data: RegisterPayload, {rejectWithValue}) => {
  try{
    const response = await registerAPI(data);
    const userResponse = await getUserByIdAPI(response.data.result.userId);
    return {
      authResult: response.data.result,
      user: userResponse.data
    };
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
  number,
  { rejectValue: RejectPayload }
>("auth/getUserById", async(userId: number, {rejectWithValue}) => {
  try{
    const response = await getUserByIdAPI(userId);
    return response.data;
  }catch(err){
    const error = err as Error;
    return rejectWithValue({
      status: 400,
      message: error.message,
    });
  }
});