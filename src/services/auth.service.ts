import type {LoginRequest, LoginResponse} from "../types/auth";

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

  logout() {
    localStorage.removeItem("token");
  },

  getToken() {
    return localStorage.getItem("token");
  },
};
