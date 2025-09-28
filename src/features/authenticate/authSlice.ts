import { createSlice } from "@reduxjs/toolkit";
import { login, register, getUserById } from "./authThunk";
import { RejectPayload } from "../../types";
import { RequestStatus } from "../../types";
import { User } from "./types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  userId: number;
  status: RequestStatus;
  error: string | undefined;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  userId: 0,
  status: "idle",
  error: undefined
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.user = null;
      state.isAuthenticated = false;
      state.userId = 0;
      state.error = undefined;
      state.status = "idle";
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.userId = action.payload.id;
    },
    clearError: (state) => {
      state.error = undefined;
    }
  },          
  extraReducers: (builder) => {
    builder
    // login action
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "success";
        const { authResult, user } = action.payload;
        state.user = user;
        state.isAuthenticated = true;
        state.userId = user.id;
        state.error = undefined;
        if (authResult.accessToken) {
          localStorage.setItem("token", authResult.accessToken);
          localStorage.setItem("user", JSON.stringify(user));
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "error";
        const payload = action.payload as RejectPayload;
        state.error = payload.message;
        state.isAuthenticated = false;
      })
    // register action
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "success";
        const { authResult, user } = action.payload;
        state.user = user;
        state.isAuthenticated = true;
        state.userId = user.id;
        state.error = undefined;
        if (authResult.accessToken) {
          localStorage.setItem("token", authResult.accessToken);
          localStorage.setItem("user", JSON.stringify(user));
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "error";
        const payload = action.payload as RejectPayload;
        state.error = payload.message;
        state.isAuthenticated = false;
      })
    // getUserById action
      .addCase(getUserById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload;
        state.isAuthenticated = true;
        state.userId = action.payload.id;
        state.error = undefined;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.status = "error";
        const payload = action.payload as RejectPayload;
        state.error = payload.message;
      });
  },
});

export const { logout, setUser, clearError } = authSlice.actions;

export default authSlice.reducer;