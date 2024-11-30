const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface Grade {
  studentId: string;
  lessonId: string;
  grade: number;
  comment?: string;
}

export const gradeService = {
  getStudentGrades: async (studentId: string): Promise<Grade[]> => {
    console.log(`Fetching grades for student ${studentId}`);
    const response = await fetch(`${API_URL}/grades/student/${studentId}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch student grades:", response.statusText);
      throw new Error(`Failed to fetch student grades: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Received student grades:", data);
    return data;
  },

  getClassroomGrades: async (
    classroomId: string
  ): Promise<Record<string, Grade[]>> => {
    console.log(`Fetching grades for classroom ${classroomId}`);
    const response = await fetch(`${API_URL}/grades/classroom/${classroomId}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch classroom grades:", response.statusText);
      throw new Error(
        `Failed to fetch classroom grades: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Received classroom grades:", data);
    return data;
  },

  getLessonGrades: async (lessonId: string): Promise<Grade[]> => {
    console.log(`Fetching grades for lesson ${lessonId}`);
    const response = await fetch(`${API_URL}/grades/lesson/${lessonId}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch lesson grades:", response.statusText);
      throw new Error(`Failed to fetch lesson grades: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Received lesson grades:", data);
    return data;
  },

  addGrade: async (
    lessonId: string,
    data: {studentId: string; grade: number; comment?: string}
  ): Promise<void> => {
    console.log(`Adding grade for lesson ${lessonId}:`, data);
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
      console.error("Failed to add grade:", response.statusText);
      throw new Error(`Failed to add grade: ${response.statusText}`);
    }
  },
};
