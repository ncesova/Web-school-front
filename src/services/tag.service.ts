const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface Tag {
  name: string;
}

export interface TeacherSearchResult {
  teacherId: string;
  teacherName: string;
  teacherSurname: string;
  aboutTeacher: string;
  canHelpWith: string;
  tagsId: string[];
}

export const tagService = {
  getAllTags: async () => {
    const response = await fetch(`${API_URL}/tags`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tags: ${response.statusText}`);
    }

    return response.json();
  },

  createTag: async ({name}: Tag) => {
    const response = await fetch(`${API_URL}/tags`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({name}),
    });

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error("Tag name already exists");
      }
      throw new Error(`Failed to create tag: ${response.statusText}`);
    }

    return response.json();
  },

  searchTeachersByTags: async (
    tags: string[]
  ): Promise<TeacherSearchResult[]> => {
    console.log(tags);
    const queryString = tags.map((tag) => `tags=${tag}`).join("&");
    const response = await fetch(
      `${API_URL}/teachers-info/search?${queryString}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to search teachers: ${response.statusText}`);
    }

    return response.json();
  },
};
