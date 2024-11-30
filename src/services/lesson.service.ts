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

  uploadSummary: async (
    lessonId: string,
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<void> => {
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed"));
      });

      xhr.open("POST", `${API_URL}/lessons/${lessonId}/summary`);
      xhr.setRequestHeader(
        "Authorization",
        `Bearer ${localStorage.getItem("token")}`
      );
      xhr.send(formData);
    });
  },

  downloadSummary: async (lessonId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/lessons/${lessonId}/summary`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download summary: ${response.statusText}`);
    }

    // Get filename from Content-Disposition header if available
    const contentDisposition = response.headers.get("Content-Disposition");
    let filename = `lesson-${lessonId}-summary`;
    if (contentDisposition) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
        contentDisposition
      );
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, "");
      }
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  deleteSummary: async (lessonId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/lessons/${lessonId}/summary`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete summary: ${response.statusText}`);
    }
  },
};
