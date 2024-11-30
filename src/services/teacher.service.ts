import {authService} from "./auth.service";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface TeacherInfo {
  tagsId?: string;
  aboutTeacher?: string;
  canHelpWith?: string;
  resume?: string;
}

export const teacherService = {
  async getTeacherInfo(): Promise<TeacherInfo> {
    console.log("Getting teacher info");
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/teacher-info`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Teacher info response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API error:", errorData);
        throw new Error(errorData.message || "Failed to fetch teacher info");
      }

      const data = await response.json();
      console.log("Received teacher info:", data);
      return data;
    } catch (error) {
      console.error("getTeacherInfo error:", error);
      throw error;
    }
  },

  async createTeacherInfo(data: TeacherInfo): Promise<void> {
    console.log("Creating teacher info:", data);
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/teacher-info`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("Create teacher info response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API error:", errorData);
        throw new Error(errorData.message || "Failed to create teacher info");
      }
    } catch (error) {
      console.error("createTeacherInfo error:", error);
      throw error;
    }
  },

  async updateTeacherInfo(data: TeacherInfo): Promise<void> {
    console.log("Updating teacher info:", data);
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/teacher-info`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("Update teacher info response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API error:", errorData);
        throw new Error(errorData.message || "Failed to update teacher info");
      }
    } catch (error) {
      console.error("updateTeacherInfo error:", error);
      throw error;
    }
  },
};
