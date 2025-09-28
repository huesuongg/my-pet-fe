// src/features/users/types.ts
export type Role = "Admin" | "Customer" | "Doctor";
export type Status = "Active" | "Banned";

export type User = {
  id: string;
  fullName: string;
  email: string;
  username: string;
  role: Role;
  status: Status;
  avatarUrl?: string;
};
