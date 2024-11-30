export enum UserRole {
  Student = 1,
  Parent = 2,
  Teacher = 3,
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  roleId: UserRole;
}

export interface SignupRequest {
  username: string;
  password: string;
  name?: string;
  surname?: string;
  roleId: UserRole;
}

export interface SignupResponse {
  token: string;
  userId: string;
  roleId: UserRole;
}

export interface ApiError {
  message: string;
  status: number;
}
