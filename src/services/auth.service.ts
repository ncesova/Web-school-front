import type {LoginRequest, LoginResponse, SignupRequest} from "../types/auth";

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

      const data = await response.json();
      // Store the token in localStorage
      localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      throw error;
    }
  },

  async signup(userData: SignupRequest): Promise<void> {
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
    } catch (error) {
      throw error;
    }
  },

  logout() {
    localStorage.removeItem("token");
  },

  getToken() {
    return localStorage.getItem("token");
  },

  isAuthenticated(): boolean {
    // Check if user has valid token or auth state
    const token = localStorage.getItem("token");
    return !!token;
  },
};
