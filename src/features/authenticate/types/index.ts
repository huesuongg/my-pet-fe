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

export type AuthResult = {
    accessToken: string;
    encryptedAccessToken: string;
    expireInSeconds: number;
    userId: number;
};

export interface User {
    id: number;
    username: string;
    email: string;
    fullName: string;
    phone: string;
    role: 'admin' | 'user' | 'doctor';
    avatar?: string;
    isActive: boolean;
    createdAt: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    status: 'idle' | 'loading' | 'success' | 'error';
    error: string | undefined;
}
  