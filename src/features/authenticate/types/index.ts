export interface LoginPayload {
    username: string,
    password: string,
    rememberClient: boolean
}

export interface RegisterPayload {
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
    fullName: string,
    phone: string
}

// API request types
export interface RegisterRequestPayload {
    fullname: string,
    username: string,
    email: string,
    password: string
}

export interface VerifyRegisterPayload {
    email: string,
    otp: string
}

export interface LoginRequestPayload {
    usernameOrEmail: string,
    password: string
}

export type AuthResult = {
    accessToken: string;
    refreshToken: string;
    encryptedAccessToken: string;
    expireInSeconds: number;
    userId: number;
};

export interface LoginResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    fullName?: string;
    phone?: string;
    role: 'admin' | 'customer' | 'doctor' | 'user';
    avatar?: string;
    isActive?: boolean;
    createdAt?: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    status: 'idle' | 'loading' | 'success' | 'error';
    error: string | undefined;
}
  