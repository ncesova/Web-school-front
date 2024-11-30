const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface LeaderboardEntry {
  userId: string;
  username: string;
  name?: string;
  surname?: string;
  value: number;
  createdAt: string;
}

export interface LeaderboardResponse {
  data: LeaderboardEntry[];
  pagination: {
    total: number;
    pageSize: number;
    offset: number;
  };
}

export const leaderboardService = {
  addScore: async (
    gameId: string,
    value: number
  ): Promise<LeaderboardEntry> => {
    console.log(`Adding score for game ${gameId}:`, value);
    const response = await fetch(`${API_URL}/leaderboard`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({gameId, value}),
    });

    if (!response.ok) {
      throw new Error(`Failed to add score: ${response.statusText}`);
    }

    return response.json();
  },

  getGameLeaderboard: async (
    gameId: string,
    page = 1,
    limit = 10
  ): Promise<LeaderboardResponse> => {
    console.log(`Fetching leaderboard for game ${gameId}`);
    const response = await fetch(
      `${API_URL}/leaderboard/game/${gameId}?page=${page}&limit=${limit}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch game leaderboard: ${response.statusText}`
      );
    }

    return response.json();
  },

  getClassroomLeaderboard: async (
    classroomId: string,
    page = 1,
    limit = 10
  ): Promise<LeaderboardResponse> => {
    console.log(`Fetching leaderboard for classroom ${classroomId}`);
    const response = await fetch(
      `${API_URL}/leaderboard/classroom/${classroomId}?page=${page}&limit=${limit}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch classroom leaderboard: ${response.statusText}`
      );
    }

    return response.json();
  },

  getUserScores: async (
    userId: string,
    page = 1,
    limit = 10
  ): Promise<LeaderboardResponse> => {
    console.log(`Fetching scores for user ${userId}`);
    const response = await fetch(
      `${API_URL}/leaderboard/user/${userId}?page=${page}&limit=${limit}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch user scores: ${response.statusText}`);
    }

    return response.json();
  },
};
