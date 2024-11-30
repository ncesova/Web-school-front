import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  UserRole,
} from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data: LoginResponse = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("roleId", data.roleId);
      return data;
    } catch (error) {
      throw error;
    }
  },

  async signup(userData: SignupRequest): Promise<SignupResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      const data: SignupResponse = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("roleId", data.roleId);
      return data;
    } catch (error) {
      throw error;
    }
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("roleId");
  },

  getToken() {
    return localStorage.getItem("token");
  },

  getUserId() {
    return localStorage.getItem("userId");
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    return !!token;
  },

  getUserRole(): UserRole | null {
    const roleId = localStorage.getItem("roleId");
    return roleId ? (Number(roleId) as UserRole) : null;
  },
};
