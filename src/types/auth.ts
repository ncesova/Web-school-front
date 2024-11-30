export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface SignupRequest {
  username: string;
  password: string;
  name?: string;
  surname?: string;
  roleId: number;
}

export interface ApiError {
  message: string;
  status: number;
}

export enum UserRole {
  Student = 1,
  Parent = 2,
  Teacher = 3,
}
