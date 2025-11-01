import { createSlice } from "@reduxjs/toolkit";
import { login, register, getUserById, verifyRegister, logoutThunk, updateUser } from "./authThunk";
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
      // Tạo object mới để đảm bảo Redux detect được sự thay đổi
      state.user = { ...action.payload };
      state.isAuthenticated = true;
      state.userId = action.payload.id;
      // Cũng update localStorage khi setUser được gọi
      localStorage.setItem("user", JSON.stringify(action.payload));
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
        // Tạo object mới để đảm bảo Redux detect được sự thay đổi
        state.user = { ...action.payload };
        state.isAuthenticated = true;
        state.userId = action.payload.id;
        state.error = undefined;
        
        // Update localStorage với user data mới nhất
        localStorage.setItem("user", JSON.stringify(action.payload));
        
        console.log('========= authSlice: getUserById.fulfilled =========');
        console.log('State.user updated:', state.user);
        console.log('Avatar:', state.user.avatar);
        console.log('BackgroundImg:', state.user.backgroundImg);
        console.log('====================================================');
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
      })
    // updateUser action
      .addCase(updateUser.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = "success";
        // Tạo object mới để đảm bảo Redux detect được sự thay đổi
        state.user = { ...action.payload };
        state.isAuthenticated = true;
        state.userId = action.payload.id;
        state.error = undefined;
        
        // Update user in localStorage
        localStorage.setItem("user", JSON.stringify(action.payload));
        
        console.log('========= authSlice: updateUser.fulfilled =========');
        console.log('State.user updated:', state.user);
        console.log('Avatar:', state.user.avatar);
        console.log('BackgroundImg:', state.user.backgroundImg);
        console.log('====================================================');
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "error";
        const payload = action.payload as RejectPayload;
        state.error = payload.message;
      });
  },
});

export const { logout, setUser, clearError } = authSlice.actions;

export default authSlice.reducer;