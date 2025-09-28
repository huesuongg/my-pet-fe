import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { login, register } from '../authThunk';
import { logout, clearError } from '../authSlice';
import { LoginPayload, RegisterPayload } from '../types';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);

  const handleLogin = (credentials: LoginPayload) => {
    dispatch(login(credentials));
  };

  const handleRegister = (userData: RegisterPayload) => {
    dispatch(register(userData));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    ...authState,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    clearError: clearAuthError,
  };
};

export const useUser = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  return {
    user,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    isDoctor: user?.role === 'doctor',
    isUser: user?.role === 'user',
  };
};
