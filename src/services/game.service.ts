const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface Game {
  id: string;
  name: string;
}

export const gameService = {
  getAllGames: async (): Promise<Game[]> => {
    const response = await fetch(`${API_URL}/games`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch games: ${response.statusText}`);
    }

    return response.json();
  },
};
