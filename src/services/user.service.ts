import {User} from "../types/user";
import {authService} from "./auth.service";
import {UserRole} from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const userService = {
  async getUserById(userId: string): Promise<User> {
    console.log("getUserById called with userId:", userId);
    try {
      const token = authService.getToken();
      console.log("Got token:", token ? "exists" : "missing");

      const response = await fetch(`${API_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("API response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API error:", errorData);
        throw new Error(errorData.message || "Failed to fetch user details");
      }

      const userData = await response.json();
      console.log("Received user data:", userData);
      return userData;
    } catch (error) {
      console.error("getUserById error:", error);
      throw error;
    }
  },

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    console.log("updateUser called with:", {userId, userData});
    try {
      const token = authService.getToken();
      console.log("Got token:", token ? "exists" : "missing");

      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      console.log("API response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API error:", errorData);
        throw new Error(errorData.message || "Failed to update user details");
      }

      const updatedUserData = await response.json();
      console.log("Received updated user data:", updatedUserData);
      return updatedUserData;
    } catch (error) {
      console.error("updateUser error:", error);
      throw error;
    }
  },

  getAllStudents: async (): Promise<User[]> => {
    const response = await fetch(`${API_URL}/users`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    const users = await response.json();
    // Filter only students (roleId === 1 for students)
    return users.filter((user) => user.roleId === UserRole.Student);
  },
};
