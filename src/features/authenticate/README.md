# Authentication System

## Tổng quan
Hệ thống authentication hoàn chỉnh với mock data, Redux state management, và role-based access control.

## Tính năng
- ✅ Đăng nhập (Login)
- ✅ Đăng ký (Register) 
- ✅ Quản lý state với Redux
- ✅ Role-based access control (admin, user, doctor)
- ✅ Private routes
- ✅ Mock data với 5 users mẫu
- ✅ Persistent storage với Redux Persist
- ✅ Auth Context và custom hooks

## Mock Users
```
admin / admin123 (role: admin)
user1 / user123 (role: user)
doctor1 / doctor123 (role: doctor)
user2 / user123 (role: user)
doctor2 / doctor123 (role: doctor)
```

## Cách sử dụng

### 1. Sử dụng Auth Hook
```tsx
import { useAuth, useUser } from '../features/authenticate/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const { isAdmin, isDoctor, isUser } = useUser();
  
  // Login
  const handleLogin = () => {
    login({ username: 'admin', password: 'admin123', rememberClient: false });
  };
  
  // Logout
  const handleLogout = () => {
    logout();
  };
}
```

### 2. Sử dụng Private Routes
```tsx
import { PrivateRoute } from '../routes/PrivateRoute';

// Route cho tất cả user đã đăng nhập
<PrivateRoute>
  <MyComponent />
</PrivateRoute>

// Route chỉ cho admin
<PrivateRoute requiredRole="admin">
  <AdminComponent />
</PrivateRoute>

// Route chỉ cho doctor
<PrivateRoute requiredRole="doctor">
  <DoctorComponent />
</PrivateRoute>
```

### 3. Sử dụng Auth Context
```tsx
import { useAuth } from '../features/authenticate/context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  return <div>Welcome {user?.fullName}!</div>;
}
```

## Cấu trúc Files
```
src/features/authenticate/
├── authAPI.ts              # Mock API functions
├── authSlice.ts            # Redux slice
├── authThunk.ts            # Redux thunks
├── mockData.ts             # Mock users data
├── types/
│   └── index.ts            # TypeScript interfaces
├── pages/
│   ├── LoginPage.tsx       # Login component
│   ├── RegisterPage.tsx    # Register component
│   └── Logout.tsx          # Logout component
├── context/
│   └── AuthContext.tsx     # Auth context provider
└── hooks/
    └── useAuth.ts          # Custom auth hooks
```

## Routes
- `/login` - Trang đăng nhập
- `/register` - Trang đăng ký
- `/logout` - Đăng xuất
- `/dashboard` - Dashboard (chỉ admin)
- `/private/*` - Các route yêu cầu đăng nhập

## State Management
- **Redux Store**: Lưu trữ user info, authentication status
- **Redux Persist**: Tự động lưu state vào localStorage
- **Auth Context**: Cung cấp auth state cho toàn app

## Security Features
- Role-based access control
- Token-based authentication
- Form validation
- Error handling
- Auto logout on invalid token
