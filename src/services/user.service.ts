import {User} from "../types/user";
import {authService} from "./auth.service";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const userService = {
  async getUserById(userId: string): Promise<User> {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },
};
