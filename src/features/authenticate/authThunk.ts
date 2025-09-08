import { LoginPayload } from './types';
import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI } from './authAPI';
import { AxiosError } from "axios";
import { RejectPayload } from '../../types';
import { AuthResult } from './types';
import { APIErrorResponse } from '../../types';

export const login = createAsyncThunk<
AuthResult, 
LoginPayload,
{ rejectValue: RejectPayload }>("auth/login",async(data: LoginPayload, {rejectWithValue}) => {
  try{
    const response = await loginAPI(data);
    return response.data.result;
  }catch(err){
    const error = err as AxiosError;
    const apiError = error.response?.data as APIErrorResponse;
    return rejectWithValue({
      status: error.response?.status,
      message: apiError?.error?.message,
    });
  }
});