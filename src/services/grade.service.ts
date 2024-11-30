const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface Grade {
  studentId: string;
  grade: number;
  comment?: string;
  lessonId: string;
}

export interface AddGradeRequest {
  studentId: string;
  grade: number;
  comment?: string;
}

export const gradeService = {
  addGrade: async (lessonId: string, data: AddGradeRequest): Promise<Grade> => {
    const response = await fetch(`${API_URL}/grades/lesson/${lessonId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to add grade: ${response.statusText}`);
    }

    return response.json();
  },

  getLessonGrades: async (lessonId: string): Promise<Grade[]> => {
    const response = await fetch(`${API_URL}/grades/lesson/${lessonId}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch lesson grades: ${response.statusText}`);
    }

    return response.json();
  },

  getStudentGrades: async (studentId: string): Promise<Grade[]> => {
    const response = await fetch(`${API_URL}/grades/student/${studentId}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch student grades: ${response.statusText}`);
    }

    return response.json();
  },

  getClassroomGrades: async (
    classroomId: string
  ): Promise<Record<string, Grade[]>> => {
    const response = await fetch(`${API_URL}/grades/classroom/${classroomId}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch classroom grades: ${response.statusText}`
      );
    }

    return response.json();
  },

  deleteGrade: async (lessonId: string, studentId: string): Promise<void> => {
    const response = await fetch(
      `${API_URL}/grades/lesson/${lessonId}/student/${studentId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete grade: ${response.statusText}`);
    }
  },
};
