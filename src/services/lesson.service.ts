const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface CreateLessonRequest {
  name: string;
  description?: string;
  classroomId: string;
  gameIds?: string[];
}

export interface Lesson {
  id: string;
  name: string;
  description?: string;
  gameIds?: string[];
}

export const lessonService = {
  createLesson: async (data: CreateLessonRequest): Promise<Lesson> => {
    const response = await fetch(`${API_URL}/lessons`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create lesson: ${response.statusText}`);
    }

    return response.json();
  },

  getClassroomLessons: async (classroomId: string): Promise<Lesson[]> => {
    const response = await fetch(
      `${API_URL}/lessons/classroom/${classroomId}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch lessons: ${response.statusText}`);
    }

    return response.json();
  },

  getLessonById: async (id: string): Promise<Lesson> => {
    const response = await fetch(`${API_URL}/lessons/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch lesson: ${response.statusText}`);
    }

    return response.json();
  },

  deleteLesson: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/lessons/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete lesson: ${response.statusText}`);
    }
  },
};
