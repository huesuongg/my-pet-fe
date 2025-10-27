import { createSlice } from "@reduxjs/toolkit";
import { login, register, getUserById, verifyRegister, logoutThunk } from "./authThunk";
import { RejectPayload } from "../../types";
import { RequestStatus } from "../../types";
import { User } from "./types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  userId: string;
  status: RequestStatus;
  error: string | undefined;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  userId: "",
  status: "idle",
  error: undefined
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      state.user = null;
      state.isAuthenticated = false;
      state.userId = "";
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
        const { user, accessToken, refreshToken } = action.payload;
        state.user = user;
        state.isAuthenticated = true;
        state.userId = user.id;
        state.error = undefined;
        
        // Store tokens in localStorage
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
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
      .addCase(register.fulfilled, (state) => {
        state.status = "success";
        state.error = undefined;
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
      })
    // verifyRegister action
      .addCase(verifyRegister.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(verifyRegister.fulfilled, (state, action) => {
        state.status = "success";
        const { user, accessToken, refreshToken } = action.payload;
        state.user = user;
        state.isAuthenticated = true;
        state.userId = user.id;
        state.error = undefined;
        
        // Store tokens in localStorage
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
      })
      .addCase(verifyRegister.rejected, (state, action) => {
        state.status = "error";
        const payload = action.payload as RejectPayload;
        state.error = payload.message;
        state.isAuthenticated = false;
      })
    // logoutThunk action
      .addCase(logoutThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        state.user = null;
        state.isAuthenticated = false;
        state.userId = "";
        state.error = undefined;
        state.status = "idle";
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        const payload = action.payload as RejectPayload;
        state.error = payload.message;
        state.status = "error";
      });
  },
});

export const { logout, setUser, clearError } = authSlice.actions;

export default authSlice.reducer;