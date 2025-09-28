
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface PrivateRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'user' | 'doctor';
}

export const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);
  const token = localStorage.getItem('token');

  // Check if user is authenticated
  if (!isAuthenticated || !token) {
    if (location.pathname !== '/login' && location.pathname !== '/logout') {
      alert("Bạn cần đăng nhập để truy cập trang này.");
    }
    return <Navigate to="/login" replace />;
  }

  // Check role if required
  if (requiredRole && user?.role !== requiredRole) {
    alert(`Bạn cần quyền ${requiredRole} để truy cập trang này.`);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};