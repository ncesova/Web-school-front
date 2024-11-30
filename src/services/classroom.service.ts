import {authService} from "./auth.service";
import type {
  Classroom,
  CreateClassroomRequest,
  AddUsersToClassroomRequest,
} from "../types/classroom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface AddUsersToClassroomRequest {
  userIds: string[];
}

export const classroomService = {
  async createClassroom(data: CreateClassroomRequest): Promise<Classroom> {
    console.log("Creating classroom:", data);
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/classroom`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create classroom");
      }

      return response.json();
    } catch (error) {
      console.error("createClassroom error:", error);
      throw error;
    }
  },

  async deleteClassroom(id: string): Promise<void> {
    console.log("Deleting classroom:", id);
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/classroom/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete classroom");
      }
    } catch (error) {
      console.error("deleteClassroom error:", error);
      throw error;
    }
  },

  async getTeacherClassrooms(): Promise<Classroom[]> {
    console.log("Getting teacher's classrooms");
    try {
      const token = authService.getToken();
      console.log("Using token:", token ? "exists" : "missing");

      const response = await fetch(`${API_URL}/classroom/teacher`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Classroom response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API error response:", errorData);
        throw new Error(errorData.message || "Failed to fetch classrooms");
      }

      const data = await response.json();
      console.log("Received classrooms:", data);
      return data;
    } catch (error) {
      console.error("getTeacherClassrooms error:", error);
      throw error;
    }
  },

  async getClassroomDetails(id: string): Promise<Classroom> {
    console.log("Getting classroom details:", id);
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/classroom/${id}/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to fetch classroom details"
        );
      }

      return response.json();
    } catch (error) {
      console.error("getClassroomDetails error:", error);
      throw error;
    }
  },

  async addUsersToClassroom(
    classroomId: string,
    data: AddUsersToClassroomRequest
  ): Promise<void> {
    console.log("Adding users to classroom:", {classroomId, data});
    try {
      const token = authService.getToken();
      const response = await fetch(
        `${API_URL}/classroom/${classroomId}/users`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to add users to classroom"
        );
      }
    } catch (error) {
      console.error("addUsersToClassroom error:", error);
      throw error;
    }
  },

  async removeUsersFromClassroom(
    classroomId: string,
    data: AddUsersToClassroomRequest
  ): Promise<void> {
    console.log("Removing users from classroom:", {classroomId, data});
    try {
      const token = authService.getToken();
      const response = await fetch(
        `${API_URL}/classroom/${classroomId}/users`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to remove users from classroom"
        );
      }
    } catch (error) {
      console.error("removeUsersFromClassroom error:", error);
      throw error;
    }
  },
};
