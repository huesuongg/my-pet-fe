import { createSlice } from "@reduxjs/toolkit";
import { login } from "./authThunk";
import { RejectPayload } from "../../types";
import { RequestStatus } from "../../types";

interface AuthState {
  userId: number;
  status: RequestStatus;
  error: string |undefined;
}

const initialState: AuthState = {userId: 0, status: "idle", error: undefined};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.userId = 0;
      state.error = undefined;
    }
  },          
  extraReducers: (builder) => {
    builder
    // login action
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "success";
        const data = action.payload;
        state.userId = data.userId;
        state.error = undefined;
        if (data.accessToken) {
          localStorage.setItem("token", data.accessToken);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "error";
        const payload = action.payload as RejectPayload;
        state.error = payload.message;
      });
                  
  },
});
export const { logout } = authSlice.actions;

export default authSlice.reducer;