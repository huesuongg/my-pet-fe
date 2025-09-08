export interface LoginPayload {
    username: string,
    password: string,
    rememberClient: boolean
}

export type AuthResult = {
    accessToken: string;
    encryptedAccessToken: string;
    expireInSeconds: number;
    userId: number;
  };
  